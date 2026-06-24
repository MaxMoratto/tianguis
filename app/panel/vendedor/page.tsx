import Link from "next/link";
import { DashSide, Kpi, NavItem, Who } from "@/components/Dash";
import { getProducts } from "@/lib/data";
import { money, cap } from "@/lib/format";

export const metadata = { title: "Panel del vendedor — Tianguis Digital MX" };

const items: NavItem[] = [
  { k: "inicio", e: "📊", n: "Resumen" },
  { k: "p", e: "📦", n: "Mis productos" },
  { k: "m", e: "💬", n: "Mensajes" },
  { k: "e", e: "📈", n: "Estadísticas" },
  { k: "pl", e: "⭐", n: "Mi plan" },
  { k: "r", e: "🏅", n: "Reputación" },
];
const who: Who = {
  i: "L",
  n: "El Baúl de Lupita",
  r: "Plan Premium",
  c: "#0a7d4f",
};

export const dynamic = "force-dynamic";

export default async function VendedorPage() {
  const rows = (await getProducts()).slice(0, 5);
  const bars = [40, 65, 55, 90, 70, 85, 100];
  const labels = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <div className="page">
      <div className="wrap">
        <div className="pagehead">
          <div>
            <div className="crumbs">
              <Link href="/">Inicio</Link> / Panel del vendedor
            </div>
            <h2 className="sec-title" style={{ marginTop: 6 }}>
              Hola, Lupita 👋
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
              <Kpi l="Visualizaciones (7d)" v="3,420" d="12%" />
              <Kpi l="Clics a productos" v="612" d="8%" />
              <Kpi l="Consultas (chat)" v="48" d="5%" />
              <Kpi l="Ventas reportadas" v="27" d="15%" />
            </div>

            <div className="panel">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>Visualizaciones esta semana</h3>
                <span className="muted" style={{ fontSize: 13 }}>
                  Próx. mercado: Sáb 27/6
                </span>
              </div>
              <div className="bars">
                {bars.map((h, i) => (
                  <div className="bar" key={i}>
                    <i style={{ height: `${h}%` }} />
                    <span>{labels[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>Mis productos</h3>
                <button className="btn btn-ghost btn-sm">
                  Renovar publicaciones
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Vistas</th>
                    <th>Clics</th>
                    <th>Estado</th>
                    <th className="r">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <b>{p.n}</b>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {cap(p.estado)}
                        </div>
                      </td>
                      <td>{money(p.price)}</td>
                      <td>{p.views}</td>
                      <td>{Math.round(p.views * 0.18)}</td>
                      <td>
                        <span className="tag-s t-act">Activo</span>
                      </td>
                      <td className="r">
                        <button className="btn btn-outline btn-sm">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="panel"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>Plan Premium activo</h3>
                <p className="muted" style={{ fontSize: 14 }}>
                  $100/semana · renueva el 30/6 · portada en home incluida
                </p>
              </div>
              <Link className="btn btn-outline btn-sm" href="/#planes">
                Cambiar plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
