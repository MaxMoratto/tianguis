import Link from "next/link";

export const metadata = {
  title: "Mapa de actividad — Tianguis Digital MX",
};

const PINS: [string, string, string][] = [
  ["28%", "30%", "El Baúl de Lupita"],
  ["62%", "45%", "TecnoTianguis"],
  ["45%", "66%", "Arte Oaxaca"],
  ["74%", "24%", "Don Herramientas"],
  ["38%", "50%", "Vintage MX"],
];

export default function MapaPage() {
  return (
    <div className="page">
      <div className="wrap">
        <div className="crumbs">
          <Link href="/">Inicio</Link> / <Link href="/mercado">Mercado</Link> /
          Mapa
        </div>
        <h2 className="sec-title" style={{ margin: "6px 0 18px" }}>
          Mapa de actividad
        </h2>
        <div className="mapbox">
          <div className="mapgrid" />
          {PINS.map(([top, left, name]) => (
            <div className="pin" style={{ top, left }} key={name}>
              <span>📍 {name}</span>
            </div>
          ))}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              background: "#fff",
              padding: "14px 20px",
              borderRadius: 14,
              boxShadow: "var(--sombra)",
              textAlign: "center",
            }}
          >
            <b>Mapa interactivo</b>
            <div className="muted" style={{ fontSize: 13 }}>
              Geolocalización + radio de búsqueda (1–50 km).
              <br />
              Integración con Mapbox/Google Maps en producción.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
