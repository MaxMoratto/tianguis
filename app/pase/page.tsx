import Link from "next/link";
import CanjearPase from "@/components/CanjearPase";
import { DIAS_PASE } from "@/lib/pases";

export const metadata = {
  title: "Activa tu pase gratis — Tianguis Digital MX",
};

export default function PasePage() {
  return (
    <div className="page">
      <div className="wrap" style={{ maxWidth: 560 }}>
        <div className="crumbs">
          <Link href="/">Inicio</Link> / Pase gratis
        </div>

        <div className="center" style={{ margin: "10px 0 24px" }}>
          <h2 className="sec-title">🎟️ Tu pase de regalo</h2>
          <div className="sec-sub">
            {DIAS_PASE} días de puesto gratis, sin tarjeta. Escribe tu código y
            arma tu puesto en un minuto.
          </div>
        </div>

        <CanjearPase />
      </div>
    </div>
  );
}
