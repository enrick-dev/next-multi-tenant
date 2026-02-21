"use client";

import { useEffect } from "react";
import { useTheme } from "@dheme/next";
import { formatHSLString } from "@dheme/sdk";
import type { ColorTokens, HSLColor } from "@dheme/sdk";

const TOKEN_MAP: [keyof ColorTokens, string][] = [
  ["background", "--background"],
  ["foreground", "--foreground"],
  ["card", "--card"],
  ["cardForeground", "--card-foreground"],
  ["popover", "--popover"],
  ["popoverForeground", "--popover-foreground"],
  ["primary", "--primary"],
  ["primaryForeground", "--primary-foreground"],
  ["secondary", "--secondary"],
  ["secondaryForeground", "--secondary-foreground"],
  ["muted", "--muted"],
  ["mutedForeground", "--muted-foreground"],
  ["accent", "--accent"],
  ["accentForeground", "--accent-foreground"],
  ["destructive", "--destructive"],
  ["destructiveForeground", "--destructive-foreground"],
  ["border", "--border"],
  ["input", "--input"],
  ["ring", "--ring"],
];

/**
 * Reads the active theme from DhemeProvider and applies CSS variables
 * in hsl() format — compatible with the @theme inline setup in globals.css
 * where variables are used directly as CSS colors via var(--primary) etc.
 *
 * Must be rendered inside <DhemeProvider>.
 */
export function ThemeApplier() {
  const { theme, mode } = useTheme();

  useEffect(() => {
    if (!theme) return;

    const tokens = theme.colors[mode];
    const root = document.documentElement;

    for (const [key, cssVar] of TOKEN_MAP) {
      root.style.setProperty(
        cssVar,
        `hsl(${formatHSLString(tokens[key] as HSLColor)})`,
      );
    }

    root.style.setProperty("--radius", `${theme.radius}rem`);
  }, [theme, mode]);

  return null;
}
