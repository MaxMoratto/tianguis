import Link from "next/link";
import type { Product } from "@/lib/types";
import { money, cap, estClass } from "@/lib/format";

/** Tarjeta de producto reutilizable en home, mercado y puesto. */
export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link className="card" href={`/producto/${p.id}`}>
      <div
        className="ph"
        style={{
          background: p.img ? `#000 center/cover url(${p.img})` : p.bg,
        }}
      >
        <span className="badge">{cap(p.estado)}</span>
        <span className="fav" title="Favorito">
          🤍
        </span>
        {!p.img && p.e}
      </div>
      <div className="body">
        <div className="nm">{p.n}</div>
        <div className="meta">
          {p.stall} · a {p.km} km
        </div>
        <div className="price">{money(p.price)}</div>
        <div className="row">
          <span className={`estado ${estClass(p.estado)}`}>{cap(p.estado)}</span>
          <span className="stars">★ {p.rating}</span>
        </div>
      </div>
    </Link>
  );
}
