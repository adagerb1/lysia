# LYSIA One Page

Sitio de posicionamiento y conversión para LYSIA, una LegalTech de defensa preventiva para médicos especialistas.

## Versión

`0.0.0` — hipótesis inicial de marca, narrativa, conversión y captura de solicitudes.

## Experiencia principal

- Promesa frontal: la defensa legal empieza antes de la reclamación.
- Recorrido de decisión: riesgo → nuevo enfoque → sistema → proceso → autoridad → membresías → evaluación.
- Conversión primaria: solicitud de evaluación estratégica.
- Captura persistente de solicitudes en D1.
- Eventos propios de conversión sin cargar píxeles publicitarios.
- Diseño responsive, navegación accesible y CTA móvil.

## Desarrollo

```bash
npm run dev
npm run lint
npm run build
npm test
```

Después de modificar `db/schema.ts`, generar la migración con:

```bash
npm run db:generate
```

## Control de versiones

Las iteraciones se trabajan fuera de `main`. Cada versión debe incluir su entrada en `CHANGELOG.md`, validación y vista previa. La incorporación a `main` ocurre únicamente después de la aprobación del usuario.

## Documentación

- `README_ESTRATEGIA.md`: hipótesis y decisiones de conversión.
- `COPY_LANDING.md`: arquitectura narrativa y copy.
- `ANALYTICS_PLAN.md`: eventos y embudo.
- `CONVERSION_SYSTEM.md`: captura y atribución.
- `DATA_SCHEMA.md`: estructura de datos.
- `QA_REPORT.md`: validaciones ejecutadas.
- `DEPLOYMENT_CHECKLIST.md`: condiciones previas a publicación final.
