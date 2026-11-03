// Builds the panel's demo (the web app with its API answered in the page from
// sample data) and puts it at public/demo, so the site serves it at /demo/.
// Needs the web repo next to this one (../web); without it the site builds
// with no demo and says so.
import { execSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const web = join(here, "..", "..", "web");
const out = join(here, "..", "public", "demo");

if (!existsSync(join(web, "package.json"))) {
  console.warn("[demo] ../web not found, building the site without the demo");
  process.exit(0);
}
execSync("pnpm run build:demo", { cwd: web, stdio: "inherit" });
rmSync(out, { recursive: true, force: true });
cpSync(join(web, "dist-demo"), out, { recursive: true });
rmSync(join(out, "fav-preview.html"), { force: true });
console.log("[demo] copied to public/demo");
