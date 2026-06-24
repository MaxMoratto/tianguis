import Link from "next/link";
import { DashSide, Kpi, NavItem, Who } from "@/components/Dash";

export const metadata = { title: "Mi cuenta — Tianguis Digital MX" };
export const dynamic = "force-dynamic";

const items: NavItem[] = [
  { k: "fav", e: "🤍", n: "Favoritos" },
  { k: "h", e: "🕘", n: "Historial" },
  { k: "s", e: "👥", n: "Vendedores seguidos" },
  { k: "m", e: "💬", n: "Mensajes" },
  { k: "c", e: "⚙️", n: "Mi cuenta" },
];
const who: Who = { i: "U", n: "Mi cuenta", r: "Comprador", c: "#e0654b" };

export default function CompradorPage() {
  return (
    <div className="page">
      <div className="wrap">
        <div className="crumbs">
          <Link href="/">Inicio</Link> / Mi cuenta
        </div>
        <h2 className="sec-title" style={{ margin: "6px 0 0" }}>
          Mi tianguis
        </h2>

        <div className="dash mt24">
          <DashSide active="fav" items={items} who={who} />
          <div>
            <div className="kpis">
              <Kpi l="Favoritos" v="0" />
              <Kpi l="Vendedores seguidos" v="0" />
              <Kpi l="Compras realizadas" v="0" />
              <Kpi l="Mensajes activos" v="0" />
            </div>

            <div className="panel">
              <h3>Tus favoritos</h3>
              <p className="muted" style={{ fontSize: 14 }}>
                Aún no tienes favoritos. Explora el{" "}
                <Link
                  href="/mercado"
                  style={{ color: "var(--verde-700)", fontWeight: 700 }}
                >
                  mercado
                </Link>{" "}
                y guarda lo que te guste.
              </p>
            </div>

            <div className="panel">
              <h3>Historial reciente</h3>
              <p className="muted" style={{ fontSize: 14 }}>
                Todavía no tienes compras registradas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
