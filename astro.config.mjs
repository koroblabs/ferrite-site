import { defineConfig } from "astro/config";

// The dev server serves public/ files by exact path only, so /demo/ would 404
// where Cloudflare (auto-trailing-slash) serves /demo/index.html. Do the same
// here, so the demo opens from its real link while developing too.
const demoIndex = {
  name: "demo-index",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === "/demo" || req.url === "/demo/") req.url = "/demo/index.html";
      next();
    });
  },
};

// Static marketing/docs site. `format: "file"` emits /docs.html, /api.html,
// /download.html (and /404.html) so the existing in-page links — which point at
// `*.html` — keep working unchanged.
export default defineConfig({
  site: "https://ferrite.me",
  build: { format: "file" },
  vite: { plugins: [demoIndex] },
});
