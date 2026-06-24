import Link from "next/link";
import { notFound } from "next/navigation";
import BuyBox from "@/components/BuyBox";
import MarketBanner from "@/components/MarketBanner";
import Galeria from "@/components/Galeria";
import BotonEditarProducto from "@/components/BotonEditarProducto";
import { getProductById, getStallByName } from "@/lib/data";
import { money, cap, estClass } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductoPage({
  params,
}: {
  params: { id: string };
}) {
  const p = await getProductById(Number(params.id));
  if (!p) notFound();

  const stall = await getStallByName(p.stall);
  const fotos = p.imgs?.length ? p.imgs : p.img ? [p.img] : [];

  return (
    <div className="page">
      <div className="wrap">
        <div className="crumbs">
          <Link href="/">Inicio</Link> / <Link href="/mercado">Mercado</Link> /{" "}
          {p.n}
        </div>

        <div className="mt16">
          <MarketBanner />
        </div>

        <div className="detail mt24">
          <Galeria imgs={fotos} emoji={p.e} bg={p.bg} />

          <div className="dp">
            <span className={`estado ${estClass(p.estado)}`}>
              {cap(p.estado)}
            </span>
            <h1>{p.n}</h1>
            <div className="muted">
              👁️ {p.views} visualizaciones · a {p.km} km de ti
            </div>
            <BotonEditarProducto productoId={p.id} ownerId={p.ownerId} />
            <div className="price">{money(p.price)}</div>

            <BuyBox price={p.price} />
            <button className="btn btn-ghost btn-block mt8">
              💬 Mensaje al vendedor
            </button>

            <div className="selleline">
              <div className="avatar" style={{ background: "#0a7d4f" }}>
                {p.stall[0]}
              </div>
              <div style={{ flex: 1 }}>
                <b>{p.stall}</b>
                <div className="muted" style={{ fontSize: 13 }}>
                  ★ {p.rating} · Vendedor verificado 🔒
                </div>
              </div>
              {stall && (
                <Link
                  className="btn btn-outline btn-sm"
                  href={`/puesto/${stall.slug}`}
                >
                  Ver puesto
                </Link>
              )}
            </div>

            <h3 style={{ marginTop: 8, fontSize: 16 }}>
              Reputación del vendedor
            </h3>
            <div className="ratingbox">
              <div className="pill-rate">
                Puntualidad <b>5.0</b>
              </div>
              <div className="pill-rate">
                Honestidad <b>5.0</b>
              </div>
              <div className="pill-rate">
                Comunicación <b>5.0</b>
              </div>
              <div className="pill-rate">
                Calidad <b>5.0</b>
              </div>
            </div>
            <p className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>
              Vendedor nuevo · sin calificaciones todavía. Empieza con 5.0.
            </p>

            <div className="panel" style={{ marginTop: 8 }}>
              <h3>Entrega segura</h3>
              <p className="muted" style={{ fontSize: 14 }}>
                Recoge en un centro autorizado (papelería o tienda afiliada) con
                registro de fecha, hora y evidencia fotográfica. O coordina
                entrega en persona por chat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
