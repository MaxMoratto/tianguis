import Link from "next/link";
import { DashSide, Kpi, NavItem, Who } from "@/components/Dash";

export const metadata = { title: "Centro de control — Tianguis Digital MX" };
export const dynamic = "force-dynamic";

const items: NavItem[] = [
  { k: "res", e: "📊", n: "Resumen" },
  { k: "mod", e: "🛡️", n: "Moderación IA" },
  { k: "u", e: "👥", n: "Usuarios" },
  { k: "pub", e: "📦", n: "Publicaciones" },
  { k: "ing", e: "💰", n: "Ingresos" },
  { k: "cen", e: "🏪", n: "Centros de entrega" },
];
const who: Who = {
  i: "A",
  n: "Admin · Tianguis MX",
  r: "Centro de control",
  c: "#101413",
};

export default function AdminPage() {
  return (
    <div className="page">
      <div className="wrap">
        <div className="crumbs">
          <Link href="/">Inicio</Link> / Centro de control
        </div>
        <h2 className="sec-title" style={{ margin: "6px 0 0" }}>
          Panel del administrador
        </h2>

        <div className="dash mt24">
          <DashSide active="res" items={items} who={who} />
          <div>
            <div className="kpis">
              <Kpi l="Puestos activos" v="0" />
              <Kpi l="Usuarios totales" v="0" />
              <Kpi l="Ingresos semana" v="$0" />
              <Kpi l="Reportes abiertos" v="0" />
            </div>

            <div className="panel">
              <h3>🛡️ Cola de moderación (IA)</h3>
              <p className="muted" style={{ fontSize: 14 }}>
                Sin elementos en revisión.
              </p>
            </div>

            <div className="panel">
              <h3>💰 Ingresos por plan (esta semana)</h3>
              <p className="muted" style={{ fontSize: 14 }}>
                Aún no hay ingresos registrados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
