import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SiteEffects from "./components/SiteEffects";
import TerraqoChatEmbed from "./components/TerraqoChatEmbed";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://icctopografia.com"),
  title: {
    default: "ICC Topografia - Servicios topograficos profesionales en Peru",
    template: "%s | ICC Topografia"
  },
  description:
    "Levantamientos topograficos, replanteo, georreferenciacion, control de obra, catastro y venta tecnica de equipos para proyectos en Peru.",
  openGraph: {
    title: "ICC Topografia",
    description:
      "Datos metricos confiables para decidir en campo sin retrabajos.",
    url: "https://icctopografia.com",
    siteName: "ICC Topografia",
    locale: "es_PE",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <SiteEffects />
        <Header />
        <main>{children}</main>
        <Footer />
        <TerraqoChatEmbed />
      </body>
    </html>
  );
}
