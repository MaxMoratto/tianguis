import Link from "next/link";
import { DashSide, Kpi, NavItem, Who } from "@/components/Dash";

export const metadata = { title: "Centro de control — Tianguis Digital MX" };

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
          <DashSide active="mod" items={items} who={who} />
          <div>
            <div className="kpis">
              <Kpi l="Puestos activos" v="1,240" d="6%" />
              <Kpi l="Usuarios totales" v="42,800" d="9%" />
              <Kpi l="Ingresos semana" v="$38,600" d="11%" />
              <Kpi l="Reportes abiertos" v="7" d="2" up={false} />
            </div>

            <div className="panel">
              <h3>🛡️ Cola de moderación (IA)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Elemento</th>
                    <th>Motivo detectado</th>
                    <th>Riesgo</th>
                    <th className="r">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Publicación #8842</td>
                    <td>Posible imagen inapropiada</td>
                    <td>
                      <span className="tag-s t-rev">Alto</span>
                    </td>
                    <td className="r">
                      <button className="btn btn-outline btn-sm">Revisar</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Usuario @ventas_xx</td>
                    <td>Cuenta duplicada sospechosa</td>
                    <td>
                      <span className="tag-s t-pend">Medio</span>
                    </td>
                    <td className="r">
                      <button className="btn btn-outline btn-sm">Revisar</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Publicación #8810</td>
                    <td>Categoría mal asignada (IA sugiere &quot;Electrónica&quot;)</td>
                    <td>
                      <span className="tag-s t-act">Bajo</span>
                    </td>
                    <td className="r">
                      <button className="btn btn-outline btn-sm">Reasignar</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Usuario @rapidventa</td>
                    <td>Comportamiento sospechoso (spam de chat)</td>
                    <td>
                      <span className="tag-s t-rev">Alto</span>
                    </td>
                    <td className="r">
                      <button className="btn btn-dark btn-sm">Bloquear</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="panel">
              <h3>💰 Ingresos por plan (esta semana)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Puestos</th>
                    <th>Precio</th>
                    <th className="r">Ingreso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span
                        className="tag-s"
                        style={{ background: "#eef1ef", color: "#4b5450" }}
                      >
                        Básico
                      </span>
                    </td>
                    <td>720</td>
                    <td>$10</td>
                    <td className="r">$7,200</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="tag-s t-pend">Destacado</span>
                    </td>
                    <td>410</td>
                    <td>$30</td>
                    <td className="r">$12,300</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="tag-s t-act">Premium</span>
                    </td>
                    <td>110</td>
                    <td>$100</td>
                    <td className="r">$11,000</td>
                  </tr>
                  <tr style={{ fontWeight: 800 }}>
                    <td>Total</td>
                    <td>1,240</td>
                    <td>—</td>
                    <td className="r">$30,500</td>
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
