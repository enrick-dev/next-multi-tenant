# My Multi-Tenant App

A Next.js multi-tenant application with dynamic theming powered by [Dheme](https://dheme.com).

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Access Your Tenants

Each tenant has its own subdomain:

- [http://acme.localhost:3000](http://acme.localhost:3000) — ACME Finance (Fintech)
- [http://bloom.localhost:3000](http://bloom.localhost:3000) — Bloom Health (Healthcare)
- [http://nova.localhost:3000](http://nova.localhost:3000) — Nova Creative (Creative Agency)

## Project Structure

```
src/
├── app/
│   ├── [tenant]/           # Dynamic tenant routes
│   │   ├── layout.tsx      # Theme CSS injection
│   │   ├── page.tsx        # Tenant landing page
│   │   └── demo/page.tsx   # Industry demo
│   ├── api/dheme/          # OAuth callback
│   └── globals.css         # Tailwind + CSS variables
├── components/
│   ├── demos/              # Industry-specific demos
│   ├── ui/                 # UI components
│   └── theme-customizer.tsx
├── config/
│   └── tenants.ts          # Tenant configuration
├── lib/
│   └── theme/              # Theme utilities
└── proxy.ts                # Subdomain routing
```

## Adding a New Tenant

1. Edit `src/config/tenants.ts`:

```typescript
export const TENANTS: TenantConfig[] = [
  // ... existing tenants
  {
    slug: "mycompany",
    name: "My Company",
    description: "Your company description",
    themeRequest: {
      theme: "#3B82F6",  // Primary color
      radius: 0.5,       // Border radius (0-2)
    },
  },
];
```

2. Access at `http://mycompany.localhost:3000`

## Theme Customizer

Click the paintbrush button (bottom-right) to open the live theme customizer:

1. Adjust primary color, radius, saturation, and contrast
2. Click "Generate Theme" to preview changes
3. Generated themes are applied instantly

## Environment Variables

```bash
# .env.local

# Server-side theme generation
DHEME_API_KEY=your_api_key

# Client-side theme customizer
NEXT_PUBLIC_DHEME_API_KEY=your_api_key
```

Without API keys, the app uses mock themes for development.

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Configure wildcard domain (`*.yourdomain.com`)

### Subdomain Setup

For production, configure your DNS with a wildcard record:

```
*.yourdomain.com → your-app.vercel.app
```

## Learn More

- [Dheme Documentation](https://dheme.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## License

MIT
