// Mirrors server/src/schema.ts (inquirySchema). Keep field optionality in sync
// with the zod schema — the Worker is the source of truth on validation.
export type InquiryPayload = {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  projectType?: string;
  requirements: string;
  referral?: string;
  turnstileToken: string;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8787";

export async function submitInquiry(
  payload: InquiryPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };
    if (!res.ok || !data.ok) {
      return {
        ok: false,
        error: data.error || `Request failed (${res.status})`,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error — is the API running?" };
  }
}
