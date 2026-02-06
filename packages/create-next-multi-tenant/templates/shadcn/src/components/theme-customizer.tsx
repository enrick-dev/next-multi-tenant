"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  DhemeClient,
  formatHSLString,
  isValidHex,
  RateLimitError,
  AuthenticationError,
  ValidationError,
  NetworkError,
} from "@dheme/sdk";
import type { GenerateThemeResponse, HSLColor } from "@dheme/sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Paintbrush, X, Loader2, ExternalLink, RotateCcw } from "lucide-react";

const DHEME_BASE_URL =
  process.env.NEXT_PUBLIC_DHEME_BASE_URL || "https://dheme.com";
const DHEME_OAUTH_URL = `${DHEME_BASE_URL}/oauth/authorize`;
const DHEME_CLIENT_ID = "create-next-multi-tenant";
const LOCAL_STORAGE_KEY = "dheme_api_key";

function hslToCssValue(color: HSLColor): string {
  return `hsl(${formatHSLString(color)})`;
}

function applyThemeToDOM(theme: GenerateThemeResponse, mode: "light" | "dark") {
  const tokens = theme.colors[mode];
  const root = document.documentElement;

  const mapping: Record<string, HSLColor> = {
    "--background": tokens.background,
    "--foreground": tokens.foreground,
    "--card": tokens.card,
    "--card-foreground": tokens.cardForeground,
    "--popover": tokens.popover,
    "--popover-foreground": tokens.popoverForeground,
    "--primary": tokens.primary,
    "--primary-foreground": tokens.primaryForeground,
    "--secondary": tokens.secondary,
    "--secondary-foreground": tokens.secondaryForeground,
    "--muted": tokens.muted,
    "--muted-foreground": tokens.mutedForeground,
    "--accent": tokens.accent,
    "--accent-foreground": tokens.accentForeground,
    "--destructive": tokens.destructive,
    "--destructive-foreground": tokens.destructiveForeground,
    "--border": tokens.border,
    "--input": tokens.input,
    "--ring": tokens.ring,
  };

  for (const [prop, color] of Object.entries(mapping)) {
    root.style.setProperty(prop, hslToCssValue(color));
  }

  root.style.setProperty("--radius", `${theme.radius}rem`);
}

interface ThemeCustomizerProps {
  tenantSlug: string;
  initialPrimaryColor?: string;
}

export function ThemeCustomizer({
  tenantSlug,
  initialPrimaryColor = "#2563EB",
}: ThemeCustomizerProps) {
  const [open, setOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor);
  const [radius, setRadius] = useState(0.5);
  const [saturation, setSaturation] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTheme, setLastTheme] = useState<GenerateThemeResponse | null>(
    null,
  );
  const lastThemeRef = useRef<GenerateThemeResponse | null>(null);
  const [localApiKey, setLocalApiKey] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedKey) {
      setLocalApiKey(storedKey);
    }
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_DHEME_API_KEY || localApiKey;
  const hasApiKey = Boolean(apiKey);

  const handleApiKeyReceived = useCallback((key: string) => {
    setLocalApiKey(key);
  }, []);

  const detectMode = useCallback((): "light" | "dark" => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }, []);

  useEffect(() => {
    lastThemeRef.current = lastTheme;
  }, [lastTheme]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (lastThemeRef.current) {
        applyThemeToDOM(lastThemeRef.current, detectMode());
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [detectMode]);

  const handleGenerate = useCallback(async () => {
    if (!apiKey) return;

    if (!isValidHex(primaryColor)) {
      setError("Invalid HEX color. Use format like #3b82f6.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const client = new DhemeClient({ apiKey: apiKey! });
      const { data } = await client.generateTheme({
        theme: primaryColor,
        radius,
        saturationAdjust: saturation,
        contrastAdjust: contrast,
      });

      setLastTheme(data);
      applyThemeToDOM(data, detectMode());
    } catch (err) {
      if (err instanceof RateLimitError) {
        setError(
          `Rate limit exceeded. Resets at ${new Date(err.resetAt).toLocaleDateString()}.`,
        );
      } else if (err instanceof AuthenticationError) {
        setError("Invalid API key. Check your NEXT_PUBLIC_DHEME_API_KEY.");
      } else if (err instanceof ValidationError) {
        const fieldErrors = err.errors
          ? Object.values(err.errors).flat().join(", ")
          : err.message;
        setError(`Validation error: ${fieldErrors}`);
      } else if (err instanceof NetworkError) {
        setError("Network error. Check your connection and try again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to generate theme");
      }
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey, primaryColor, radius, saturation, contrast, detectMode]);

  const handleReset = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
        aria-label="Theme customizer"
      >
        {open ? <X className="h-5 w-5" /> : <Paintbrush className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80">
          <Card className="shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Theme Customizer
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  {tenantSlug}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Powered by Dheme API
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {!hasApiKey ? (
                <AuthGate onApiKeyReceived={handleApiKeyReceived} />
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs">Primary Color</Label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-9 w-9 cursor-pointer rounded border border-input p-0.5"
                        />
                      </div>
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#2563EB"
                        className="h-9 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Border Radius</Label>
                      <span className="text-xs text-muted-foreground">
                        {radius}rem
                      </span>
                    </div>
                    <Slider
                      value={[radius]}
                      onValueChange={([v]) => setRadius(v)}
                      min={0}
                      max={2}
                      step={0.125}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Saturation</Label>
                      <span className="text-xs text-muted-foreground">
                        {saturation > 0 ? `+${saturation}` : saturation}
                      </span>
                    </div>
                    <Slider
                      value={[saturation]}
                      onValueChange={([v]) => setSaturation(v)}
                      min={-100}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Contrast</Label>
                      <span className="text-xs text-muted-foreground">
                        {contrast > 0 ? `+${contrast}` : contrast}
                      </span>
                    </div>
                    <Slider
                      value={[contrast]}
                      onValueChange={([v]) => setContrast(v)}
                      min={-100}
                      max={100}
                      step={5}
                    />
                  </div>

                  <Separator />

                  {error && <p className="text-xs text-destructive">{error}</p>}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex-1"
                      size="sm"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Theme"
                      )}
                    </Button>
                    {lastTheme && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        title="Reset to original theme"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function AuthGate({
  onApiKeyReceived,
}: {
  onApiKeyReceived: (key: string) => void;
}) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = useCallback(() => {
    setIsConnecting(true);
    setError(null);

    const state = crypto.randomUUID();
    sessionStorage.setItem("dheme_oauth_state", state);

    const authUrl = new URL(DHEME_OAUTH_URL);
    authUrl.searchParams.set("client_id", DHEME_CLIENT_ID);
    authUrl.searchParams.set(
      "redirect_uri",
      `${window.location.origin}/api/dheme/callback`,
    );
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("scope", "api:generate");

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      authUrl.toString(),
      "dheme_oauth",
      `width=${width},height=${height},left=${left},top=${top},popup=1`,
    );

    if (!popup) {
      setError("Popup blocked. Please allow popups for this site.");
      setIsConnecting(false);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "dheme_oauth_success") {
        const { apiKey } = event.data;
        localStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
        onApiKeyReceived(apiKey);
        setIsConnecting(false);
        window.removeEventListener("message", handleMessage);
      } else if (event.data?.type === "dheme_oauth_error") {
        setError(event.data.error || "Authentication failed");
        setIsConnecting(false);
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setIsConnecting(false);
        window.removeEventListener("message", handleMessage);
      }
    }, 500);
  }, [onApiKeyReceived]);

  return (
    <div className="space-y-3 py-2 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5">
        <Paintbrush className="h-6 w-6 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Connect to Dheme</p>
        <p className="text-xs text-muted-foreground">
          Intelligent theme generator — create beautiful color palettes in
          seconds.
        </p>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button
        size="sm"
        className="w-full"
        onClick={handleConnect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            Connect to Dheme
            <ExternalLink className="ml-1.5 h-3 w-3" />
          </>
        )}
      </Button>
      <p className="text-[10px] text-muted-foreground">
        Free account includes 100 themes/month
      </p>
    </div>
  );
}
