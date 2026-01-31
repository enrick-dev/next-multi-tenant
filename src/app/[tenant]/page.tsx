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
import { ArrowRight, Palette, Layers, Zap } from "lucide-react";
import Link from "next/link";

interface TenantPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant } = await params;
  const config = getTenantConfig(tenant);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <section className="space-y-6 pb-12 pt-8">
        <Badge variant="secondary" className="text-xs">
          Tenant: {config.slug}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to{" "}
          <span className="text-primary">{config.name}</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {config.description}. This page is themed dynamically using Dheme —
          every tenant gets its own color palette, applied server-side with zero
          client JavaScript.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/demo">
              View Components <ArrowRight className="ml-2 h-4 w-4" />
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
              Middleware detects the subdomain and rewrites to the correct
              tenant route. Add new tenants with a single config entry.
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
              desc: `You accessed ${config.slug}.localhost — the middleware extracts "${config.slug}" as the tenant.`,
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
