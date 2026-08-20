import { getDb } from "../../../db";
import { leadSubmissions } from "../../../db/schema";

const MAX = {
  name: 100,
  specialty: 120,
  city: 80,
  contact: 80,
  concern: 160,
  planInterest: 40,
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const honeypot = clean(body.company, 100);
    if (honeypot) {
      return Response.json({ ok: true }, { status: 201 });
    }

    const payload = {
      id: crypto.randomUUID(),
      name: clean(body.name, MAX.name),
      specialty: clean(body.specialty, MAX.specialty),
      city: clean(body.city, MAX.city),
      contact: clean(body.contact, MAX.contact),
      concern: clean(body.concern, MAX.concern),
      planInterest: clean(body.planInterest, MAX.planInterest) || "Por definir",
      consent: body.consent === true,
      attributionJson: JSON.stringify(
        typeof body.attribution === "object" && body.attribution
          ? body.attribution
          : {},
      ).slice(0, 4000),
    };

    if (
      !payload.name ||
      !payload.specialty ||
      !payload.city ||
      !payload.contact ||
      !payload.concern ||
      !payload.consent
    ) {
      return Response.json(
        { error: "Completa los campos obligatorios y autoriza el contacto." },
        { status: 400 },
      );
    }

    await getDb().insert(leadSubmissions).values(payload);
    return Response.json({ ok: true, reference: payload.id.slice(0, 8) }, { status: 201 });
  } catch (error) {
    console.error("lead_submission_failed", error);
    return Response.json(
      { error: "No fue posible registrar la solicitud. Intenta nuevamente." },
      { status: 500 },
    );
  }
}
