import { Client } from "@notionhq/client";
import type { Inquiry } from "./schema.js";

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    const auth = process.env.NOTION_API_KEY;
    if (!auth) throw new Error("NOTION_API_KEY is not set");
    client = new Client({ auth });
  }
  return client;
}

/**
 * Creates a row in the configured Notion database for an inquiry.
 * Expected DB properties (see README): Name (title), Email, Company,
 * Budget (select), Project Type (select), Requirements (rich_text),
 * Referral, Status (select), Submitted (date).
 */
export async function createInquiry(data: Inquiry): Promise<void> {
  const databaseId = process.env.NOTION_DB_ID;
  if (!databaseId) throw new Error("NOTION_DB_ID is not set");

  await getClient().pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Email: { email: data.email },
      Company: {
        rich_text: data.company
          ? [{ text: { content: data.company } }]
          : [],
      },
      Budget: data.budget ? { select: { name: data.budget } } : { select: null },
      "Project Type": data.projectType
        ? { select: { name: data.projectType } }
        : { select: null },
      Requirements: {
        rich_text: chunkRichText(data.requirements),
      },
      Referral: {
        rich_text: data.referral
          ? [{ text: { content: data.referral } }]
          : [],
      },
      Status: { select: { name: "New" } },
      Submitted: { date: { start: new Date().toISOString() } },
    },
  });
}

/** Notion rich_text content blocks cap at 2000 chars each. */
function chunkRichText(text: string) {
  const chunks: { text: { content: string } }[] = [];
  for (let i = 0; i < text.length; i += 1900) {
    chunks.push({ text: { content: text.slice(i, i + 1900) } });
  }
  return chunks.length ? chunks : [{ text: { content: "" } }];
}
