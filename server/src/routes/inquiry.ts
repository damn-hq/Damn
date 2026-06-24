import { Router } from "express";
import { inquirySchema } from "../schema.js";
import { verifyTurnstile } from "../turnstile.js";
import { createInquiry } from "../notion.js";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Invalid submission.",
      issues: parsed.error.flatten().fieldErrors,
    });
  }
  const data = parsed.data;

  const ip =
    (req.headers["cf-connecting-ip"] as string) ||
    req.ip ||
    undefined;
  const human = await verifyTurnstile(data.turnstileToken, ip);
  if (!human) {
    return res
      .status(400)
      .json({ ok: false, error: "Captcha verification failed." });
  }

  try {
    await createInquiry(data);
    return res.json({ ok: true });
  } catch (err) {
    console.error("[inquiry] Notion error:", err);
    return res
      .status(502)
      .json({ ok: false, error: "Could not save your inquiry. Try again." });
  }
});

export default router;
