# Plan de analítica — LYSIA 0.0.0

## Embudo

`landing_view → cta_click → form_start → form_submit`

## Eventos implementados

| Evento | Disparador | Uso |
|---|---|---|
| `landing_view` | carga inicial | visitas válidas |
| `hero_cta_click` | CTA principal | fuerza del hero |
| `cta_click` | CTA secundario | ubicación de intención |
| `plan_selected` | selección de membresía | preferencia comercial |
| `form_start` | primera interacción | fricción inicial |
| `form_error` | fallo de envío | diagnóstico técnico |
| `form_submit` | solicitud guardada | conversión primaria |
| `nav_click` | navegación interna | interés por sección |
| `faq_open` | apertura de pregunta | objeciones activas |
| `scroll_depth` | 25/50/75/90 % | consumo del argumento |

## Propiedades

`event_id`, `session_id`, `offer_id`, `variant_id`, `cta_id`, `cta_location`, `plan`, profundidad y UTMs disponibles.

## Privacidad

Los eventos no almacenan nombre, contacto ni texto libre. La información personal queda únicamente en la solicitud de evaluación con consentimiento.

## Pendiente

GA4/GTM, Meta Pixel, Google Ads y CAPI permanecen desactivados hasta contar con IDs, propósito y configuración de consentimiento aprobados.
