import Link from "next/link";
import CanjearPase from "@/components/CanjearPase";
import { normalizarCodigo, DIAS_PASE } from "@/lib/pases";

export const metadata = {
  title: "Activa tu pase gratis — Tianguis Digital MX",
};

export default function PaseConCodigoPage({
  params,
}: {
  params: { codigo: string };
}) {
  const codigo = normalizarCodigo(decodeURIComponent(params.codigo));

  return (
    <div className="page">
      <div className="wrap" style={{ maxWidth: 560 }}>
        <div className="crumbs">
          <Link href="/">Inicio</Link> / Pase gratis
        </div>

        <div className="center" style={{ margin: "10px 0 24px" }}>
          <h2 className="sec-title">🎟️ ¡Te regalaron un pase!</h2>
          <div className="sec-sub">
            {DIAS_PASE} días de puesto gratis, sin tarjeta. Solo confirma tu
            código y ponle nombre a tu puesto.
          </div>
        </div>

        <CanjearPase codigoInicial={codigo} />
      </div>
    </div>
  );
}
