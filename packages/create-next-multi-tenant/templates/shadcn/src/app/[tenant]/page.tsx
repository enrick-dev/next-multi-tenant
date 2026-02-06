import { getTenantConfig } from "@/config/tenants";
import { ThemeInfoPanel } from "@/components/theme-info-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Palette,
  Layers,
  Zap,
  TrendingUp,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const tenantHero: Record<
  string,
  { headline: string; subtitle: string; cta: string; icon: React.ElementType }
> = {
  acme: {
    headline: "Smart financial tools for modern teams",
    subtitle:
      "Track portfolios, monitor transactions, and manage revenue — all in a single dashboard built on Dheme theming.",
    cta: "Explore Fintech Dashboard",
    icon: TrendingUp,
  },
  bloom: {
    headline: "Patient-first health management",
    subtitle:
      "Streamline appointments, manage patient records, and coordinate care with a modern CRM powered by Dheme.",
    cta: "Explore Health CRM",
    icon: HeartPulse,
  },
  nova: {
    headline: "Creative project management, reimagined",
    subtitle:
      "Kanban boards, time tracking, and client project oversight — all themed dynamically with Dheme.",
    cta: "Explore Creative ERP",
    icon: Sparkles,
  },
};

interface TenantPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant } = await params;
  const config = getTenantConfig(tenant);
  const hero = tenantHero[config.slug] ?? tenantHero.acme;
  const HeroIcon = hero.icon;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <section className="space-y-6 pb-12 pt-8">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Tenant: {config.slug}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {config.description}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <HeroIcon className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-primary">{config.name}</span>
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {hero.headline}
        </p>
        <p className="max-w-2xl text-muted-foreground">{hero.subtitle}</p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/demo">
              {hero.cta} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://github.com/dheme"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Palette className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Dynamic Theming</CardTitle>
            <CardDescription>
              Each tenant resolves its own theme via subdomain. Colors are
              injected server-side — no flash, no delay.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Layers className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Multi-Tenant</CardTitle>
            <CardDescription>
              Proxy detects the subdomain and rewrites to the correct tenant
              route. Add new tenants with a single config entry.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Mock or Live</CardTitle>
            <CardDescription>
              Works instantly with pre-generated mocks. Set your Dheme API key
              to fetch real themes from the API.
            </CardDescription>
          </CardHeader>
        </Card>
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
              desc: "shadcn/ui components automatically use the CSS variables. No per-tenant code needed.",
            },
          ].map((item) => (
            <Card key={item.step}>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Theme info */}
      <section className="mt-12">
        <ThemeInfoPanel tenantSlug={config.slug} />
      </section>
    </div>
  );
}
