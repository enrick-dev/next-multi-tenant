import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Tenant slugs are validated at runtime in the layout via config.
// This list is used only to skip rewriting for non-tenant paths.
const RESERVED_PATHS = new Set(["api", "_next", "favicon.ico"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip reserved paths
  const firstSegment = pathname.split("/")[1];
  if (RESERVED_PATHS.has(firstSegment)) {
    return NextResponse.next();
  }

  const hostname = request.headers.get("host") || "localhost";
  const host = hostname.split(":")[0]; // Remove port
  const parts = host.split(".");

  // Determine tenant from subdomain
  // "acme.localhost" → ["acme", "localhost"] → tenant = "acme"
  // "localhost" → ["localhost"] → tenant = fallback
  // "acme.dheme.com" → ["acme", "dheme", "com"] → tenant = "acme"
  let tenant: string;

  if (parts.length > 1 && parts[0] !== "www") {
    tenant = parts[0];
  } else {
    tenant = "acme"; // Default tenant
  }

  // Rewrite: acme.localhost:3000/demo → /acme/demo (internal route)
  const url = request.nextUrl.clone();
  url.pathname = `/${tenant}${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
