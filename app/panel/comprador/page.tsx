import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { DashSide, Kpi, NavItem, Who } from "@/components/Dash";
import { getProducts } from "@/lib/data";

export const metadata = { title: "Mi cuenta — Tianguis Digital MX" };

const items: NavItem[] = [
  { k: "fav", e: "🤍", n: "Favoritos" },
  { k: "h", e: "🕘", n: "Historial" },
  { k: "s", e: "👥", n: "Vendedores seguidos" },
  { k: "m", e: "💬", n: "Mensajes" },
  { k: "c", e: "⚙️", n: "Mi cuenta" },
];
const who: Who = {
  i: "C",
  n: "Carlos M.",
  r: "Comprador verificado",
  c: "#e0654b",
};

export const dynamic = "force-dynamic";

export default async function CompradorPage() {
  const favs = (await getProducts()).slice(1, 5);

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
              <Kpi l="Favoritos" v="14" d="3 nuevos" />
              <Kpi l="Vendedores seguidos" v="6" d="2" />
              <Kpi l="Compras realizadas" v="9" d="1" />
              <Kpi l="Mensajes activos" v="3" />
            </div>

            <div className="panel">
              <h3>Tus favoritos</h3>
              <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                {favs.map((p) => (
                  <ProductCard p={p} key={p.id} />
                ))}
              </div>
            </div>

            <div className="panel">
              <h3>Historial reciente</h3>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Vendedor</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th className="r">Reputación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>iPhone 12 restaurado</td>
                    <td>TecnoTianguis</td>
                    <td>14/6/2026</td>
                    <td>
                      <span className="tag-s t-act">Entregado</span>
                    </td>
                    <td className="r">★ Calificar</td>
                  </tr>
                  <tr>
                    <td>Cartas Pokémon</td>
                    <td>Coleccio-MX</td>
                    <td>7/6/2026</td>
                    <td>
                      <span className="tag-s t-act">Entregado</span>
                    </td>
                    <td className="r">★★★★★</td>
                  </tr>
                  <tr>
                    <td>Alebrije tallado</td>
                    <td>Arte Oaxaca</td>
                    <td>31/5/2026</td>
                    <td>
                      <span className="tag-s t-pend">En entrega</span>
                    </td>
                    <td className="r">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
