import { spawn } from "child_process";

const TENANTS = ["acme", "bloom", "nova"];

const child = spawn("npx", ["next", "dev"], {
  stdio: ["inherit", "pipe", "inherit"],
  env: { ...process.env, FORCE_COLOR: "1" },
});

let printed = false;
let buffer = "";

child.stdout.on("data", (data) => {
  process.stdout.write(data);

  if (printed) return;

  buffer += data.toString();

  if (buffer.includes("Ready")) {
    printed = true;

    // Extract port from accumulated output
    const portMatch = buffer.match(/localhost:(\d+)/);
    const port = portMatch ? portMatch[1] : "3000";

    console.log("");
    console.log("  \x1b[36mTenants:\x1b[0m");
    TENANTS.forEach((t) => {
      console.log(
        `  - \x1b[1m${t.padEnd(8)}\x1b[0m http://${t}.localhost:${port}`,
      );
    });
    console.log("");

    buffer = "";
  }
});

child.on("close", (code) => {
  process.exit(code ?? 0);
});
