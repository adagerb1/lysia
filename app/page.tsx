import { LysiaLanding } from "./components/LysiaLanding";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "LYSIA",
        description:
          "LegalTech de defensa legal preventiva para médicos especialistas.",
        logo: "/brand/lysia-logo.png",
      },
      {
        "@type": "Service",
        name: "LYSIA - Defensa legal preventiva",
        serviceType: "Legal as a Service para médicos especialistas",
        areaServed: "Colombia",
        audience: {
          "@type": "Audience",
          audienceType: "Médicos especialistas",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LysiaLanding />
    </>
  );
}
