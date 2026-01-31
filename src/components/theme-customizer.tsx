"use client";

import { useState, useCallback } from "react";
import { DhemeClient } from "@dheme/sdk";
import type { GenerateThemeResponse, HSLColor } from "@dheme/sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Paintbrush,
  X,
  Loader2,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

const DHEME_SIGNUP_URL = "https://theme.dheme.com/register";
const DHEME_LOGIN_URL = "https://theme.dheme.com/login";

function hslToCssValue(color: HSLColor): string {
  return `hsl(${color.h} ${color.s}% ${color.l}%)`;
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
    null
  );

  const apiKey = process.env.NEXT_PUBLIC_DHEME_API_KEY;
  const hasApiKey = Boolean(apiKey);

  const detectMode = useCallback((): "light" | "dark" => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!apiKey) return;

    setIsGenerating(true);
    setError(null);

    try {
      const client = new DhemeClient({ apiKey });
      const { data } = await client.generateTheme({
        theme: primaryColor,
        radius,
        saturationAdjust: saturation,
        contrastAdjust: contrast,
      });

      setLastTheme(data);
      applyThemeToDOM(data, detectMode());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to generate theme");
      }
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey, primaryColor, radius, saturation, contrast, detectMode]);

  const handleReset = useCallback(() => {
    // Reload to restore the original server-injected theme
    window.location.reload();
  }, []);

  // Apply theme in both modes when dark mode toggles
  const handleApplyToCurrentMode = useCallback(() => {
    if (lastTheme) {
      applyThemeToDOM(lastTheme, detectMode());
    }
  }, [lastTheme, detectMode]);

  // Listen for class changes on html element (dark mode toggle)
  if (typeof window !== "undefined" && lastTheme) {
    const observer = new MutationObserver(() => {
      handleApplyToCurrentMode();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
        aria-label="Theme customizer"
      >
        {open ? <X className="h-5 w-5" /> : <Paintbrush className="h-5 w-5" />}
      </button>

      {/* Customizer panel */}
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
                // Auth gate: no API key
                <AuthGate />
              ) : (
                // Customizer controls
                <>
                  {/* Primary color */}
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

                  {/* Radius */}
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

                  {/* Saturation */}
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

                  {/* Contrast */}
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

                  {/* Error */}
                  {error && (
                    <p className="text-xs text-destructive">{error}</p>
                  )}

                  {/* Actions */}
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

function AuthGate() {
  return (
    <div className="space-y-3 py-2 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Paintbrush className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Connect to Dheme</p>
        <p className="text-xs text-muted-foreground">
          Sign in or create a free account to customize themes in real-time.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Button size="sm" asChild>
          <a href={DHEME_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            Create Free Account
            <ExternalLink className="ml-1.5 h-3 w-3" />
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={DHEME_LOGIN_URL} target="_blank" rel="noopener noreferrer">
            Already have an account? Sign in
          </a>
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground">
        After signing in, add your API key to{" "}
        <code className="rounded bg-muted px-1 py-0.5">.env.local</code>
      </p>
    </div>
  );
}
