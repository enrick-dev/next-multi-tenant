"use client";

import Link from "next/link";
import { getTenantSlugs } from "@/config/tenants";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

interface TenantNavProps {
  tenantSlug: string;
  tenantName: string;
}

export function TenantNav({ tenantSlug, tenantName }: TenantNavProps) {
  const port = typeof window !== "undefined" ? window.location.port : "3000";
  const allTenants = getTenantSlugs();

  function tenantUrl(slug: string, path: string = "/") {
    if (typeof window === "undefined") return path;
    return `http://${slug}.localhost:${port}${path}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-primary">
            {tenantName}
          </span>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/demo"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Components
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 text-xs md:flex">
            {allTenants.map((slug) => (
              <a
                key={slug}
                href={tenantUrl(slug)}
                className={`rounded-md px-2.5 py-1 transition-colors ${
                  slug === tenantSlug
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {slug}
              </a>
            ))}
          </div>
          <ThemeModeToggle />
        </div>
      </div>
    </header>
  );
}
