import Link from "next/link";

export const metadata = { title: "Pago cancelado — Tianguis Digital MX" };

export default function PagoCanceladoPage() {
  return (
    <div className="page">
      <div className="wrap" style={{ maxWidth: 520 }}>
        <div className="panel center" style={{ padding: 40, marginTop: 24 }}>
          <div style={{ fontSize: 48 }}>🛑</div>
          <h2 className="sec-title" style={{ marginTop: 8 }}>
            Pago cancelado
          </h2>
          <p className="muted" style={{ marginTop: 8 }}>
            No se realizó ningún cargo. Puedes intentarlo de nuevo cuando quieras.
          </p>
          <div style={{ marginTop: 22 }}>
            <Link className="btn btn-primary" href="/rentar">
              Volver a los planes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
