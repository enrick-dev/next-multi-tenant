import { execa } from "execa";
import ora from "ora";
import pc from "picocolors";
import path from "path";

export interface PostInstallOptions {
  projectPath: string;
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
  initGit: boolean;
}

export async function runPostInstall(
  options: PostInstallOptions,
): Promise<void> {
  const { projectPath, packageManager, initGit } = options;
  const projectName = path.basename(projectPath);

  // 1. Initialize git
  if (initGit) {
    const gitSpinner = ora("Initializing git repository...").start();
    try {
      await execa("git", ["init"], { cwd: projectPath });
      await execa("git", ["add", "-A"], { cwd: projectPath });
      await execa(
        "git",
        ["commit", "-m", "Initial commit from create-next-multi-tenant"],
        { cwd: projectPath },
      );
      gitSpinner.succeed("Initialized git repository");
    } catch {
      gitSpinner.warn("Git initialization skipped (git not available)");
    }
  }

  // 2. Install dependencies
  const installSpinner = ora(
    `Installing dependencies with ${packageManager}...`,
  ).start();

  try {
    const installCommands: Record<string, [string, string[]]> = {
      npm: ["npm", ["install"]],
      yarn: ["yarn", ["install"]],
      pnpm: ["pnpm", ["install"]],
      bun: ["bun", ["install"]],
    };

    const [cmd, args] = installCommands[packageManager];

    await execa(cmd, args, {
      cwd: projectPath,
      stdio: "pipe",
    });

    installSpinner.succeed("Installed dependencies");
  } catch (error) {
    installSpinner.fail("Failed to install dependencies");
    console.log(
      pc.dim(`Run ${packageManager} install manually in the project directory`),
    );
  }

  // 3. Print success message
  printSuccessMessage(projectName, packageManager);
}

function printSuccessMessage(
  projectName: string,
  packageManager: "npm" | "yarn" | "pnpm" | "bun",
): void {
  const runCommands: Record<string, string> = {
    npm: "npm run dev",
    yarn: "yarn dev",
    pnpm: "pnpm dev",
    bun: "bun dev",
  };

  const runCmd = runCommands[packageManager];

  console.log();
  console.log(pc.green("Success!") + ` Created ${pc.cyan(projectName)}`);
  console.log();
  console.log("Inside that directory, you can run:");
  console.log();
  console.log(`  ${pc.cyan(runCmd)}`);
  console.log("    Starts the development server");
  console.log();
  console.log("Visit these URLs to see your tenants:");
  console.log(`  ${pc.cyan("http://acme.localhost:3000")}`);
  console.log(`  ${pc.cyan("http://bloom.localhost:3000")}`);
  console.log(`  ${pc.cyan("http://nova.localhost:3000")}`);
  console.log();
  console.log("Get started:");
  console.log();
  console.log(`  ${pc.cyan(`cd ${projectName}`)}`);
  console.log(`  ${pc.cyan(runCmd)}`);
  console.log();
  console.log(pc.dim("Powered by Dheme - Intelligent Theme Generation"));
  console.log(pc.dim("https://dheme.com"));
  console.log();
}
