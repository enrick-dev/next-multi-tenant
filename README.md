# Next.js Multi-Tenant Starter Kit

A production-ready Next.js starter kit for building multi-tenant SaaS applications with dynamic theming powered by [Dheme](https://dheme.com).

[![npm version](https://img.shields.io/npm/v/create-next-multi-tenant.svg)](https://www.npmjs.com/package/create-next-multi-tenant)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **Multi-Tenant Architecture** — Subdomain-based tenant routing with a single codebase
- **Dynamic Theming** — Each tenant gets unique colors via Dheme's AI-powered theme generation
- **Server-Side Rendering** — Theme CSS injected at request time, zero flash of unstyled content
- **shadcn/ui Components** — Beautiful, accessible components out of the box
- **Dark Mode** — Automatic light/dark theme support per tenant
- **Live Theme Customizer** — Real-time theme preview with Dheme API integration
- **TypeScript** — Full type safety throughout
- **Tailwind CSS v4** — Latest Tailwind with CSS variable theming

## Quick Start

```bash
npx create-next-multi-tenant my-saas-app
```

This will:
1. Scaffold a new multi-tenant Next.js project
2. Optionally connect your Dheme account for AI theme generation
3. Set up three demo tenants to showcase different industries

### Run the Development Server

```bash
cd my-saas-app
npm run dev
```

Visit your tenants:
- [http://acme.localhost:3000](http://acme.localhost:3000) — Fintech dashboard
- [http://bloom.localhost:3000](http://bloom.localhost:3000) — Health CRM
- [http://nova.localhost:3000](http://nova.localhost:3000) — Creative ERP

## CLI Options

```bash
npx create-next-multi-tenant [project-name] [options]

Options:
  -y, --yes           Skip prompts and use defaults
  --no-shadcn         Create without shadcn/ui (minimal Tailwind setup)
  --no-dheme          Skip Dheme OAuth setup
  --no-git            Skip git initialization
  --use-npm           Use npm as package manager
  --use-yarn          Use yarn as package manager
  --use-pnpm          Use pnpm as package manager
  --use-bun           Use bun as package manager
  --dheme-key <key>   Provide Dheme API key directly (skip OAuth)
  -h, --help          Display help
  -V, --version       Display version
```

## How It Works

### 1. Subdomain Routing

The proxy extracts the tenant slug from the subdomain and rewrites the URL:

```
acme.localhost:3000/dashboard → /acme/dashboard
```

```typescript
// src/proxy.ts
export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  const subdomain = host?.split(".")[0];
  // Rewrite to /[tenant]/path
}
```

### 2. Theme Resolution

Each tenant's theme is resolved server-side in the layout:

```typescript
// src/app/[tenant]/layout.tsx
export default async function TenantLayout({ params }) {
  const theme = await getTheme(params.tenant);
  const css = themeToCss(theme);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </>
  );
}
```

### 3. Dheme Integration

With a Dheme API key, themes are generated dynamically:

```typescript
// With API key → Live AI-generated themes
const client = new DhemeClient({ apiKey: process.env.DHEME_API_KEY });
const { data } = await client.generateTheme({
  theme: "#2563EB",
  radius: 0.5,
});

// Without API key → Falls back to mock themes
```

## Project Structure

```
src/
├── app/
│   ├── [tenant]/
│   │   ├── layout.tsx      # Theme injection
│   │   ├── page.tsx        # Tenant landing page
│   │   └── demo/page.tsx   # Industry-specific demo
│   ├── api/
│   │   └── dheme/
│   │       └── callback/   # OAuth callback handler
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Tailwind + CSS variables
├── components/
│   ├── demos/              # Industry demo components
│   ├── ui/                 # shadcn/ui components
│   ├── tenant-nav.tsx      # Navigation with tenant switcher
│   ├── theme-customizer.tsx # Live theme editor
│   └── theme-mode-toggle.tsx
├── config/
│   └── tenants.ts          # Tenant configuration
├── lib/
│   ├── tenant/
│   │   └── resolve-tenant.ts
│   └── theme/
│       ├── get-theme.ts    # Theme fetching logic
│       ├── mock-themes.ts  # Fallback themes
│       └── theme-to-css.ts # CSS generation
├── providers/
│   └── theme-provider.tsx  # next-themes wrapper
└── proxy.ts                # Subdomain routing
```

## Configuration

### Adding a New Tenant

1. Add the tenant to `src/config/tenants.ts`:

```typescript
export const TENANTS: TenantConfig[] = [
  // ... existing tenants
  {
    slug: "startup",
    name: "Startup Inc",
    description: "A fast-growing tech startup",
    themeRequest: {
      theme: "#F59E0B",  // Primary color (HEX)
      radius: 0.75,      // Border radius (0-2)
    },
  },
];
```

2. (Optional) Add a mock theme to `src/lib/theme/mock-themes.ts` for offline development.

3. Access at `http://startup.localhost:3000`

### Environment Variables

```bash
# Server-side: Theme generation via Dheme API
DHEME_API_KEY=your_api_key

# Client-side: Theme customizer widget
NEXT_PUBLIC_DHEME_API_KEY=your_api_key

# Optional: Custom Dheme server (for self-hosted)
DHEME_BASE_URL=https://dheme.com
NEXT_PUBLIC_DHEME_BASE_URL=https://dheme.com
```

## Theme Customizer

The floating theme customizer lets users preview theme changes in real-time:

1. Click the paintbrush button in the bottom-right corner
2. If not connected, click "Connect to Dheme" to authenticate
3. Adjust primary color, border radius, saturation, and contrast
4. Click "Generate Theme" to see live changes

The customizer uses the Dheme API to generate complete color palettes from a single primary color.

## Deployment

### Vercel (Recommended)

1. Push your project to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Configure wildcard domain for subdomains:
   - Add `*.yourdomain.com` to your domains
   - Point DNS with a wildcard CNAME record

### Other Platforms

The app works on any platform that supports Next.js. Ensure:
- Wildcard subdomain routing is configured
- Environment variables are set
- Node.js 18+ is available

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15+ | React framework with App Router |
| React | 19 | UI library |
| Tailwind CSS | v4 | Styling with CSS variables |
| shadcn/ui | latest | UI component library |
| @dheme/sdk | ^1.1.0 | Theme generation API |
| next-themes | 0.4+ | Dark mode support |
| TypeScript | 5.x | Type safety |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [Dheme](https://dheme.com) — AI-powered theme generation
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

Built with [Dheme](https://dheme.com) — Intelligent Theme Generation
