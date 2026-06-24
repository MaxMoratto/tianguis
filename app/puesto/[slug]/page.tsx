import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import {
  getStallBySlug,
  getProductsByStall,
  getProducts,
  PLAN_COLOR,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PuestoPage({
  params,
}: {
  params: { slug: string };
}) {
  const s = await getStallBySlug(params.slug);
  if (!s) notFound();

  const own = await getProductsByStall(s.n);
  const prods = own.length ? own : (await getProducts()).slice(0, 4);

  return (
    <div className="page">
      <div className="wrap">
        <div className="crumbs">
          <Link href="/">Inicio</Link> / <Link href="/mercado">Mercado</Link> /{" "}
          {s.n}
        </div>

        <div className="stall" style={{ marginTop: 16, maxWidth: "100%" }}>
          <div className="cover" style={{ background: s.bg, height: 130 }}>
            <span className="plan" style={{ color: PLAN_COLOR[s.plan] }}>
              {s.plan}
            </span>
          </div>
          <div className="b">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div>
                <div className="nm" style={{ fontSize: 22 }}>
                  {s.n} 🔒
                </div>
                <div className="tag">{s.tag}</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary btn-sm">+ Seguir puesto</button>
                <button className="btn btn-outline btn-sm">💬 Mensaje</button>
              </div>
            </div>
            <div className="st" style={{ fontSize: 14, marginTop: 14 }}>
              <span>
                ★ <b>{s.rating}</b> reputación
              </span>
              <span>
                <b>{s.prod}</b> productos
              </span>
              <span>
                <b>{s.ventas}</b> ventas reportadas
              </span>
              <span>📍 a 1.2 km</span>
            </div>
          </div>
        </div>

        <h2 className="sec-title" style={{ margin: "30px 0 18px" }}>
          Productos del puesto
        </h2>
        <div className="grid">
          {prods.map((p) => (
            <ProductCard p={p} key={p.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
