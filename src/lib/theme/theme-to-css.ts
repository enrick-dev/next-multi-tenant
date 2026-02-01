import { formatHSLString } from "@dheme/sdk";
import type { GenerateThemeResponse, ColorTokens, HSLColor } from "@dheme/sdk";

function hsl(color: HSLColor): string {
  return `hsl(${formatHSLString(color)})`;
}

function tokensToCSSVars(tokens: ColorTokens): string {
  return [
    `  --background: ${hsl(tokens.background)};`,
    `  --foreground: ${hsl(tokens.foreground)};`,
    `  --card: ${hsl(tokens.card)};`,
    `  --card-foreground: ${hsl(tokens.cardForeground)};`,
    `  --popover: ${hsl(tokens.popover)};`,
    `  --popover-foreground: ${hsl(tokens.popoverForeground)};`,
    `  --primary: ${hsl(tokens.primary)};`,
    `  --primary-foreground: ${hsl(tokens.primaryForeground)};`,
    `  --secondary: ${hsl(tokens.secondary)};`,
    `  --secondary-foreground: ${hsl(tokens.secondaryForeground)};`,
    `  --muted: ${hsl(tokens.muted)};`,
    `  --muted-foreground: ${hsl(tokens.mutedForeground)};`,
    `  --accent: ${hsl(tokens.accent)};`,
    `  --accent-foreground: ${hsl(tokens.accentForeground)};`,
    `  --destructive: ${hsl(tokens.destructive)};`,
    `  --destructive-foreground: ${hsl(tokens.destructiveForeground)};`,
    `  --border: ${hsl(tokens.border)};`,
    `  --input: ${hsl(tokens.input)};`,
    `  --ring: ${hsl(tokens.ring)};`,
  ].join("\n");
}

/**
 * Converts a GenerateThemeResponse into a CSS string with :root and .dark selectors.
 * Injected server-side via <style> tag — no client JS needed.
 */
export function themeToCss(theme: GenerateThemeResponse): string {
  const lightVars = tokensToCSSVars(theme.colors.light);
  const darkVars = tokensToCSSVars(theme.colors.dark);

  const radius = `  --radius: ${theme.radius}rem;`;

  const bgVarsLight = theme.backgrounds
    ? [
        theme.backgrounds.primary?.light
          ? `  --background-primary: ${theme.backgrounds.primary.light};`
          : "",
        theme.backgrounds.secondary?.light
          ? `  --background-secondary: ${theme.backgrounds.secondary.light};`
          : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  const bgVarsDark = theme.backgrounds
    ? [
        theme.backgrounds.primary?.dark
          ? `  --background-primary: ${theme.backgrounds.primary.dark};`
          : "",
        theme.backgrounds.secondary?.dark
          ? `  --background-secondary: ${theme.backgrounds.secondary.dark};`
          : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return `:root {
${lightVars}
${radius}
${bgVarsLight}
}
.dark {
${darkVars}
${radius}
${bgVarsDark}
}`;
}
