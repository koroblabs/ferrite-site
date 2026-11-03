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
