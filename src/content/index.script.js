document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy") || "";
    try {
      await navigator.clipboard.writeText(value);
      const old = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = old;
      }, 1200);
    } catch {
      button.textContent = "Select";
    }
  });
});

// Replay the "Just now" feed so the hero keeps feeling live
const feedBody = document.querySelector(".feed-body");
if (feedBody && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setInterval(() => {
    feedBody.querySelectorAll(".frow").forEach((row) => {
      row.style.animation = "none";
      void row.offsetWidth;
      row.style.animation = "";
    });
  }, 9000);
}

// The panel gallery: one screen at a time, switched by its tabs (arrow keys
// move between them). Without this script every screen simply shows in turn.
const gallery = document.querySelector(".gallery");
if (gallery) {
  const tabs = [...gallery.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) =>
    document.getElementById(tab.getAttribute("aria-controls")),
  );
  const select = (index, focus) => {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) tabs[index].focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (e) => {
      const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      select((i + step + tabs.length) % tabs.length, true);
    });
  });
  gallery.classList.add("ready");
  select(0);
}
