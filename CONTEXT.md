# Dheme Multi-Tenant Starter Kit — Project Context

## What Is This

A **Next.js 16 multi-tenant starter kit** for the [Dheme](https://dheme.com) Theme-as-a-Service platform. Demonstrates dynamic theming via subdomains — each tenant gets its own color palette injected server-side. Works out of the box with mock data; switches to real Dheme API when `DHEME_API_KEY` is set.

Will eventually be distributed via CLI: `npx create-dheme-kit`.

## Tech Stack

| Technology   | Version        | Notes                                            |
| ------------ | -------------- | ------------------------------------------------ |
| Next.js      | 16.1.6         | App Router, Turbopack                            |
| React        | 19.2.3         |                                                  |
| Tailwind CSS | v4             | `@theme inline` blocks, NOT tailwind.config.ts   |
| shadcn/ui    | new-york style | CSS variable system with `hsl()` format          |
| @dheme/sdk   | 1.0.0          | Installed from tarball (Turbopack symlink issue) |
| next-themes  | 0.4.6          | Class-based dark mode                            |
| TypeScript   | 5.9.3          |                                                  |

## Architecture

### Multi-Tenancy: `[tenant]` Dynamic Route

Uses a **single dynamic route** (`src/app/[tenant]/`) instead of parallel routes. Dheme's value is theming (same components, different colors), not different layouts per tenant. Adding a new tenant = one config entry + one mock theme.

### Request Flow

```
Browser: acme.localhost:3000/demo
  → src/proxy.ts (extracts "acme" from Host subdomain, rewrites URL to /acme/demo)
  → src/app/[tenant]/layout.tsx (server component: fetches theme, injects <style> with CSS vars)
  → src/app/[tenant]/demo/page.tsx (components use Tailwind classes → resolve to tenant CSS vars)
```

### Theme Resolution

1. `proxy.ts` extracts tenant slug from subdomain
2. `[tenant]/layout.tsx` calls `getTheme(slug)` (React `cache()` for deduplication)
3. `get-theme.ts` checks `DHEME_API_KEY` → live API via `DhemeClient` or mock fallback
4. `theme-to-css.ts` converts `GenerateThemeResponse` → CSS string with `:root` + `.dark`
5. CSS injected via `<style dangerouslySetInnerHTML>` — SSR, no FOUC

### CSS Variable Format

Tailwind v4 requires `hsl()` wrapped values:

```css
--primary: hsl(221 83% 53%);
```

SDK's `formatHSLString()` returns `"221 83% 53%"` — we wrap in `hsl()`.

## Tenants

| Slug             | Name          | Industry | Primary   | Demo                                     |
| ---------------- | ------------- | -------- | --------- | ---------------------------------------- |
| `acme` (default) | ACME Finance  | Fintech  | `#2563EB` | KPI cards, portfolio, transactions       |
| `bloom`          | Bloom Health  | Health   | `#16A34A` | Patient CRM, schedule, appointments      |
| `nova`           | Nova Creative | Creative | `#7C3AED` | Kanban board, project tracking, time log |

## Project Structure

```
src/
├── app/
│   ├── [tenant]/
│   │   ├── layout.tsx          # Theme injection + nav + customizer
│   │   ├── page.tsx            # Tenant-specific landing page
│   │   └── demo/page.tsx       # Tenant-specific demo (fintech/CRM/ERP)
│   ├── layout.tsx              # Root: fonts, ThemeProvider
│   ├── globals.css             # Tailwind v4 @theme inline + fallback CSS vars
│   └── not-found.tsx
├── components/
│   ├── demos/
│   │   ├── fintech-dashboard.tsx  # acme demo
│   │   ├── health-crm.tsx         # bloom demo
│   │   └── creative-erp.tsx       # nova demo
│   ├── ui/                     # shadcn/ui components
│   ├── tenant-nav.tsx          # Nav with tenant switcher + dark mode toggle
│   ├── theme-customizer.tsx    # Floating panel: color/radius/saturation + Dheme API
│   ├── theme-info-panel.tsx    # Dev tool: shows CSS variable swatches
│   ├── theme-mode-toggle.tsx   # Light/dark toggle (CSS-based, no useEffect)
│   └── demo-showcase.tsx       # Generic component showcase (legacy, replaced by demos/)
├── config/
│   └── tenants.ts              # Tenant registry: slug → name + GenerateThemeRequest
├── lib/
│   ├── tenant/resolve-tenant.ts
│   └── theme/
│       ├── get-theme.ts        # Mock/live orchestrator with React cache()
│       ├── theme-to-css.ts     # GenerateThemeResponse → CSS string
│       └── mock-themes.ts      # Pre-generated themes for acme/bloom/nova
├── providers/
│   └── theme-provider.tsx      # next-themes wrapper
└── proxy.ts                    # Subdomain → URL rewrite (Next.js 16 proxy)
scripts/
└── dev.mjs                     # Wraps `next dev`, prints tenant URLs in console
```

## Key Files to Know

- **`src/config/tenants.ts`** — Central config. `TenantConfig` interface with `slug`, `name`, `description`, `themeRequest: GenerateThemeRequest`.
- **`src/proxy.ts`** — Next.js 16 renamed `middleware.ts` → `proxy.ts`, function `middleware()` → `proxy()`.
- **`src/lib/theme/get-theme.ts`** — Orchestrates mock vs live. Uses SDK error types (`RateLimitError`, `AuthenticationError`, `NetworkError`) for logging.
- **`src/components/theme-customizer.tsx`** — Client component. Uses `DhemeClient`, `formatHSLString`, `isValidHex`, SDK error types. Has `useEffect` for MutationObserver (dark mode sync).
- **`src/app/globals.css`** — Tailwind v4 with `@theme inline` block mapping `--color-*` to CSS vars. Fallback `:root`/`.dark` blocks for acme theme.

## @dheme/sdk Usage

### Imports Used

```typescript
// Value imports
import {
  DhemeClient,
  formatHSLString,
  isValidHex,
  RateLimitError,
  AuthenticationError,
  ValidationError,
  NetworkError,
} from "@dheme/sdk";

// Type imports
import type {
  GenerateThemeResponse,
  GenerateThemeRequest,
  ColorTokens,
  HSLColor,
} from "@dheme/sdk";
```

### SDK Methods Used

| Method                         | Where                                     | Purpose                            |
| ------------------------------ | ----------------------------------------- | ---------------------------------- |
| `client.generateTheme(params)` | `get-theme.ts`, `theme-customizer.tsx`    | Fetch theme from API               |
| `formatHSLString(hsl)`         | `theme-to-css.ts`, `theme-customizer.tsx` | Convert `HSLColor` → `"h s% l%"`   |
| `isValidHex(hex)`              | `theme-customizer.tsx`                    | Validate hex input before API call |

### SDK Methods NOT Used (Available)

| Method                                   | Purpose                                                                                                               |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `client.generateShadcnCSS(params)`       | Returns raw CSS string (uses old `h s% l%` format without `hsl()` wrapper — not directly compatible with Tailwind v4) |
| `client.generateTokens(params)`          | Multi-format tokens (HSL + RGB + HEX)                                                                                 |
| `client.getUsage()`                      | Usage stats and rate limit info                                                                                       |
| `hexToHSL`, `hslToHex`, `hslToRGB`, etc. | Color conversion utilities                                                                                            |

### SDK Types Reference

```typescript
interface GenerateThemeRequest {
  theme: string; // Required. HEX color
  secondaryColor?: string; // Optional HEX
  radius?: number; // 0–2 rem
  saturationAdjust?: number; // -100–100
  lightnessAdjust?: number; // -100–100
  contrastAdjust?: number; // -100–100
  cardIsColored?: boolean;
  backgroundIsColored?: boolean;
}

interface GenerateThemeResponse {
  theme: string;
  secondaryColor: string;
  radius: number;
  // ... all request params echoed back
  colors: { light: ColorTokens; dark: ColorTokens };
  backgrounds: {
    primary: { light: string; dark: string };
    secondary: { light: string; dark: string } | null;
  };
}

interface ColorTokens {
  background;
  foreground;
  card;
  cardForeground;
  popover;
  popoverForeground;
  primary;
  primaryForeground;
  secondary;
  secondaryForeground;
  muted;
  mutedForeground;
  accent;
  accentForeground;
  destructive;
  destructiveForeground;
  border;
  input;
  ring: HSLColor;
}

interface HSLColor {
  h: number;
  s: number;
  l: number;
}
```

## Environment Variables

| Variable                    | Scope       | Purpose                                                          |
| --------------------------- | ----------- | ---------------------------------------------------------------- |
| `DHEME_API_KEY`             | Server-side | Theme generation via `get-theme.ts`. Without it, mocks are used. |
| `NEXT_PUBLIC_DHEME_API_KEY` | Client-side | Theme customizer widget. Without it, shows auth gate.            |

## Known Issues & Workarounds

1. **Turbopack + npm symlinks**: `file:../path` dependencies create symlinks that Turbopack can't resolve. **Workaround**: `npm pack` the SDK into a `.tgz` tarball and install from that.

2. **Next.js 16 proxy**: `middleware.ts` → `proxy.ts`, `export function middleware` → `export function proxy`.

3. **Tailwind v4**: No `tailwind.config.ts`. Config is inline in `globals.css` via `@theme inline`. Dark mode via `@custom-variant dark (&:is(.dark *))`.

4. **React 19 lint**: `useEffect(() => setMounted(true), [])` pattern triggers `react-hooks/set-state-in-effect`. Theme mode toggle uses CSS-based approach (`dark:scale-0`/`dark:scale-100`) instead.

5. **`demo-showcase.tsx`**: Legacy generic component showcase. Replaced by tenant-specific demos in `demos/` folder but file still exists.

## Git History

```
2bc985f refactor: use SDK utilities and error types instead of custom implementations
d849f1f feat: add tenant-specific industry demos (fintech, health CRM, creative ERP)
a01f84a feat: add floating theme customizer with Dheme API integration
512d10d feat: show tenant URLs in console on dev server start
4fe5d69 fix: migrate middleware.ts to proxy.ts (Next.js 16 convention)
d573596 feat: initial multi-tenant starter kit with Dheme theming
11abd1c Initial commit
```

## Commit Workflow

Before every commit:

1. `npx tsc --noEmit` — type check
2. `npx eslint --fix src/` — lint + auto-fix
3. `npm run build` — production build must pass

## What's Next (Not Yet Implemented)

- **CLI distribution**: `npx create-dheme-kit` with interactive setup
- **Option to install without shadcn/ui** (other component libraries)
- **OAuth flow**: CLI prompts user to create Dheme account via browser redirect
- **More tenants/demos**: easy to add via `config/tenants.ts` + `mock-themes.ts`
- **`generateShadcnCSS` integration**: Could replace `theme-to-css.ts` for live mode if SDK output format is updated to Tailwind v4 `hsl()` syntax
- **`getUsage` integration**: Show API usage in the theme customizer panel
