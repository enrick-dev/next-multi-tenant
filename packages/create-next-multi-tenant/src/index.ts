import { runCli } from "./cli.js";

runCli()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
