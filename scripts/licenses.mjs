// Writes public/THIRD-PARTY-LICENSES.txt, served at /THIRD-PARTY-LICENSES.txt:
// the SIL Open Font License of the fonts this site serves, which asks to
// travel with them. (The demo at /demo/ carries its own, from the panel.)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const fonts = Object.keys(pkg.dependencies)
    .filter((name) => name.startsWith("@fontsource"))
    .sort();

const rule = "-".repeat(80);
const parts = [
    "ferrite.me: third-party software",
    "================================",
    "",
    "The fonts this website serves, each under its own licence, reproduced here",
    "as that licence requires.",
    "",
];
for (const name of fonts) {
    const dir = join(root, "node_modules", name);
    const meta = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    const licence = readdirSync(dir).find((f) => /^licen[cs]e/i.test(f));
    parts.push(
        rule,
        `${name} ${meta.version}`,
        `Licence: ${meta.license}`,
        "",
        readFileSync(join(dir, licence), "utf8").trim(),
        "",
    );
}
writeFileSync(
    join(root, "public", "THIRD-PARTY-LICENSES.txt"),
    parts.join("\n"),
);
console.log(
    `[licenses] ${fonts.length} fonts -> public/THIRD-PARTY-LICENSES.txt`,
);
