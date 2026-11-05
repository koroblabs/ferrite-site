// Builds the panel's demo (the web app with its API answered in the page from
// sample data) and puts it at public/demo, so the site serves it at /demo/.
// It uses the web repo next to this one (../web) when there is one; where
// there isn't, as on Cloudflare's builds, it fetches the panel's source from
// GitHub (WEB_REF picks a branch or tag; main by default).
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "public", "demo");
const REPO = "https://github.com/syntlyx/ferrite-web.git";

let web = process.env.WEB_DIR ?? join(here, "..", "..", "web");
let fetched = null;
if (!existsSync(join(web, "package.json"))) {
    const ref = process.env.WEB_REF ?? "main";
    fetched = mkdtempSync(join(tmpdir(), "ferrite-web-"));
    console.log(`[demo] no ../web here, fetching ${REPO} (${ref})`);
    execSync(`git clone --depth 1 --branch ${ref} ${REPO} ${fetched}`, {
        stdio: "inherit",
    });
    execSync("pnpm install --frozen-lockfile", {
        cwd: fetched,
        stdio: "inherit",
    });
    web = fetched;
}

execSync("pnpm run build:demo", { cwd: web, stdio: "inherit" });
rmSync(out, { recursive: true, force: true });
cpSync(join(web, "dist-demo"), out, { recursive: true });
rmSync(join(out, "fav-preview.html"), { force: true });
if (fetched) rmSync(fetched, { recursive: true, force: true });
console.log("[demo] copied to public/demo");
