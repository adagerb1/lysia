# Esquema de datos — LYSIA 0.0.0

## `lead_submissions`

- `id`: UUID.
- `name`, `specialty`, `city`, `contact`, `concern`.
- `plan_interest`.
- `consent`.
- `attribution_json`.
- `status`.
- `created_at`.

## `conversion_events`

- `id`: UUID/idempotency key.
- `event_name`.
- `session_id` anónimo.
- `cta_id`, `cta_location`.
- `variant_id`.
- `metadata_json` sin datos personales.
- `created_at`.

## Endpoints

- `POST /api/leads`: valida y registra solicitudes.
- `POST /api/events`: valida una lista cerrada de eventos.

## Retención y acceso

La política definitiva debe ser aprobada antes del lanzamiento público. El acceso a D1 permanece restringido a la operación autorizada del sitio.
