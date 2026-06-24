import { Hono } from "hono";
import { cors } from "hono/cors";
import inquiry from "./routes/inquiry.js";
import type { Env } from "./env.js";

const app = new Hono<{ Bindings: Env }>();

app.use("*", (c, next) =>
  cors({
    origin: c.env.ALLOWED_ORIGIN.split(",").map((o) => o.trim()),
    allowMethods: ["GET", "POST"],
  })(c, next),
);

app.get("/health", (c) => c.json({ ok: true }));
app.route("/api/inquiry", inquiry);

export default app;
