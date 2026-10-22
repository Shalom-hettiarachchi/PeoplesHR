import { leadSchema } from "@/lib/leads/schema";
import { scoreLead } from "@/lib/leads/score";
import { saveLead } from "@/lib/leads/store";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const { website, ...lead } = parsed.data;

  // Honeypot filled in: pretend it worked so bots learn nothing.
  if (website) return Response.json({ ok: true, id: "ignored" });

  const score = scoreLead(lead);
  const stored = saveLead({
    ...lead,
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    score,
  });

  console.info("[lead]", stored.source, stored.intent, stored.email, score.tier, score.score);

  return Response.json({ ok: true, id: stored.id, tier: score.tier, score: score.score, reasons: score.reasons });
}
