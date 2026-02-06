import { program } from "commander";
import pc from "picocolors";
import { runPrompts } from "./prompts.js";
import { scaffold } from "./scaffolder.js";
import { runPostInstall } from "./post-install.js";

interface CliOptions {
  yes?: boolean;
  shadcn?: boolean;
  dheme?: boolean;
  git?: boolean;
  useNpm?: boolean;
  useYarn?: boolean;
  usePnpm?: boolean;
  useBun?: boolean;
  dhemeKey?: string;
}

export async function runCli() {
  console.log();
  console.log(
    pc.bold(pc.cyan("create-next-multi-tenant")) +
      " - Next.js Multi-Tenant Starter Kit",
  );
  console.log();

  program
    .name("create-next-multi-tenant")
    .description("Create a Next.js multi-tenant app with Dheme theming")
    .version("1.0.0")
    .argument("[project-name]", "Name of the project")
    .option("-y, --yes", "Skip prompts and use defaults")
    .option("--no-shadcn", "Skip shadcn/ui components")
    .option("--no-dheme", "Skip Dheme OAuth setup")
    .option("--no-git", "Skip git initialization")
    .option("--use-npm", "Use npm as package manager")
    .option("--use-yarn", "Use yarn as package manager")
    .option("--use-pnpm", "Use pnpm as package manager")
    .option("--use-bun", "Use bun as package manager")
    .option("--dheme-key <key>", "Dheme API key (skip OAuth flow)")
    .parse();

  const args = program.args;
  const opts = program.opts<CliOptions>();

  // Detect package manager
  const packageManager = detectPackageManager(opts);

  // Run prompts or use defaults
  const config = await runPrompts({
    projectNameArg: args[0],
    skipPrompts: opts.yes ?? false,
    includeShadcn: opts.shadcn ?? true,
    setupDheme: opts.dheme ?? true,
    dhemeKey: opts.dhemeKey,
  });

  // Scaffold the project
  await scaffold(config);

  // Run post-install steps
  await runPostInstall({
    projectPath: config.projectPath,
    packageManager,
    initGit: opts.git ?? true,
  });
}

function detectPackageManager(
  opts: CliOptions,
): "npm" | "yarn" | "pnpm" | "bun" {
  if (opts.useNpm) return "npm";
  if (opts.useYarn) return "yarn";
  if (opts.usePnpm) return "pnpm";
  if (opts.useBun) return "bun";

  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith("yarn")) return "yarn";
    if (userAgent.startsWith("pnpm")) return "pnpm";
    if (userAgent.startsWith("bun")) return "bun";
  }

  return "npm";
}
