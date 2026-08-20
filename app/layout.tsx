import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LYSIA | Defensa legal preventiva para médicos especialistas",
  description:
    "Infraestructura legal preventiva para ordenar documentos, anticipar riesgos y proteger el prestigio de médicos especialistas.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/brand/lysia-mark.png",
    shortcut: "/brand/lysia-mark.png",
  },
  openGraph: {
    title: "LYSIA | La defensa legal empieza antes de la reclamación",
    description:
      "Defensa preventiva, trazabilidad documental y respuesta temprana para médicos especialistas.",
    type: "website",
    locale: "es_CO",
    images: [{ url: "/brand/lysia-logo.png", width: 900, height: 820 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
