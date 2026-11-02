import "./sites-env.mjs";
import { spawn } from "node:child_process";
import { copyFileSync } from "node:fs";
copyFileSync(".dev.vars", "dist/server/.dev.vars");
// Polling avoids macOS sandbox FSEvents limits; secrets stay outside source control.
const child = spawn(
  process.execPath,
  [
    "./node_modules/wrangler/bin/wrangler.js",
    "dev",
    "--config",
    "dist/server/wrangler.json",
    "--local",
    "--persist-to",
    ".wrangler/state",
    "--ip",
    "127.0.0.1",
    "--inspector-port",
    "0",
    "--env-file",
    ".dev.vars",
    "--log-level",
    "warn",
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      CHOKIDAR_USEPOLLING: "true",
      WRANGLER_SEND_METRICS: "false",
    },
  },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));
