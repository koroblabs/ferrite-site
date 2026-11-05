"""Regenerate the Ukrainian pages from the English ones.

    python3 scripts/translate.py

For each page in i18n/uk/<page>.py, src/content/<page>.html is copied to
src/content/uk/<page>.html with its text swapped for the translation. A
string is replaced only where it is a whole text node (between > and <,
whatever the line wrapping) or a whole alt / aria-label / title value, so
markup and icons are never touched. Each <page>.py holds PAIRS = [(en, uk)]
and optionally RAW = [(old, new)] literal swaps applied afterwards.

When the English text changes, the pairs it no longer matches are listed as
"missing": update those, run this again, then prettier.
"""
import re
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEXT_ATTRS = r"(?:alt|aria-label|title)"


def words(text):
    return r"\s+".join(re.escape(w) for w in text.split())


def translate(src, pairs, raw):
    missing = []
    for en, uk in sorted(pairs, key=lambda p: -len(p[0])):
        node = re.compile(r"(>)(\s*)" + words(en) + r"(\s*)(<)")
        attr = re.compile(r'(' + TEXT_ATTRS + r'=")' + words(en) + r'(")')
        hits = len(node.findall(src))
        src = node.sub(lambda m: m.group(1) + m.group(2) + uk + m.group(3) + m.group(4), src)
        hits += len(attr.findall(src))
        src = attr.sub(lambda m: m.group(1) + uk + m.group(2), src)
        if hits == 0:
            missing.append(en)
    for old, new in raw:
        src = src.replace(old, new)
    # Pages under /uk link to each other, not to the English ones.
    src = re.sub(r'href="(docs|changelog|download|index|api)\.html', r'href="/uk/\1.html', src)
    return src, missing


for table in sorted((ROOT / "i18n" / "uk").glob("*.py")):
    page = table.stem
    ns = runpy.run_path(str(table))
    english = (ROOT / "src" / "content" / f"{page}.html").read_text()
    out, missing = translate(english, ns["PAIRS"], ns.get("RAW", []))
    (ROOT / "src" / "content" / "uk" / f"{page}.html").write_text(out)
    print(f"{page}: {len(ns['PAIRS']) - len(missing)}/{len(ns['PAIRS'])} strings")
    for m in missing:
        print("  missing:", m[:100])
