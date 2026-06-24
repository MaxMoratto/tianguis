import Link from "next/link";

export const metadata = { title: "Pago confirmado — Tianguis Digital MX" };

export default function PagoExitoPage() {
  return (
    <div className="page">
      <div className="wrap" style={{ maxWidth: 520 }}>
        <div className="panel center" style={{ padding: 40, marginTop: 24 }}>
          <div style={{ fontSize: 48 }}>🎉</div>
          <h2 className="sec-title" style={{ marginTop: 8 }}>
            ¡Tu puesto está activo!
          </h2>
          <p className="muted" style={{ marginTop: 8 }}>
            Recibimos tu pago. Ya puedes subir productos y aparecer en el próximo
            día de mercado.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginTop: 22,
              flexWrap: "wrap",
            }}
          >
            <Link className="btn btn-primary" href="/panel/vendedor/nuevo">
              Subir mi primer producto
            </Link>
            <Link className="btn btn-outline" href="/panel/vendedor">
              Ir a mi panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
