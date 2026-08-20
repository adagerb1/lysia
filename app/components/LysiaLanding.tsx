"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const VERSION = "0.0.0";
const VARIANT = "control_v000";

const concerns = [
  "Consentimientos o historia clínica",
  "Queja o reclamación de un paciente",
  "Relación con clínica, IPS o aseguradora",
  "Contratos de mi práctica",
  "Riesgo reputacional",
  "Quiero prevenir antes de una crisis",
];

const systemItems = [
  {
    number: "01",
    title: "Diagnóstico preventivo",
    text: "Mapea exposición jurídica, orden documental y prioridades antes de que exista una urgencia.",
  },
  {
    number: "02",
    title: "Expediente protegido",
    text: "Centraliza documentos, versiones y decisiones con trazabilidad por cada solicitud.",
  },
  {
    number: "03",
    title: "Tickets y SLA",
    text: "Cada consulta tiene estado, responsable, nivel de riesgo y un siguiente paso visible.",
  },
  {
    number: "04",
    title: "Agenda jurídica",
    text: "Activa acompañamiento según el plan, la disponibilidad y la prioridad real del caso.",
  },
  {
    number: "05",
    title: "IA con revisión humana",
    text: "Acelera lectura, clasificación y borradores sin delegar el criterio jurídico a una máquina.",
  },
  {
    number: "06",
    title: "Alertas y continuidad",
    text: "Convierte vencimientos, documentos faltantes y señales de riesgo en acciones preventivas.",
  },
];

const plans = [
  {
    name: "Professional",
    eyebrow: "Plan de referencia",
    description:
      "Para especialistas que necesitan prevención real, diagnóstico inicial, una ruta jurídica clara y uso continuo del portal.",
    items: ["Diagnóstico inicial", "Portal y expediente", "Agenda y tickets", "Operación inteligente"],
    featured: true,
  },
  {
    name: "Black",
    eyebrow: "Mayor exposición",
    description:
      "Para médicos de alto perfil que requieren prioridad, mayor capacidad documental y seguimiento preventivo periódico.",
    items: ["Prioridad operativa", "Revisión ampliada", "Evaluación de precrisis", "Reporte preventivo"],
    featured: false,
  },
  {
    name: "Elite",
    eyebrow: "Acompañamiento estratégico",
    description:
      "Para propietarios, líderes médicos y prácticas con una operación que exige reglas y acompañamiento personalizados.",
    items: ["Abogado líder", "Comité preventivo", "Acompañamiento al equipo", "Alcance personalizado"],
    featured: false,
  },
];

const faqs = [
  {
    question: "¿LYSIA reemplaza mi póliza de responsabilidad médica?",
    answer:
      "No. La póliza y LYSIA cumplen funciones diferentes. LYSIA organiza la prevención, la trazabilidad documental y la respuesta temprana con un criterio independiente, sin prometer reemplazar las coberturas contratadas.",
  },
  {
    question: "¿La membresía incluye defensa judicial ilimitada?",
    answer:
      "No. Los procesos judiciales, disciplinarios, penales o administrativos formales se evalúan y cotizan por separado. La membresía se concentra en prevención, organización y atención temprana dentro de límites claros.",
  },
  {
    question: "¿Qué sucede después de solicitar la evaluación?",
    answer:
      "El equipo revisa tu especialidad, tipo de práctica y preocupación principal. Si existe ajuste con LYSIA, te contactará para una conversación de diagnóstico y recomendará el nivel de acompañamiento adecuado.",
  },
  {
    question: "¿La inteligencia artificial entrega conceptos jurídicos?",
    answer:
      "No de forma autónoma. La IA funciona como capa de preparación para clasificar, resumir y estructurar información. Las respuestas jurídicas dirigidas al médico requieren revisión humana.",
  },
  {
    question: "¿Para qué tipo de médico está diseñado LYSIA?",
    answer:
      "Para médicos especialistas con práctica privada, exposición reputacional, procedimientos de riesgo, relación frecuente con clínicas o aseguradoras, o necesidad de ordenar preventivamente su documentación.",
  },
];

function getSessionId() {
  if (typeof window === "undefined") return "server";
  const key = "lysia_session_id";
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const created = createEventId();
  window.sessionStorage.setItem(key, created);
  return created;
}

function createEventId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function getAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "fbclid",
  ];
  return Object.fromEntries(keys.map((key) => [key, params.get(key)]).filter(([, value]) => value));
}

function track(
  eventName: string,
  data: { ctaId?: string; ctaLocation?: string; metadata?: Record<string, unknown> } = {},
) {
  if (typeof window === "undefined") return;
  const eventId = createEventId();
  const sessionId = getSessionId();
  const event = {
    event: eventName,
    event_id: eventId,
    offer_id: "lysia_membership",
    variant_id: VARIANT,
    cta_id: data.ctaId,
    cta_location: data.ctaLocation,
    ...data.metadata,
  };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);

  const payload = JSON.stringify({
    eventId,
    eventName,
    sessionId,
    ctaId: data.ctaId,
    ctaLocation: data.ctaLocation,
    metadata: { ...data.metadata, ...getAttribution() },
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/events", new Blob([payload], { type: "application/json" }));
  } else {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }
}

export function LysiaLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Professional");
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");
  const [formStarted, setFormStarted] = useState(false);
  const formRef = useRef<HTMLElement>(null);
  const sentDepths = useRef(new Set<number>());

  useEffect(() => {
    track("landing_view", { metadata: { page_version: VERSION } });
    const onScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight <= 0) return;
      const depth = Math.round((window.scrollY / documentHeight) * 100);
      [25, 50, 75, 90].forEach((mark) => {
        if (depth >= mark && !sentDepths.current.has(mark)) {
          sentDepths.current.add(mark);
          track("scroll_depth", { metadata: { depth: mark } });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToAssessment = (location: string, plan?: string) => {
    if (plan) {
      setSelectedPlan(plan);
      track("plan_selected", { ctaLocation: location, metadata: { plan } });
    }
    track(location === "hero" ? "hero_cta_click" : "cta_click", {
      ctaId: `${location}_assessment`,
      ctaLocation: location,
      metadata: { plan: plan ?? selectedPlan },
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const handleNav = (target: string) => {
    track("nav_click", { metadata: { target_section: target } });
    setMenuOpen(false);
  };

  const startForm = () => {
    if (formStarted) return;
    setFormStarted(true);
    track("form_start", { ctaLocation: "assessment_form" });
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("sending");
    setFormMessage("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      specialty: form.get("specialty"),
      city: form.get("city"),
      contact: form.get("contact"),
      concern: form.get("concern"),
      company: form.get("company"),
      planInterest: selectedPlan,
      consent: form.get("consent") === "on",
      attribution: getAttribution(),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; reference?: string };
      if (!response.ok) throw new Error(result.error ?? "No fue posible enviar la solicitud.");
      setFormStatus("success");
      setFormMessage(
        `Solicitud recibida. Referencia ${result.reference ?? "LYSIA"}. El equipo revisará tu perfil antes de contactarte.`,
      );
      event.currentTarget.reset();
      track("form_submit", { ctaLocation: "assessment_form", metadata: { plan: selectedPlan } });
    } catch (error) {
      setFormStatus("error");
      setFormMessage(error instanceof Error ? error.message : "No fue posible enviar la solicitud.");
      track("form_error", { ctaLocation: "assessment_form", metadata: { error_type: "submission" } });
    }
  };

  return (
    <main>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>

      <div className="context-bar">
        <span>Defensa legal preventiva</span>
        <i aria-hidden="true" />
        <span>Médicos especialistas</span>
        <i aria-hidden="true" />
        <span>Acceso sujeto a evaluación</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="LYSIA, volver al inicio" onClick={() => handleNav("inicio")}>
          <Image src="/brand/lysia-mark.png" width={540} height={540} alt="" priority unoptimized />
          <span>LYSIA</span>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <nav className={menuOpen ? "decision-nav open" : "decision-nav"} aria-label="Navegación principal">
          <a href="#riesgo" onClick={() => handleNav("riesgo")}>El riesgo</a>
          <a href="#sistema" onClick={() => handleNav("sistema")}>El sistema</a>
          <a href="#proceso" onClick={() => handleNav("proceso")}>Cómo funciona</a>
          <a href="#membresias" onClick={() => handleNav("membresias")}>Membresías</a>
          <a href="#preguntas" onClick={() => handleNav("preguntas")}>Preguntas</a>
          <button className="button button-small" type="button" onClick={() => goToAssessment("header")}>
            Solicitar evaluación
          </button>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grid" id="contenido">
          <div className="hero-copy">
            <p className="eyebrow"><span /> LegalTech para especialistas médicos</p>
            <h1>La defensa legal del médico empieza <em>antes</em> de la reclamación.</h1>
            <p className="hero-lead">
              LYSIA convierte documentos, riesgos y decisiones en un sistema preventivo con trazabilidad, respuesta temprana y criterio jurídico humano.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" type="button" onClick={() => goToAssessment("hero")}>
                Solicitar evaluación estratégica
                <span aria-hidden="true">→</span>
              </button>
              <a className="text-link" href="#sistema" onClick={() => handleNav("sistema")}>Conocer el sistema</a>
            </div>
            <div className="trust-row" aria-label="Principios de confianza">
              <span>Confidencialidad</span>
              <span>Revisión humana</span>
              <span>Trazabilidad</span>
            </div>
          </div>

          <div className="command-visual" aria-label="Vista conceptual del portal preventivo LYSIA">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="command-card">
              <div className="command-topline">
                <div className="command-brand"><Image src="/brand/lysia-mark.png" width={540} height={540} alt="" unoptimized /><span>Command Center</span></div>
                <span className="status-dot">Protección activa</span>
              </div>
              <div className="index-block">
                <div>
                  <span className="micro-label">Lysis Index</span>
                  <strong>74</strong><small>/100</small>
                </div>
                <div className="index-ring"><span>74%</span></div>
              </div>
              <div className="command-list">
                <div><span className="risk-state safe" /> <p>Consentimientos</p><b>Verificados</b></div>
                <div><span className="risk-state watch" /> <p>Contratos con IPS</p><b>Revisar</b></div>
                <div><span className="risk-state safe" /> <p>Expediente preventivo</p><b>Actualizado</b></div>
              </div>
              <div className="command-footer">
                <span>Próxima revisión</span>
                <strong>Programada</strong>
              </div>
            </div>
            <div className="floating-note note-one"><span>R1</span> Riesgo clasificado</div>
            <div className="floating-note note-two"><span>✓</span> Revisión humana</div>
          </div>
        </div>
      </section>

      <section className="section section-ice" id="riesgo">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> El punto ciego</p>
            <h2>El problema no siempre es lo que ocurrió. Es cómo quedó documentado y cómo se respondió.</h2>
          </div>
          <p>
            Una queja mal contestada, un consentimiento genérico o un expediente disperso pueden convertir una inconformidad manejable en un riesgo reputacional, patrimonial o profesional.
          </p>
        </div>
        <div className="risk-grid">
          {[
            ["01", "Paciente inconforme", "Una respuesta impulsiva deja evidencia sin estrategia."],
            ["02", "Clínica o IPS", "Un requerimiento llega y los soportes están dispersos."],
            ["03", "Aseguradora", "La cobertura existe, pero no necesariamente ordena tu defensa."],
            ["04", "Entorno digital", "Una situación clínica escala a reputación en cuestión de horas."],
          ].map(([number, title, text]) => (
            <article className="risk-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="insight-strip">
          <p>La póliza puede cubrir determinados escenarios.</p>
          <strong>Tu prestigio necesita prevención, trazabilidad y una respuesta independiente.</strong>
        </div>
      </section>

      <section className="section section-dark" id="sistema">
        <div className="section-heading centered-heading">
          <p className="eyebrow eyebrow-light"><span /> El sistema LYSIA</p>
          <h2>No es una llamada de emergencia.<br />Es una infraestructura permanente de protección.</h2>
          <p>La tecnología organiza. El equipo jurídico interpreta. Tú decides con claridad antes de que el riesgo escale.</p>
        </div>
        <div className="system-grid">
          {systemItems.map((item) => (
            <article className="system-card" key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <button className="button button-inverse section-cta" type="button" onClick={() => goToAssessment("system")}>
          Evaluar mi nivel de exposición <span aria-hidden="true">→</span>
        </button>
      </section>

      <section className="section" id="proceso">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> Cómo funciona</p>
            <h2>De la incertidumbre a una ruta de protección visible.</h2>
          </div>
          <p>La experiencia está diseñada para que el médico entienda qué sucede, quién responde y cuál es el siguiente paso.</p>
        </div>
        <div className="process-line">
          {[
            ["01", "Evaluamos", "Especialidad, práctica, documentos y preocupaciones principales."],
            ["02", "Activamos", "Plan, portal, expediente y diagnóstico preventivo inicial."],
            ["03", "Organizamos", "Documentos, alertas, tickets y decisiones con trazabilidad."],
            ["04", "Respondemos", "El riesgo se clasifica y llega al nivel jurídico que corresponde."],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section authority-section">
        <div className="authority-mark">
          <Image src="/brand/lysia-mark.png" width={540} height={540} alt="Símbolo LYSIA" unoptimized />
        </div>
        <div className="authority-copy">
          <p className="eyebrow"><span /> Dirección jurídico-estratégica</p>
          <h2>Criterio legal especializado, traducido al ritmo de la práctica médica.</h2>
          <p>
            LYSIA es liderada por <strong>Mayerlin Marimón</strong>, abogada y magíster en Responsabilidad Civil y del Estado. Su enfoque conecta prevención, documentación y estrategia para proteger el nombre profesional del especialista sin dramatismo ni promesas absolutas.
          </p>
          <blockquote>“La defensa no debería comenzar cuando el conflicto ya controla la agenda del médico.”</blockquote>
        </div>
      </section>

      <section className="section section-ice" id="membresias">
        <div className="section-heading centered-heading">
          <p className="eyebrow"><span /> Arquitectura de acompañamiento</p>
          <h2>El nivel de protección debe corresponder a tu nivel de exposición.</h2>
          <p>La recomendación final se define después de conocer tu práctica. Ningún plan promete atención o defensa ilimitada.</p>
        </div>
        <div className="plans-grid">
          {plans.map((plan) => (
            <article className={plan.featured ? "plan-card featured" : "plan-card"} key={plan.name}>
              {plan.featured && <span className="recommended">Recomendado para iniciar</span>}
              <p className="plan-eyebrow">{plan.eyebrow}</p>
              <h3>LYSIA {plan.name}</h3>
              <p>{plan.description}</p>
              <ul>
                {plan.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <button className={plan.featured ? "button button-primary" : "button button-outline"} type="button" onClick={() => goToAssessment("plans", plan.name)}>
                Evaluar mi perfil
              </button>
            </article>
          ))}
        </div>
        <p className="plans-note">Essential funciona como nivel de entrada y Elite se configura mediante diagnóstico consultivo. Alcances, límites y condiciones se presentan antes de cualquier contratación.</p>
      </section>

      <section className="section fit-section">
        <div className="fit-card fit-yes">
          <p className="eyebrow"><span /> LYSIA puede ser para ti si</p>
          <h2>Tu nombre profesional es un activo que no puedes improvisar.</h2>
          <ul>
            <li>Tienes práctica privada o realizas procedimientos de alta exposición.</li>
            <li>Atiendes pacientes particulares o trabajas con clínicas y aseguradoras.</li>
            <li>Quieres ordenar documentos antes de recibir una reclamación.</li>
            <li>Necesitas responsables, tiempos y trazabilidad claros.</li>
          </ul>
        </div>
        <div className="fit-card fit-no">
          <p className="eyebrow eyebrow-light"><span /> No es la opción adecuada si</p>
          <h2>Buscas una promesa ilimitada o una defensa judicial incluida sin evaluar el caso.</h2>
          <p>LYSIA trabaja con alcances, revisión humana y reglas claras. La prevención no elimina el riesgo; mejora tu capacidad de anticiparlo y responder.</p>
        </div>
      </section>

      <section className="section assessment-section" id="evaluacion" ref={formRef}>
        <div className="assessment-copy">
          <p className="eyebrow eyebrow-light"><span /> Solicitud de acceso</p>
          <h2>Antes de recomendar un plan, necesitamos entender tu exposición.</h2>
          <p>Completa esta evaluación inicial. No es una consulta jurídica ni activa una membresía. Permite validar si LYSIA puede aportar valor a tu práctica.</p>
          <div className="assessment-steps">
            <div><span>1</span><p><strong>Envías tu perfil</strong>Especialidad, ciudad y preocupación principal.</p></div>
            <div><span>2</span><p><strong>Validamos el ajuste</strong>Revisamos si el modelo responde a tu necesidad.</p></div>
            <div><span>3</span><p><strong>Definimos el siguiente paso</strong>Si aplica, coordinamos el diagnóstico.</p></div>
          </div>
        </div>
        <div className="form-shell">
          {formStatus === "success" ? (
            <div className="form-result" role="status">
              <span>✓</span>
              <h3>Tu solicitud entró en evaluación.</h3>
              <p>{formMessage}</p>
              <button className="text-link" type="button" onClick={() => { setFormStatus("idle"); setFormMessage(""); }}>Enviar otra solicitud</button>
            </div>
          ) : (
            <form onSubmit={submitForm} onFocus={startForm}>
              <div className="form-heading">
                <span>Interés: LYSIA {selectedPlan}</span>
                <h3>Evaluación estratégica</h3>
              </div>
              <label>Nombre completo<input name="name" type="text" autoComplete="name" required maxLength={100} /></label>
              <div className="form-row">
                <label>Especialidad<input name="specialty" type="text" autoComplete="organization-title" required maxLength={120} /></label>
                <label>Ciudad<input name="city" type="text" autoComplete="address-level2" required maxLength={80} /></label>
              </div>
              <label>WhatsApp o correo profesional<input name="contact" type="text" autoComplete="email" required maxLength={80} /></label>
              <label>Principal preocupación<select name="concern" required defaultValue=""><option value="" disabled>Selecciona una opción</option>{concerns.map((concern) => <option key={concern}>{concern}</option>)}</select></label>
              <label className="honeypot" aria-hidden="true">Empresa<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
              <label className="consent"><input name="consent" type="checkbox" required /><span>Autorizo a LYSIA a tratar estos datos para evaluar mi solicitud y contactarme. Entiendo que este formulario no constituye asesoría jurídica.</span></label>
              <button className="button button-primary button-full" type="submit" disabled={formStatus === "sending"}>
                {formStatus === "sending" ? "Enviando solicitud…" : "Solicitar mi evaluación"}
              </button>
              {formStatus === "error" && <p className="form-error" role="alert">{formMessage}</p>}
              <p className="form-microcopy">Información reservada. Sin pago y sin activación automática de una membresía.</p>
            </form>
          )}
        </div>
      </section>

      <section className="section faq-section" id="preguntas">
        <div className="section-heading split-heading">
          <div><p className="eyebrow"><span /> Preguntas de decisión</p><h2>Claridad antes de avanzar.</h2></div>
          <p>LYSIA no construye confianza ocultando límites. Estas son las respuestas que debes conocer antes de solicitar acceso.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question} onToggle={(event) => { if (event.currentTarget.open) track("faq_open", { metadata: { faq_index: index + 1 } }); }}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<i aria-hidden="true">+</i></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <Image className="brand-mark-white" src="/brand/lysia-mark.png" width={540} height={540} alt="" unoptimized />
        <p className="eyebrow eyebrow-light"><span /> Lisis del conflicto</p>
        <h2>Disolver el conflicto.<br />Proteger el prestigio.</h2>
        <p>La mejor oportunidad para ordenar tu defensa es antes de necesitarla con urgencia.</p>
        <button className="button button-inverse" type="button" onClick={() => goToAssessment("final")}>
          Solicitar evaluación estratégica <span aria-hidden="true">→</span>
        </button>
      </section>

      <footer>
        <div className="footer-brand">
          <div className="brand brand-inverse" aria-label="LYSIA">
            <Image src="/brand/lysia-mark.png" width={540} height={540} alt="" unoptimized />
            <strong>LYSIA</strong>
          </div>
          <span>Molecular Precision · Biological Defense</span>
        </div>
        <p>Legal as a Service para médicos especialistas.</p>
        <div className="footer-meta"><span>© 2026 LYSIA</span><a href="#evaluacion">Tratamiento de datos</a><a href="#preguntas">Alcance del servicio</a><span>v{VERSION}</span></div>
      </footer>

      <button className="mobile-sticky-cta" type="button" onClick={() => goToAssessment("mobile_sticky")}>
        Solicitar evaluación <span aria-hidden="true">→</span>
      </button>
    </main>
  );
}
