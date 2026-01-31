import { getTenantConfig } from "@/config/tenants";
import { DemoShowcase } from "@/components/demo-showcase";
import { ThemeInfoPanel } from "@/components/theme-info-panel";
import { Badge } from "@/components/ui/badge";

interface DemoPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { tenant } = await params;
  const config = getTenantConfig(tenant);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{config.slug}</Badge>
          <Badge variant="outline">Component Demo</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-primary">{config.name}</span> Components
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          All components below use the same code — only the CSS variables change
          per tenant. Switch between tenants using the navbar to see the
          difference.
        </p>
      </div>

      <div className="mb-8">
        <ThemeInfoPanel tenantSlug={config.slug} />
      </div>

      <DemoShowcase />
    </div>
  );
}
