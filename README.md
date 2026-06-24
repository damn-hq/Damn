# DAMN

Marketing site + inquiry pipeline for **Damn** — a custom website studio.
Quote: _DAMN GOOD_.

Dark, glass-heavy single-page landing with an interactive particle wordmark,
an interactive cursor-following blur gradient, a liquid-glass custom cursor,
scroll/hover/geometric animations, and an **Inquiry** page that posts to a Node
API which creates a row in a **Notion** database (gated by Cloudflare Turnstile).

## Stack

| Layer    | Tech                                                        |
| -------- | ----------------------------------------------------------- |
| Frontend | Vite + React + TypeScript, TailwindCSS, Framer Motion       |
| Backend  | Cloudflare Workers + Hono + TypeScript, Notion REST, Zod    |
| Database | Notion                                                      |
| Anti-spam| Cloudflare Turnstile (server-side `siteverify`)             |
| Hosting  | Cloudflare Pages (client) + Cloudflare Workers (API)        |

Palette is deliberately limited to four colors: black `#0A0A0B`, bone
`#E5E5E5`, violet `#7C3AED`, cyan `#22D3EE`.

## Project layout

```
client/   Vite React app (UI, particle logo, glass, cursor, inquiry form)
server/   Cloudflare Worker API — Hono (validation, Turnstile verify, Notion write)
logo.png  brand wordmark (also copied to client/public)
```

## Quick start

### 1. Client

```bash
cd client
npm install
cp .env.example .env        # defaults work for local dev
npm run dev                 # http://localhost:5173
```

`.env`:

- `VITE_API_BASE` — API base URL (default `http://localhost:8787`)
- `VITE_TURNSTILE_SITE_KEY` — Turnstile site key. The example uses Cloudflare's
  "always passes" test key, fine for local dev.

### 2. Server

```bash
cd server
npm install
npm run dev                 # wrangler dev — http://localhost:8787
```

The Worker reads config from bindings, not `process.env`:

- `ALLOWED_ORIGIN` — comma-separated CORS origins. Plain `[vars]` in `wrangler.toml`.
- `INQUIRY_LIMITER` — Workers Rate Limiting binding (5 req / 60s per IP).
- `NOTION_API_KEY` — integration token from https://www.notion.so/my-integrations
- `NOTION_DB_ID` — target database id (share the DB with your integration!)
- `TURNSTILE_SECRET_KEY` — Turnstile secret.

Secrets (last three) are **not** in `wrangler.toml` — set them per environment:

```bash
npx wrangler secret put NOTION_API_KEY
npx wrangler secret put NOTION_DB_ID
npx wrangler secret put TURNSTILE_SECRET_KEY
```

For local `wrangler dev`, put the same keys in `server/.dev.vars` (git-ignored).

Health check: `GET http://localhost:8787/health` → `{ "ok": true }`.

## Notion database setup

1. Create a Notion integration, copy its **Internal Integration Secret** →
   `NOTION_API_KEY`.
2. Create a database and **share it with the integration** (•••  → Connections).
3. Copy the database id from its URL → `NOTION_DB_ID`
   (`notion.so/<workspace>/<DATABASE_ID>?v=...`).
4. Give the database these properties (names + types must match exactly):

   | Property       | Type      |
   | -------------- | --------- |
   | `Name`         | Title     |
   | `Email`        | Email     |
   | `Company`      | Text      |
   | `Budget`       | Select    |
   | `Project Type` | Select    |
   | `Requirements` | Text      |
   | `Referral`     | Text      |
   | `Status`       | Select    |
   | `Submitted`    | Date      |

   Select options are created on the fly by the API; no need to pre-fill them.

## Cloudflare Turnstile

Create a Turnstile widget at
https://dash.cloudflare.com/?to=/:account/turnstile, add the site's domain
(e.g. `damn-hq.pages.dev` + `localhost`), then set the real **site key** in
`client/.env.production` and the **secret key** via
`npx wrangler secret put TURNSTILE_SECRET_KEY`. Cloudflare's documented test
keys (always pass) are fine for local dev.

## Build

```bash
cd client && npm run build     # -> client/dist
cd server && npm run typecheck # Worker is bundled by wrangler at deploy time
```

## Deployment (Cloudflare)

Live URLs:

- Client: **https://damn-hq.pages.dev** (Cloudflare Pages, project `damn-hq`)
- API: **https://damn-api.damn-hq.workers.dev** (Cloudflare Worker `damn-api`)

### Client → Pages

Production env lives in `client/.env.production` (committed; both values are
public and ship in the browser bundle):

- `VITE_API_BASE` — the deployed Worker URL
- `VITE_TURNSTILE_SITE_KEY` — Turnstile **site** key

`npm run build` auto-loads that file, so no env vars need to be set by hand.

```bash
cd client
npm run build
npx wrangler pages deploy dist --project-name damn-hq --commit-dirty=true
```

`client/public/_redirects` (`/* /index.html 200`) makes React Router work on Pages.

### Server → Workers

Config in `server/wrangler.toml` (name, rate-limit binding, `ALLOWED_ORIGIN`).
Secrets via `wrangler secret put` (see Server section above). To deploy:

```bash
cd server
npx wrangler deploy
```

### Redeploy after a change

- **Client changed** → rebuild + `wrangler pages deploy` (commands above).
- **Server changed** → `npx wrangler deploy`.
- **Secret/key changed** → `npx wrangler secret put <NAME>` (no rebuild). A new
  Turnstile **site** key also needs a client rebuild (it's baked into the bundle).
- **CORS** — update `ALLOWED_ORIGIN` in `wrangler.toml`, then `wrangler deploy`.

### Notes / gotchas

- The Notion JS SDK (`@notionhq/client`) does **not** run on the Workers
  runtime — `server/src/notion.ts` calls the Notion REST API directly via `fetch`.
- Pages project name == subdomain, and the namespace is global, so the desired
  name may be taken (and is not renamable — delete + recreate to change).

## Notes

- Respects `prefers-reduced-motion` (particles/geometry render static).
- The JS liquid-glass cursor activates only on pointer-fine devices; themed
  `.cur` files in `client/public/cursors` are the CSS fallback. `.ani` cursors
  are skipped (unsupported by browsers).
- No secrets are committed — `.env` files are git-ignored.
```
