import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import ora from "ora";
import pc from "picocolors";
import type { ScaffoldConfig } from "./prompts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates are relative to the dist folder when built
const TEMPLATES_DIR = path.resolve(__dirname, "..", "templates");

export async function scaffold(config: ScaffoldConfig): Promise<void> {
  const { projectName, projectPath, includeShadcn, dhemeApiKey } = config;

  const spinner = ora("Creating project...").start();

  try {
    // Ensure project directory exists
    await fs.ensureDir(projectPath);

    // 1. Copy base template (always includes demos)
    spinner.text = "Copying base template...";
    await fs.copy(path.join(TEMPLATES_DIR, "base"), projectPath, {
      overwrite: true,
    });

    // 2. Copy shadcn or minimal overlay
    if (includeShadcn) {
      spinner.text = "Adding shadcn/ui components...";
      await mergeDirectory(path.join(TEMPLATES_DIR, "shadcn"), projectPath);
    } else {
      spinner.text = "Adding minimal components...";
      await mergeDirectory(path.join(TEMPLATES_DIR, "minimal"), projectPath);
    }

    // 3. Process package.json template
    spinner.text = "Configuring package.json...";
    await processPackageJson(projectPath, projectName, includeShadcn);

    // 4. Create .env.local if API key provided
    if (dhemeApiKey) {
      spinner.text = "Saving Dheme API key...";
      await writeEnvFile(projectPath, dhemeApiKey);
    }

    // 5. Create .env.example
    await writeEnvExample(projectPath);

    spinner.succeed(`Created ${pc.cyan(projectName)}`);
  } catch (error) {
    spinner.fail("Failed to create project");
    throw error;
  }
}

async function mergeDirectory(src: string, dest: string): Promise<void> {
  if (!(await fs.pathExists(src))) {
    return;
  }

  await fs.copy(src, dest, {
    overwrite: true,
    filter: (srcPath) => {
      // Skip .template files - they're processed separately
      return !srcPath.endsWith(".template");
    },
  });
}

async function processPackageJson(
  projectPath: string,
  projectName: string,
  includeShadcn: boolean,
): Promise<void> {
  const templatePath = path.join(projectPath, "package.json.template");
  const outputPath = path.join(projectPath, "package.json");

  // Check if template exists, otherwise use package.json directly
  let packageJson: Record<string, unknown>;

  if (await fs.pathExists(templatePath)) {
    const template = await fs.readFile(templatePath, "utf-8");
    packageJson = JSON.parse(template);
    await fs.remove(templatePath);
  } else if (await fs.pathExists(outputPath)) {
    const content = await fs.readFile(outputPath, "utf-8");
    packageJson = JSON.parse(content);
  } else {
    throw new Error("No package.json template found");
  }

  // Set project name
  packageJson.name = projectName;

  // Add or remove shadcn dependencies based on user choice
  const deps = packageJson.dependencies as Record<string, string>;

  if (!includeShadcn) {
    // Remove shadcn/radix dependencies
    const shadcnDeps = [
      "@radix-ui/react-avatar",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "lucide-react",
    ];

    for (const dep of shadcnDeps) {
      delete deps[dep];
    }
  }

  await fs.writeFile(outputPath, JSON.stringify(packageJson, null, 2) + "\n");
}

async function writeEnvFile(
  projectPath: string,
  apiKey: string,
): Promise<void> {
  const envContent = `# Dheme API Key - Theme generation service
# Get your key at https://dheme.com

# Server-side (for SSR theme generation)
DHEME_API_KEY=${apiKey}

# Client-side (for theme customizer widget)
NEXT_PUBLIC_DHEME_API_KEY=${apiKey}
`;

  await fs.writeFile(path.join(projectPath, ".env.local"), envContent);
}

async function writeEnvExample(projectPath: string): Promise<void> {
  const envContent = `# Dheme API Key - Theme generation service
# Get your key at https://dheme.com

# Server-side (for SSR theme generation)
DHEME_API_KEY=

# Client-side (for theme customizer widget)
NEXT_PUBLIC_DHEME_API_KEY=
`;

  await fs.writeFile(path.join(projectPath, ".env.example"), envContent);
}
