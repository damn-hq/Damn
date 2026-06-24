import type { Inquiry } from "./schema.js";
import type { Env } from "./env.js";

const NOTION_API = "https://api.notion.com/v1/pages";
const NOTION_VERSION = "2022-06-28";

/**
 * Creates a row in the configured Notion database for an inquiry.
 * Uses the Notion REST API directly (the JS SDK does not run on the
 * Workers runtime). Expected DB properties (see README): Name (title),
 * Email, Company, Budget (select), Project Type (select),
 * Requirements (rich_text), Referral, Status (select), Submitted (date).
 */
export async function createInquiry(env: Env, data: Inquiry): Promise<void> {
  if (!env.NOTION_API_KEY) throw new Error("NOTION_API_KEY is not set");
  if (!env.NOTION_DB_ID) throw new Error("NOTION_DB_ID is not set");

  const body = {
    parent: { database_id: env.NOTION_DB_ID },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Email: { email: data.email },
      Company: {
        rich_text: data.company ? [{ text: { content: data.company } }] : [],
      },
      Budget: data.budget ? { select: { name: data.budget } } : { select: null },
      "Project Type": data.projectType
        ? { select: { name: data.projectType } }
        : { select: null },
      Requirements: { rich_text: chunkRichText(data.requirements) },
      Referral: {
        rich_text: data.referral ? [{ text: { content: data.referral } }] : [],
      },
      Status: { select: { name: "New" } },
      Submitted: { date: { start: new Date().toISOString() } },
    },
  };

  const res = await fetch(NOTION_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Notion API ${res.status}: ${detail}`);
  }
}

/** Notion rich_text content blocks cap at 2000 chars each. */
function chunkRichText(text: string) {
  const chunks: { text: { content: string } }[] = [];
  for (let i = 0; i < text.length; i += 1900) {
    chunks.push({ text: { content: text.slice(i, i + 1900) } });
  }
  return chunks.length ? chunks : [{ text: { content: "" } }];
}
