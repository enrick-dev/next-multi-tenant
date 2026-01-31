import { tenants, DEFAULT_TENANT } from "@/config/tenants";

/**
 * Extracts the tenant slug from a hostname.
 * e.g. "acme.localhost:3000" → "acme"
 * e.g. "localhost:3000" → DEFAULT_TENANT
 * e.g. "acme.dheme.com" → "acme"
 */
export function resolveTenantFromHostname(hostname: string): string {
  // Remove port
  const host = hostname.split(":")[0];

  // Check for subdomain pattern: <tenant>.localhost or <tenant>.<domain>.<tld>
  const parts = host.split(".");

  // "localhost" → no subdomain
  if (parts.length === 1) {
    return DEFAULT_TENANT;
  }

  // "acme.localhost" → subdomain = "acme"
  // "acme.dheme.com" → subdomain = "acme"
  const subdomain = parts[0];

  // Ignore common non-tenant subdomains
  if (subdomain === "www" || subdomain === "api") {
    return DEFAULT_TENANT;
  }

  // Validate against registered tenants
  if (subdomain in tenants) {
    return subdomain;
  }

  return DEFAULT_TENANT;
}

/**
 * Checks if a given slug is a valid registered tenant.
 */
export function isValidTenant(slug: string): boolean {
  return slug in tenants;
}
