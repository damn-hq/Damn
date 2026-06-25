import { Hono } from "hono";
import { cors } from "hono/cors";
import { inquirySchema } from "./schema.js";
import { verifyTurnstile } from "./turnstile.js";
import { createInquiry } from "./notion.js";
import type { Env } from "./env.js";

const app = new Hono<{ Bindings: Env }>();

app.use("*", (c, next) =>
  cors({
    origin: c.env.ALLOWED_ORIGIN.split(",").map((o) => o.trim()),
    allowMethods: ["GET", "POST"],
  })(c, next),
);

app.get("/health", (c) => c.json({ ok: true }));

app.post("/api/inquiry", async (c) => {
  const ip = c.req.header("cf-connecting-ip") ?? "anon";

  const { success } = await c.env.INQUIRY_LIMITER.limit({ key: ip });
  if (!success) {
    return c.json(
      { ok: false, error: "Too many requests — slow down a moment." },
      429,
    );
  }

  const parsed = inquirySchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    return c.json(
      {
        ok: false,
        error: "Invalid submission.",
        issues: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  }
  const data = parsed.data;

  const human = await verifyTurnstile(
    c.env.TURNSTILE_SECRET_KEY,
    data.turnstileToken,
    ip,
  );
  if (!human) {
    return c.json({ ok: false, error: "Captcha verification failed." }, 400);
  }

  try {
    await createInquiry(c.env, data);
    return c.json({ ok: true });
  } catch (err) {
    console.error("[inquiry] Notion error:", err);
    return c.json(
      { ok: false, error: "Could not save your inquiry. Try again." },
      502,
    );
  }
});

export default app;
