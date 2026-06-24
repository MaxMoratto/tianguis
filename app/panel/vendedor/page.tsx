import Link from "next/link";
import { DashSide, Kpi, NavItem, Who } from "@/components/Dash";
import EstadoPuesto from "@/components/EstadoPuesto";

export const metadata = { title: "Panel del vendedor — Tianguis Digital MX" };
export const dynamic = "force-dynamic";

const items: NavItem[] = [
  { k: "inicio", e: "📊", n: "Resumen" },
  { k: "p", e: "📦", n: "Mis productos" },
  { k: "m", e: "💬", n: "Mensajes" },
  { k: "e", e: "📈", n: "Estadísticas" },
  { k: "pl", e: "⭐", n: "Mi plan" },
  { k: "r", e: "🏅", n: "Reputación" },
];
const who: Who = { i: "T", n: "Mi puesto", r: "Sin plan activo", c: "#0a7d4f" };

export default function VendedorPage() {
  return (
    <div className="page">
      <div className="wrap">
        <div className="pagehead">
          <div>
            <div className="crumbs">
              <Link href="/">Inicio</Link> / Panel del vendedor
            </div>
            <h2 className="sec-title" style={{ marginTop: 6 }}>
              Tu panel
            </h2>
          </div>
          <Link className="btn btn-primary" href="/panel/vendedor/nuevo">
            + Subir producto
          </Link>
        </div>

        <div className="dash mt24">
          <DashSide active="inicio" items={items} who={who} />
          <div>
            <div className="kpis">
              <Kpi l="Visualizaciones (7d)" v="0" />
              <Kpi l="Clics a productos" v="0" />
              <Kpi l="Consultas (chat)" v="0" />
              <Kpi l="Ventas reportadas" v="0" />
            </div>

            <div className="panel">
              <h3>Mis productos</h3>
              <p className="muted" style={{ fontSize: 14 }}>
                Aún no tienes productos.{" "}
                <Link
                  href="/panel/vendedor/nuevo"
                  style={{ color: "var(--verde-700)", fontWeight: 700 }}
                >
                  Sube tu primer producto
                </Link>{" "}
                para empezar a vender.
              </p>
            </div>

            <EstadoPuesto />
          </div>
        </div>
      </div>
    </div>
  );
}
