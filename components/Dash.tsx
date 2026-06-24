import Link from "next/link";

export interface NavItem {
  k: string;
  e: string;
  n: string;
}

export interface Who {
  i: string; // inicial
  n: string; // nombre
  r: string; // rol
  c: string; // color avatar
}

/** Barra lateral compartida por los dashboards. */
export function DashSide({
  active,
  items,
  who,
}: {
  active: string;
  items: NavItem[];
  who: Who;
}) {
  return (
    <aside className="side">
      <div className="who">
        <div className="avatar" style={{ background: who.c }}>
          {who.i}
        </div>
        <div>
          <b style={{ fontSize: 14 }}>{who.n}</b>
          <div className="muted" style={{ fontSize: 12 }}>
            {who.r}
          </div>
        </div>
      </div>
      {items.map((it) => (
        <a className={it.k === active ? "active" : ""} key={it.k}>
          {it.e} {it.n}
        </a>
      ))}
      <Link href="/" style={{ marginTop: 8, color: "var(--gris-500)" }}>
        ↩ Volver al sitio
      </Link>
    </aside>
  );
}

/** Tarjeta de KPI. */
export function Kpi({
  l,
  v,
  d,
  up = true,
}: {
  l: string;
  v: string;
  d?: string;
  up?: boolean;
}) {
  return (
    <div className="kpi">
      <div className="l">{l}</div>
      <div className="v">{v}</div>
      {d ? (
        <div className={`d ${up ? "up" : "down"}`}>
          {up ? "▲" : "▼"} {d}
        </div>
      ) : (
        <div className="d muted">—</div>
      )}
    </div>
  );
}
