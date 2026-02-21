import { getTenantConfig } from "@/config/tenants";
import { TenantNav } from "@/components/tenant-nav";
import { ThemeApplier } from "@/components/theme-applier";
import { generateThemeStyles } from "@dheme/next/server";
import { DhemeProvider, ThemeGenerator } from "@dheme/next";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const config = getTenantConfig(tenant);
  return {
    title: `${config.name} | Dheme Multi-Tenant Kit`,
    description: config.description,
  };
}

/**
 * generateThemeStyles returns bare HSL values ("h s% l%").
 * globals.css uses var(--primary) directly as a CSS color, so the value
 * must be a valid color — wrap each bare HSL token in hsl().
 */
function wrapHsl(css: string): string {
  return css.replace(
    /(--[\w-]+):\s*([\d.]+\s+[\d.]+%\s+[\d.]+%)/g,
    "$1: hsl($2)",
  );
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant } = await params;
  const config = getTenantConfig(tenant);
  const apiKey = process.env.DHEME_API_KEY;

  const { theme, ...themeParams } = config.themeRequest;

  // Server-side CSS injection for zero FOUC.
  // generateThemeStyles has its own LRU cache, so subsequent requests are free.
  let inlineCss = "";
  if (apiKey) {
    try {
      const [lightCss, darkCss] = await Promise.all([
        generateThemeStyles({ apiKey, theme, themeParams, mode: "light" }),
        generateThemeStyles({ apiKey, theme, themeParams, mode: "dark" }),
      ]);
      inlineCss = `:root{${wrapHsl(lightCss)}}\n.dark{${wrapHsl(darkCss)}}`;
    } catch (error) {
      console.warn(
        "[dheme] Server-side theme generation failed — client will handle it:",
        error instanceof Error ? error.message : error,
      );
    }
  }

  return (
    <>
      {inlineCss && <style dangerouslySetInnerHTML={{ __html: inlineCss }} />}
      {/*
        autoApply={false}: DhemeProvider manages state and context but does NOT
        write CSS variables — ThemeApplier does that in hsl() format so it's
        compatible with the @theme inline setup in globals.css.
      */}
      <DhemeProvider
        apiKey={apiKey ?? ""}
        theme={theme}
        themeParams={themeParams}
        autoApply={false}
      >
        <div className="min-h-screen bg-background text-foreground">
          <TenantNav tenantSlug={config.slug} tenantName={config.name} />
          <main>{children}</main>
          <ThemeApplier />
          <ThemeGenerator defaultTheme={theme} />
        </div>
      </DhemeProvider>
    </>
  );
}
