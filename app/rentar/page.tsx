import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { PLANES } from "@/lib/plans";
import { money } from "@/lib/format";

export const metadata = {
  title: "Renta tu puesto — Tianguis Digital MX",
};

export default function RentarPage() {
  return (
    <div className="page">
      <div className="wrap">
        <div className="crumbs">
          <Link href="/">Inicio</Link> / Rentar puesto
        </div>

        <div className="center" style={{ margin: "10px 0 32px" }}>
          <h2 className="sec-title">Renta tu puesto digital</h2>
          <div className="sec-sub">
            Cobro mensual · sin comisión por venta · cancela cuando quieras
          </div>
        </div>

        <div className="plans">
          {PLANES.map((p) => (
            <div className={`plan-card ${p.destacado ? "feat" : ""}`} key={p.id}>
              <div className="pn">{p.nombre}</div>
              <div className="pp">
                {money(p.precioMensual)} <span>/ mes</span>
              </div>
              <ul>
                {p.beneficios.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <CheckoutButton
                plan={p.id}
                label={`Rentar ${p.nombre.replace("Puesto ", "")}`}
                className={`btn ${p.destacado ? "btn-primary" : "btn-outline"} btn-block`}
              />
            </div>
          ))}
        </div>

        <p
          className="muted"
          style={{ textAlign: "center", marginTop: 24, fontSize: 13.5 }}
        >
          Pagos seguros con Stripe (tarjeta, OXXO y SPEI). Necesitas iniciar
          sesión para rentar tu puesto.
        </p>
      </div>
    </div>
  );
}
