# DAMN

Marketing site + inquiry pipeline for **Damn** — a custom website studio.

## Stack

| Layer    | Tech                                                        |
| -------- | ----------------------------------------------------------- |
| Frontend | Vite + React + TypeScript, TailwindCSS, Framer Motion       |
| Backend  | Cloudflare Workers + Hono + TypeScript, Notion REST, Zod    |
| Database | Notion                                                      |
| Anti-spam| Cloudflare Turnstile (server-side `siteverify`)             |
| Hosting  | Cloudflare Pages (client) + Cloudflare Workers (API)        |

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

`.env` vars:

- `VITE_API_BASE` — API base URL (default `http://localhost:8787`)
- `VITE_TURNSTILE_SITE_KEY` — Turnstile site key. The example uses Cloudflare's
  "always passes" test key, fine for local dev.

### 2. Server

```bash
cd server
npm install
npm run dev                 # wrangler dev — http://localhost:8787
```

Worker config comes from bindings, not `process.env`:

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
2. Create a database and **share it with the integration** (••• → Connections).
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

Create a Turnstile widget at https://dash.cloudflare.com/?to=/:account/turnstile,
add the site's domain (e.g. `damn-hq.pages.dev` + `localhost`), then set the real
**site key** in `client/.env.production` and the **secret key** via
`npx wrangler secret put TURNSTILE_SECRET_KEY`. Cloudflare's documented test keys
(always pass) are fine for local dev.

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

`npm run build` auto-loads that file automatically.

```bash
cd client
npm run build
npx wrangler pages deploy dist --project-name damn-hq --commit-dirty=true
```

`client/public/_redirects` (`/* /index.html 200`) makes React Router work on Pages.

### Server → Workers

Config in `server/wrangler.toml` (name, rate-limit binding, `ALLOWED_ORIGIN`).
Secrets via `wrangler secret put` (see Server section above).

```bash
cd server
npx wrangler deploy
```

### Redeploy after a change

| What changed          | Action                                          |
| --------------------- | ----------------------------------------------- |
| Client code           | `npm run build` + `wrangler pages deploy`       |
| Server code           | `npx wrangler deploy`                           |
| Secret / key          | `npx wrangler secret put <NAME>` (no rebuild)  |
| Turnstile **site** key| Also needs client rebuild (baked into bundle)  |
| CORS origin           | Update `ALLOWED_ORIGIN` in `wrangler.toml` + `wrangler deploy` |
