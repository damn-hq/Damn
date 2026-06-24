import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional().default(""),
  budget: z.string().trim().max(60).optional().default(""),
  projectType: z.string().trim().max(80).optional().default(""),
  requirements: z.string().trim().min(10).max(5000),
  referral: z.string().trim().max(200).optional().default(""),
  turnstileToken: z.string().min(1, "Captcha token missing"),
});

export type Inquiry = z.infer<typeof inquirySchema>;
