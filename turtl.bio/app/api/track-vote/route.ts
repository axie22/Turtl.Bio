import { NextRequest, NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const NOTION_VERSION = "2022-06-28";

/**
 * Notion page IDs for each option row in the Website Analytics database.
 * Created once; IDs are stable.
 */
const OPTION_PAGE_IDS: Record<string, string> = {
  "no-ra":    "36d9cb09-8db1-8124-bdfa-ea89fbdea5e0",
  "building": "36d9cb09-8db1-816a-a5ca-c619c9530f4e",
  "other":    "36d9cb09-8db1-8168-8a41-d73bc043450e",
};

/** Maps the URL variant slug to the Notion property name. */
const VARIANT_PROP: Record<string, string> = {
  a: "Count A",
  b: "Count B",
  c: "Count C",
};

const VALID_SELECTIONS = new Set(Object.keys(OPTION_PAGE_IDS));
const VALID_VARIANTS   = new Set(Object.keys(VARIANT_PROP));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { variant, selection } = body as { variant?: string; selection?: string };

    const v = (variant ?? "").toLowerCase();
    const s = (selection ?? "").toLowerCase();

    if (!VALID_VARIANTS.has(v) || !VALID_SELECTIONS.has(s)) {
      return NextResponse.json(
        { error: "Invalid variant or selection" },
        { status: 400 }
      );
    }

    const pageId = OPTION_PAGE_IDS[s];
    const prop   = VARIANT_PROP[v];

    // --- 1. Read current count (GET) ---
    const getRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: {
        Authorization:    `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": NOTION_VERSION,
      },
      // Don't cache — we need the live value
      cache: "no-store",
    });

    if (!getRes.ok) {
      console.error("Notion GET failed:", getRes.status, await getRes.text());
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }

    const page    = await getRes.json();
    const current: number = page.properties[prop]?.number ?? 0;

    // --- 2. Increment (PATCH) ---
    const patchRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: "PATCH",
      headers: {
        Authorization:    `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type":   "application/json",
      },
      body: JSON.stringify({
        properties: { [prop]: { number: current + 1 } },
      }),
    });

    if (!patchRes.ok) {
      console.error("Notion PATCH failed:", patchRes.status, await patchRes.text());
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, count: current + 1 });
  } catch (err) {
    console.error("track-vote error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
