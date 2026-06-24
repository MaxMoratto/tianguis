import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import MarketBanner from "@/components/MarketBanner";
import { getCategories, getProducts } from "@/lib/data";

export const metadata = {
  title: "Mercado abierto — Tianguis Digital MX",
};

export const dynamic = "force-dynamic";

export default async function MercadoPage({
  searchParams,
}: {
  searchParams: { cat?: string; q?: string };
}) {
  const cat = searchParams.cat || "todos";
  const q = searchParams.q || "";
  const list = await getProducts({ cat, q });

  const chips = [
    { id: "todos", n: "Todos" },
    ...getCategories().map((c) => ({ id: c.id, n: c.n })),
  ];

  const href = (id: string) =>
    `/mercado?cat=${id}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div className="page">
      <div className="wrap">
        <div className="crumbs">
          <Link href="/">Inicio</Link> / Mercado
        </div>
        <div className="pagehead" style={{ marginTop: 8 }}>
          <div>
            <h2 className="sec-title">Mercado abierto</h2>
            <div className="sec-sub">
              {list.length} resultados · vendedores locales
            </div>
          </div>
        </div>

        <div className="mt16">
          <MarketBanner />
        </div>

        <form className="toolbar" action="/mercado">
          <input type="hidden" name="cat" value={cat} />
          <div className="searchline">
            <span>🔍</span>
            <input name="q" defaultValue={q} placeholder="Buscar en el mercado…" />
          </div>
          <select className="select" name="radio" defaultValue="10">
            <option value="1">Radio: 1 km</option>
            <option value="5">Radio: 5 km</option>
            <option value="10">Radio: 10 km</option>
            <option value="20">Radio: 20 km</option>
            <option value="50">Radio: 50 km</option>
          </select>
          <select className="select" name="orden" defaultValue="rel">
            <option value="rel">Ordenar: Relevancia</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
            <option value="top">Mejor calificados</option>
            <option value="near">Más cercanos</option>
          </select>
          <Link className="chip" href="/mapa">
            🗺️ Mapa
          </Link>
        </form>

        <div className="toolbar">
          {chips.map((c) => (
            <Link
              key={c.id}
              className={`chip ${c.id === cat ? "active" : ""}`}
              href={href(c.id)}
            >
              {c.n}
            </Link>
          ))}
        </div>

        <div className="grid mt24">
          {list.length ? (
            list.map((p) => <ProductCard p={p} key={p.id} />)
          ) : (
            <p
              className="muted"
              style={{ gridColumn: "1/-1", padding: "40px 0", textAlign: "center" }}
            >
              Sin resultados. Prueba otra categoría o término.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
