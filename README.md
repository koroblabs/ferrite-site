# ferrite-site

The website for [ferrite](https://github.com/koroblabs/ferrite-server) —
self-hosted DNS that blocks ads & trackers and routes any device through a
tunnel. Landing page, docs, API reference, and download instructions.

Related repos: [ferrite-server](https://github.com/koroblabs/ferrite-server)
(the server) · [ferrite-web](https://github.com/koroblabs/ferrite-web)
(the web panel).

## Stack

- [Astro](https://astro.build) static build, no client framework. Page shells
  live in `src/pages/*.astro`; the actual markup is plain HTML in
  `src/content/*.html` pulled in with `?raw` (plus small vanilla-JS snippets
  next to it).
- One shared stylesheet: `src/styles/ferrite.css`.
- `build.format: "file"` emits `/docs.html`, `/api.html`, … so in-page links
  can point at `*.html` directly.
- Static assets in `public/` are copied to the site root as-is — including
  `ferrite-grafana-dashboard.json`, the importable Grafana dashboard linked
  from the API page's Monitoring section.

## Develop

```sh
pnpm install
pnpm dev       # local dev server
pnpm build     # static build into dist/
pnpm preview   # serve the built dist/
```

## Demo

`/demo/` is the real panel running on sample data in the browser. `pnpm build`
builds it first from `../web` (`pnpm build:demo` there) into `public/demo/`;
`pnpm demo` does just that step. Without `../web` the site builds without it.

## Ukrainian pages

`src/content/uk/*.html` are generated from the English pages by
`python3 scripts/translate.py`, using the string tables in `i18n/uk/`. After
changing English text, run it: it lists any string it can no longer match, so
the table can be updated. Then format with prettier (`--tab-width 4`).

## Deploy

Served as [Cloudflare Workers static
assets](https://developers.cloudflare.com/workers/static-assets/) — see
`wrangler.jsonc` (`dist/` is the asset directory, 404s fall back to the 404
page).

```sh
pnpm build
npx wrangler deploy
```

## License

[MIT](LICENSE)
