import { getDb } from "../../../db";
import { conversionEvents } from "../../../db/schema";

const ALLOWED_EVENTS = new Set([
  "landing_view",
  "hero_cta_click",
  "cta_click",
  "form_start",
  "form_error",
  "form_submit",
  "nav_click",
  "faq_open",
  "scroll_depth",
  "plan_selected",
]);

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const eventName = clean(body.eventName, 60);
    const sessionId = clean(body.sessionId, 80);
    if (!ALLOWED_EVENTS.has(eventName) || !sessionId) {
      return Response.json({ error: "Invalid event" }, { status: 400 });
    }

    await getDb()
      .insert(conversionEvents)
      .values({
        id: clean(body.eventId, 80) || crypto.randomUUID(),
        eventName,
        sessionId,
        ctaId: clean(body.ctaId, 80) || null,
        ctaLocation: clean(body.ctaLocation, 80) || null,
        variantId: "control_v000",
        metadataJson: JSON.stringify(
          typeof body.metadata === "object" && body.metadata ? body.metadata : {},
        ).slice(0, 4000),
      });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("conversion_event_failed", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
