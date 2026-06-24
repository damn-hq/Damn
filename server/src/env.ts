/** Worker bindings & secrets injected at runtime via the Hono context. */
export type Env = {
  /** Comma-separated list of allowed CORS origins. */
  ALLOWED_ORIGIN: string;
  NOTION_API_KEY: string;
  NOTION_DB_ID: string;
  TURNSTILE_SECRET_KEY: string;
  /** Workers Rate Limiting binding (5 req / 60s). */
  INQUIRY_LIMITER: { limit: (o: { key: string }) => Promise<{ success: boolean }> };
};
