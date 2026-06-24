"use client";

import { useEffect, useState } from "react";
import { isMarketOpen, nextChange, fmtTarget } from "@/lib/market";

const pad = (n: number) => String(n).padStart(2, "0");

/** Contador en vivo hacia la próxima apertura (o el cierre si está abierto). */
export default function Countdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="counter">
        <div className="label">Cargando estado del mercado…</div>
      </div>
    );
  }

  const open = isMarketOpen(now);
  const nx = nextChange(now);
  const diff = Math.max(0, nx.target.getTime() - now.getTime());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const units: [number, string][] = [
    [d, "días"],
    [h, "horas"],
    [m, "min"],
    [s, "seg"],
  ];

  return (
    <div className={`counter ${open ? "isopen" : ""}`}>
      <div className="label">
        {open ? "🟢 Mercado abierto ahora" : "🔴 Mercado cerrado"}
      </div>
      <div className="big">
        {nx.label}: {fmtTarget(nx.target)}
      </div>
      <div className="clock">
        {units.map(([n, t]) => (
          <div className="u" key={t}>
            <div className="n">{pad(n)}</div>
            <div className="t">{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
