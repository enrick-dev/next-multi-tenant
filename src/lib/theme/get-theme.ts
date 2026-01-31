import { cache } from "react";
import { DhemeClient } from "@dheme/sdk";
import type { GenerateThemeResponse } from "@dheme/sdk";
import { getTenantConfig } from "@/config/tenants";
import { getMockTheme } from "./mock-themes";

/**
 * Fetches the theme for a tenant — uses the real Dheme API if DHEME_API_KEY
 * is set, otherwise falls back to pre-generated mock themes.
 *
 * Wrapped in React cache() to deduplicate within a single request
 * (e.g. if both layout and page call getTheme).
 */
export const getTheme = cache(
  async (tenantSlug: string): Promise<GenerateThemeResponse> => {
    const apiKey = process.env.DHEME_API_KEY;

    if (apiKey) {
      try {
        const client = new DhemeClient({ apiKey });
        const config = getTenantConfig(tenantSlug);
        const { data } = await client.generateTheme(config.themeRequest);
        return data;
      } catch (error) {
        console.error(
          `[dheme] Failed to fetch theme for "${tenantSlug}", falling back to mock:`,
          error
        );
        return getMockTheme(tenantSlug);
      }
    }

    return getMockTheme(tenantSlug);
  }
);
