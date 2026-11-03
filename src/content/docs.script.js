// The contents list stays open beside the page on wide screens and folds
// into a "On this page" box on narrow ones; the section being read is marked.
const contents = document.querySelector(".docs-nav details");
if (contents) {
  const wide = matchMedia("(min-width: 1041px)");
  const sync = () => {
    if (wide.matches) contents.open = true;
  };
  sync();
  wide.addEventListener("change", sync);
  contents.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      if (!wide.matches) contents.open = false;
    }),
  );

  const links = new Map(
    [...contents.querySelectorAll('a[href^="#"]')].map((a) => [
      a.getAttribute("href").slice(1),
      a,
    ]),
  );
  const headings = [...document.querySelectorAll(".doc h2[id]")];
  const mark = () => {
    let current = headings[0];
    for (const h of headings) {
      if (h.getBoundingClientRect().top < 140) current = h;
    }
    links.forEach((a, id) =>
      a.setAttribute("aria-current", String(id === current.id)),
    );
  };
  mark();
  addEventListener("scroll", mark, { passive: true });
}
