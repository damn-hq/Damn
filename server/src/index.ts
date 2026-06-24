import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import inquiryRouter from "./routes/inquiry.js";

const app = express();
const PORT = Number(process.env.PORT) || 8787;
const ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

app.set("trust proxy", 1);
app.use(express.json({ limit: "64kb" }));
app.use(
  cors({
    origin: ORIGIN.split(",").map((o) => o.trim()),
    methods: ["POST", "GET"],
  }),
);

const inquiryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests — slow down a moment." },
});

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/inquiry", inquiryLimiter, inquiryRouter);

app.listen(PORT, () => {
  console.log(`Damn API listening on http://localhost:${PORT}`);
  console.log(`CORS origin: ${ORIGIN}`);
});
