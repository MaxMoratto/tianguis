"use client";

import { useEffect, useState } from "react";
import { isMarketOpen, nextChange, fmtTarget } from "@/lib/market";

/** Aviso de mercado abierto/cerrado, resuelto en vivo en el cliente. */
export default function MarketBanner() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const open = isMarketOpen(now);
  const nx = nextChange(now);

  if (open) {
    return (
      <div className="closedbar openbar">
        🟢{" "}
        <span>
          Mercado <b>ABIERTO</b> — puedes comprar y apartar hasta el cierre (
          {fmtTarget(nx.target)}).
        </span>
      </div>
    );
  }

  return (
    <div className="closedbar">
      🔴{" "}
      <span>
        Mercado <b>CERRADO</b> — puedes navegar y guardar favoritos. Las compras
        se habilitan en la <b>{nx.label.toLowerCase()}</b>: {fmtTarget(nx.target)}.
      </span>
    </div>
  );
}
