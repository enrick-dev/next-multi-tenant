import { getTenantConfig } from "@/config/tenants";
import { getTheme } from "@/lib/theme/get-theme";
import { themeToCss } from "@/lib/theme/theme-to-css";
import { TenantNav } from "@/components/tenant-nav";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const config = getTenantConfig(tenant);
  return {
    title: `${config.name} | Dheme Multi-Tenant Kit`,
    description: config.description,
  };
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant } = await params;
  const config = getTenantConfig(tenant);
  const theme = await getTheme(tenant);
  const css = themeToCss(theme);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="min-h-screen bg-background text-foreground">
        <TenantNav tenantSlug={config.slug} tenantName={config.name} />
        <main>{children}</main>
      </div>
    </>
  );
}
