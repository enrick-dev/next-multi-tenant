import type { GenerateThemeRequest } from "@dheme/sdk";

export interface TenantConfig {
  slug: string;
  name: string;
  description: string;
  themeRequest: GenerateThemeRequest;
}

export const DEFAULT_TENANT = "acme";

export const tenants: Record<string, TenantConfig> = {
  acme: {
    slug: "acme",
    name: "ACME Finance",
    description: "Modern fintech platform",
    themeRequest: {
      theme: "#2563EB",
      secondaryColor: "#0F172A",
      radius: 0.5,
      saturationAdjust: 0,
      lightnessAdjust: 0,
      contrastAdjust: 0,
      cardIsColored: false,
      backgroundIsColored: true,
    },
  },
  bloom: {
    slug: "bloom",
    name: "Bloom Health",
    description: "Digital health & wellness",
    themeRequest: {
      theme: "#16A34A",
      secondaryColor: "#064E3B",
      radius: 0.75,
      saturationAdjust: 0,
      lightnessAdjust: 0,
      contrastAdjust: 0,
      cardIsColored: false,
      backgroundIsColored: true,
    },
  },
  nova: {
    slug: "nova",
    name: "Nova Creative",
    description: "Bold creative studio",
    themeRequest: {
      theme: "#7C3AED",
      secondaryColor: "#EC4899",
      radius: 1.0,
      saturationAdjust: 10,
      lightnessAdjust: 0,
      contrastAdjust: 0,
      cardIsColored: false,
      backgroundIsColored: true,
    },
  },
};

export function getTenantConfig(slug: string): TenantConfig {
  return tenants[slug] ?? tenants[DEFAULT_TENANT];
}

export function getTenantSlugs(): string[] {
  return Object.keys(tenants);
}
