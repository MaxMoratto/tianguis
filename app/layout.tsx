import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Tianguis Digital MX — El mercado que abre por horas",
  description:
    "El mercado en línea inspirado en los tianguis mexicanos. Abre miércoles y sábados. Renta tu puesto digital desde $10 MXN a la semana, sin comisión por venta.",
  openGraph: {
    title: "Tianguis Digital MX",
    description:
      "El mercado que abre por horas. Productos únicos, vendedores locales, la energía del tianguis de siempre.",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
