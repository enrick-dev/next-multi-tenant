import { getTenantConfig } from "@/config/tenants";
import { FintechDashboard } from "@/components/demos/fintech-dashboard";
import { HealthCRM } from "@/components/demos/health-crm";
import { CreativeERP } from "@/components/demos/creative-erp";
import { ThemeInfoPanel } from "@/components/theme-info-panel";
import { Badge } from "@/components/ui/badge";

interface DemoPageProps {
  params: Promise<{ tenant: string }>;
}

const demoLabels: Record<string, string> = {
  acme: "Fintech Dashboard",
  bloom: "Health CRM",
  nova: "Creative ERP",
};

function TenantDemo({ slug }: { slug: string }) {
  switch (slug) {
    case "bloom":
      return <HealthCRM />;
    case "nova":
      return <CreativeERP />;
    default:
      return <FintechDashboard />;
  }
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { tenant } = await params;
  const config = getTenantConfig(tenant);
  const label = demoLabels[config.slug] ?? "Dashboard";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{config.slug}</Badge>
          <Badge variant="outline">{label}</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-primary">{config.name}</span> — {label}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Each tenant showcases a different industry demo — all built with the
          same shadcn/ui components, themed dynamically by Dheme.
        </p>
      </div>

      <div className="mb-8">
        <ThemeInfoPanel tenantSlug={config.slug} />
      </div>

      <TenantDemo slug={config.slug} />
    </div>
  );
}
