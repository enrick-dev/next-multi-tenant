import { getTenantConfig } from "@/config/tenants";
import Link from "next/link";

const tenantHero: Record<
  string,
  { headline: string; subtitle: string; cta: string }
> = {
  acme: {
    headline: "Smart financial tools for modern teams",
    subtitle:
      "Track portfolios, monitor transactions, and manage revenue — all in a single dashboard built on Dheme theming.",
    cta: "Explore Dashboard",
  },
  bloom: {
    headline: "Patient-first health management",
    subtitle:
      "Streamline appointments, manage patient records, and coordinate care with a modern CRM powered by Dheme.",
    cta: "Explore CRM",
  },
  nova: {
    headline: "Creative project management, reimagined",
    subtitle:
      "Kanban boards, time tracking, and client project oversight — all themed dynamically with Dheme.",
    cta: "Explore ERP",
  },
};

interface TenantPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant } = await params;
  const config = getTenantConfig(tenant);
  const hero = tenantHero[config.slug] ?? tenantHero.acme;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <section className="space-y-6 pb-12 pt-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
            Tenant: {config.slug}
          </span>
          <span className="rounded-md border border-border px-2 py-1 text-xs">
            {config.description}
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-primary">{config.name}</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {hero.headline}
        </p>
        <p className="max-w-2xl text-muted-foreground">{hero.subtitle}</p>
        <div className="flex gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {hero.cta}
            <svg
              className="ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="https://dheme.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Documentation
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
          <div className="mb-2 h-8 w-8 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
            </svg>
          </div>
          <h3 className="font-semibold">Dynamic Theming</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Each tenant resolves its own theme via subdomain. Colors are
            injected server-side — no flash, no delay.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
          <div className="mb-2 h-8 w-8 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
              <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
              <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
            </svg>
          </div>
          <h3 className="font-semibold">Multi-Tenant</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Proxy detects the subdomain and rewrites to the correct tenant
            route. Add new tenants with a single config entry.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
          <div className="mb-2 h-8 w-8 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
          </div>
          <h3 className="font-semibold">Mock or Live</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Works instantly with pre-generated mocks. Set your Dheme API key to
            fetch real themes from the API.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="space-y-3">
          {[
            {
              step: "1",
              title: "Subdomain detected",
              desc: `You accessed ${config.slug}.localhost — the proxy extracts "${config.slug}" as the tenant.`,
            },
            {
              step: "2",
              title: "Theme resolved",
              desc: "The server layout fetches the theme (mock or live API) based on tenant config.",
            },
            {
              step: "3",
              title: "CSS injected",
              desc: "Theme tokens are converted to CSS variables and injected via a <style> tag — SSR, no FOUC.",
            },
            {
              step: "4",
              title: "Components themed",
              desc: "Components automatically use the CSS variables. No per-tenant code needed.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {item.step}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Theme Colors Preview */}
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">Theme Colors</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {[
            { name: "Primary", var: "--primary" },
            { name: "Secondary", var: "--secondary" },
            { name: "Background", var: "--background" },
            { name: "Foreground", var: "--foreground" },
            { name: "Muted", var: "--muted" },
            { name: "Accent", var: "--accent" },
          ].map((color) => (
            <div key={color.var} className="space-y-1">
              <div
                className="h-12 w-full rounded-md border border-border"
                style={{ backgroundColor: `var(${color.var})` }}
              />
              <p className="text-center text-xs text-muted-foreground">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
