# Sistema de conversión — LYSIA 0.0.0

## Acción principal

Todos los CTAs llevan al mismo formulario de evaluación. Cada clic registra ubicación, plan de interés y variante.

## Captura

El formulario solicita solo nombre, especialidad, ciudad, canal de contacto y preocupación principal. Incluye consentimiento y campo antispam invisible.

## Atribución

Se conservan en la solicitud los parámetros UTM y los identificadores de clic disponibles en la URL. Los eventos se registran sin PII.

## Fuente de verdad

- Solicitudes: tabla `lead_submissions` en D1.
- Eventos: tabla `conversion_events` en D1.
- Conversión primaria: registro exitoso del formulario, no el clic.

## Degradación segura

Si el registro falla, el visitante recibe un mensaje claro y puede reintentar. No se muestra una confirmación falsa.

## Funciones no activadas

WhatsApp, presencia en tiempo real, actividad pública, cupos, pagos y píxeles publicitarios requieren datos e integraciones que todavía no están validados.
