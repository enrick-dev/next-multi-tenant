# create-next-multi-tenant

Create Next.js multi-tenant apps with dynamic theming powered by [Dheme](https://dheme.com).

[![npm version](https://img.shields.io/npm/v/create-next-multi-tenant.svg)](https://www.npmjs.com/package/create-next-multi-tenant)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Usage

```bash
npx create-next-multi-tenant my-app
```

Or with your preferred package manager:

```bash
# npm
npm create next-multi-tenant my-app

# yarn
yarn create next-multi-tenant my-app

# pnpm
pnpm create next-multi-tenant my-app

# bun
bun create next-multi-tenant my-app
```

## Interactive Setup

The CLI guides you through:

1. **Project name** — Name of your new project directory
2. **shadcn/ui** — Include beautiful, accessible UI components
3. **Dheme connection** — Connect your account for AI theme generation

```
┌  create-next-multi-tenant - Next.js Multi-Tenant Starter Kit
│
◇  What is your project name?
│  my-saas-app
│
◇  Include shadcn/ui components?
│  Yes
│
◇  Connect to Dheme - intelligent theme generator?
│  Yes, connect now (Recommended)
│
◇  Opening browser to connect your Dheme account...
◇  Connected as john@example.com
│
◇  Created my-saas-app
◇  Initialized git repository
◇  Installed dependencies
│
└  Success! Created my-saas-app

Inside that directory, you can run:

  npm run dev
    Starts the development server

Visit these URLs to see your tenants:
  http://acme.localhost:3000
  http://bloom.localhost:3000
  http://nova.localhost:3000

Get started:

  cd my-saas-app
  npm run dev
```

## Options

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip prompts, use defaults (shadcn: yes, dheme: yes) |
| `--no-shadcn` | Create without shadcn/ui (minimal Tailwind setup) |
| `--no-dheme` | Skip Dheme OAuth (can connect later in-app) |
| `--no-git` | Skip git initialization |
| `--use-npm` | Use npm as package manager |
| `--use-yarn` | Use yarn as package manager |
| `--use-pnpm` | Use pnpm as package manager |
| `--use-bun` | Use bun as package manager |
| `--dheme-key <key>` | Provide API key directly (skip OAuth flow) |
| `-h, --help` | Display help |
| `-V, --version` | Display version |

## Examples

### Quick Start with Defaults

```bash
npx create-next-multi-tenant my-app -y
```

### Minimal Setup (No shadcn/ui)

```bash
npx create-next-multi-tenant my-app --no-shadcn
```

### CI/CD Pipeline (Non-Interactive)

```bash
npx create-next-multi-tenant my-app -y --dheme-key $DHEME_API_KEY --no-git
```

### Use Specific Package Manager

```bash
npx create-next-multi-tenant my-app --use-pnpm
```

## What's Included

### With shadcn/ui (default)

- Complete UI component library (Button, Card, Input, etc.)
- Theme customizer with live preview
- Industry-specific demo pages (Fintech, Health CRM, Creative ERP)
- Dark mode support
- Radix UI primitives

### Without shadcn/ui (`--no-shadcn`)

- Minimal Tailwind CSS setup
- Basic theme mode toggle
- Simple tenant navigation
- No external UI dependencies

## Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── [tenant]/          # Dynamic tenant routes
│   │   │   ├── layout.tsx     # Theme injection
│   │   │   ├── page.tsx       # Landing page
│   │   │   └── demo/page.tsx  # Demo showcase
│   │   ├── api/dheme/         # OAuth callback (if shadcn)
│   │   └── globals.css        # Tailwind + CSS vars
│   ├── components/
│   │   ├── demos/             # Industry demos
│   │   ├── ui/                # shadcn components
│   │   └── theme-customizer.tsx
│   ├── config/
│   │   └── tenants.ts         # Tenant registry
│   ├── lib/
│   │   └── theme/             # Theme utilities
│   └── proxy.ts               # Subdomain routing
├── .env.local                 # API keys (if connected)
├── .env.example
└── package.json
```

## Dheme Integration

### With OAuth (Recommended)

During setup, the CLI opens your browser to authenticate with Dheme. After login:
- API key is saved to `.env.local`
- Theme customizer works immediately
- AI-powered theme generation is enabled

### Without OAuth

If you skip Dheme during setup:
- App uses mock themes (works offline)
- Theme customizer shows "Connect to Dheme" button
- Users can authenticate in-app later

### Manual API Key

Provide your key directly:

```bash
npx create-next-multi-tenant my-app --dheme-key dk_live_xxxxx
```

Or add it to `.env.local` after creation:

```bash
DHEME_API_KEY=dk_live_xxxxx
NEXT_PUBLIC_DHEME_API_KEY=dk_live_xxxxx
```

## Requirements

- Node.js 18.0.0 or later
- npm, yarn, pnpm, or bun

## Related

- [Next.js Multi-Tenant Starter Kit](https://github.com/your-username/next-multi-tenant) — Full repository
- [Dheme](https://dheme.com) — AI-powered theme generation
- [@dheme/sdk](https://www.npmjs.com/package/@dheme/sdk) — Dheme SDK for JavaScript

## License

MIT
