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
| Backend  | Node + Express + TypeScript, `@notionhq/client`, Zod        |
| Database | Notion                                                      |
| Anti-spam| Cloudflare Turnstile (server-side `siteverify`)             |

Palette is deliberately limited to four colors: black `#0A0A0B`, bone
`#E5E5E5`, violet `#7C3AED`, cyan `#22D3EE`.

## Project layout

```
client/   Vite React app (UI, particle logo, glass, cursor, inquiry form)
server/   Express API (validation, Turnstile verify, Notion write)
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
cp .env.example .env        # fill in Notion creds
npm run dev                 # http://localhost:8787
```

`.env`:

- `NOTION_API_KEY` — integration token from https://www.notion.so/my-integrations
- `NOTION_DB_ID` — target database id (share the DB with your integration!)
- `TURNSTILE_SECRET_KEY` — Turnstile secret (example = test secret)
- `PORT` — default `8787`
- `ALLOWED_ORIGIN` — client origin for CORS (default `http://localhost:5173`)

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

For production, create a Turnstile widget at
https://dash.cloudflare.com/?to=/:account/turnstile and set the real
**site key** (client) and **secret key** (server). The committed `.env.example`
values are Cloudflare's documented test keys (always pass) for local dev.

## Build

```bash
cd client && npm run build     # -> client/dist
cd server && npm run build     # -> server/dist ; run with `npm start`
```

## Notes

- Respects `prefers-reduced-motion` (particles/geometry render static).
- The JS liquid-glass cursor activates only on pointer-fine devices; themed
  `.cur` files in `client/public/cursors` are the CSS fallback. `.ani` cursors
  are skipped (unsupported by browsers).
- No secrets are committed — `.env` files are git-ignored.
```
