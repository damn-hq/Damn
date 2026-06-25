# CLAUDE.md — LLM context for Damn

## Project

Marketing site + inquiry pipeline for **Damn** — a custom website studio.
Quote: _DAMN GOOD_.

## Palette (hard constraint — 4 colors only)

| Name   | Hex       |
| ------ | --------- |
| Black  | `#0A0A0B` |
| Bone   | `#E5E5E5` |
| Violet | `#7C3AED` |
| Cyan   | `#22D3EE` |

Do not introduce any other colors.

## Copy constraints

- **No fake claims** — no "500+ clients", no invented metrics, no testimonials.
- **Never describe Damn as a "new startup"** — tone is confident and established.
- Copy must be qualitative; let the work speak.

## Inquiry form

- Must be gated by **Cloudflare Turnstile** (`siteverify` server-side before any Notion write).
- Submissions write to a **Notion database** via the Cloudflare Worker API.

## Architecture gotchas

- The **Notion JS SDK** (`@notionhq/client`) does not run on the Workers runtime — `server/src/notion.ts` calls the Notion REST API directly via `fetch`.
- Worker config comes from **bindings**, not `process.env`. Secrets (`NOTION_API_KEY`, `NOTION_DB_ID`, `TURNSTILE_SECRET_KEY`) are set via `wrangler secret put`, never committed.
- `VITE_API_BASE` and `VITE_TURNSTILE_SITE_KEY` are **public** and baked into the client bundle — safe to commit in `.env.production`.
- Pages project name = subdomain (global namespace, not renamable — delete + recreate to change).

## Accessibility

- Respects `prefers-reduced-motion` — particles/geometry render static.
- JS liquid-glass cursor activates only on `pointer: fine` devices; `.cur` files in `client/public/cursors` are the CSS fallback. `.ani` cursors are unsupported by browsers.
