import { input, confirm, select } from "@inquirer/prompts";
import pc from "picocolors";
import path from "path";
import fs from "fs-extra";
import validateNpmPackageName from "validate-npm-package-name";
import ora from "ora";
import { startOAuthFlow } from "./oauth.js";

export interface ScaffoldConfig {
  projectName: string;
  projectPath: string;
  includeShadcn: boolean;
  dhemeApiKey?: string;
}

interface PromptOptions {
  projectNameArg?: string;
  skipPrompts: boolean;
  includeShadcn: boolean;
  setupDheme: boolean;
  dhemeKey?: string;
}

export async function runPrompts(
  options: PromptOptions,
): Promise<ScaffoldConfig> {
  const {
    projectNameArg,
    skipPrompts,
    includeShadcn: defaultShadcn,
    setupDheme: defaultSetupDheme,
    dhemeKey,
  } = options;

  // Project name
  let projectName = projectNameArg;
  if (!projectName) {
    if (skipPrompts) {
      projectName = "my-multi-tenant-app";
    } else {
      projectName = await input({
        message: "What is your project name?",
        default: "my-multi-tenant-app",
        validate: (value) => {
          const validation = validateNpmPackageName(value);
          if (!validation.validForNewPackages) {
            return validation.errors?.[0] ?? "Invalid package name";
          }
          return true;
        },
      });
    }
  }

  // Validate project name
  const validation = validateNpmPackageName(projectName);
  if (!validation.validForNewPackages) {
    throw new Error(`Invalid project name: ${validation.errors?.[0]}`);
  }

  // Check if directory exists
  const projectPath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    const files = fs.readdirSync(projectPath);
    if (files.length > 0) {
      if (skipPrompts) {
        throw new Error(`Directory ${projectName} is not empty`);
      }
      const overwrite = await confirm({
        message: `Directory ${pc.cyan(projectName)} is not empty. Continue anyway?`,
        default: false,
      });
      if (!overwrite) {
        console.log(pc.red("Aborted."));
        process.exit(1);
      }
    }
  }

  // Include shadcn/ui?
  let includeShadcn = defaultShadcn;
  if (!skipPrompts) {
    includeShadcn = await confirm({
      message: "Include shadcn/ui components?",
      default: true,
    });
  }

  // Setup Dheme?
  let dhemeApiKey = dhemeKey;
  if (!dhemeApiKey) {
    let setupDheme = defaultSetupDheme;
    if (!skipPrompts) {
      const dhemeChoice = await select({
        message: `Connect to ${pc.bold(pc.magenta("Dheme"))} - intelligent theme generator?`,
        choices: [
          {
            value: "yes",
            name: `${pc.green("Yes, connect now")} ${pc.dim("(Recommended)")}`,
          },
          {
            value: "no",
            name: `${pc.yellow("No, configure later")}`,
          },
        ],
        default: "yes",
      });
      setupDheme = dhemeChoice === "yes";
    }

    if (setupDheme) {
      console.log();
      console.log(pc.dim("Opening browser to connect your Dheme account..."));
      const spinner = ora("Waiting for authentication...").start();

      try {
        const result = await startOAuthFlow();
        if (result) {
          spinner.succeed(`Connected as ${pc.cyan(result.accountName)}`);
          dhemeApiKey = result.apiKey;
        } else {
          spinner.warn("Authentication skipped or cancelled");
          console.log(
            pc.dim(
              "You can connect later from the theme customizer in your app",
            ),
          );
        }
      } catch {
        spinner.fail("Authentication failed");
        console.log(
          pc.dim("You can connect later from the theme customizer in your app"),
        );
      }
    }
  }

  return {
    projectName,
    projectPath,
    includeShadcn,
    dhemeApiKey,
  };
}
