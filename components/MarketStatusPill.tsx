"use client";

import { useEffect, useState } from "react";
import { isMarketOpen } from "@/lib/market";

/** Píldora del header que indica si el mercado está abierto, en vivo. */
export default function MarketStatusPill() {
  // Evita desajuste de hidratación: arranca neutro y resuelve en el cliente.
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpen(isMarketOpen());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (open === null) {
    return (
      <span className="statuspill closed">
        <span className="dot" />
        <span className="txt">···</span>
      </span>
    );
  }

  return (
    <span className={`statuspill ${open ? "open" : "closed"}`}>
      <span className="dot" />
      <span className="txt">{open ? "Abierto ahora" : "Cerrado"}</span>
    </span>
  );
}
