# Reporte de QA — LYSIA 0.0.0

## Alcance

- Estructura semántica y un solo H1.
- Navegación por teclado y foco visible.
- Menú responsive y CTA móvil.
- Formulario con validación, consentimiento, error y confirmación.
- Eventos y captura persistente.
- Metadatos, Open Graph y schema sin claims no verificados.

## Validación ejecutada

- `npm run lint`: aprobado sin errores ni advertencias.
- `npm run build`: aprobado; se generaron la página y las rutas `/api/leads` y `/api/events`.
- Artefacto de Sites: Worker ESM con `default.fetch` y manifiesto de hosting validados.
- Render de escritorio: aprobado en la vista previa de Sites.
- Jerarquía semántica: un solo H1 y secciones H2/H3 consistentes.
- CTA principal: desplaza correctamente a la evaluación estratégica.
- Formulario: campos, selector, consentimiento, honeypot y estados definidos.
- FAQ: expansión y respuesta verificadas en navegador.
- Analítica propia: carga sin errores de aplicación y usa identificadores compatibles con navegadores sin `crypto.randomUUID`.
- Responsive: navegación móvil, CTA fijo y rejillas adaptativas cubiertos mediante reglas para 980 px y 680 px.
- Persistencia: rutas de leads y eventos conectadas a D1 y migración generada.

El envío real del formulario queda reservado para la revisión funcional del entorno desplegado, usando datos de prueba, para no contaminar la base con registros de producción antes de la aprobación.

## Exclusiones conscientes

No se prueban pagos, WhatsApp, actividad en tiempo real ni píxeles porque esas funciones están desactivadas en `0.0.0`.
