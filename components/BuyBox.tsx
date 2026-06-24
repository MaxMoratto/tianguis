"use client";

import { useEffect, useState } from "react";
import { isMarketOpen } from "@/lib/market";
import { money } from "@/lib/format";

/**
 * Botones de compra. Solo se habilita "Comprar" cuando el mercado está abierto;
 * fuera de horario el usuario puede navegar y guardar favoritos.
 */
export default function BuyBox({ price }: { price: number }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpen(isMarketOpen());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (open) {
    return (
      <>
        <button
          className="btn btn-primary btn-block"
          style={{ fontSize: 16, padding: 14 }}
        >
          Comprar ahora · {money(price)}
        </button>
        <button className="btn btn-outline btn-block mt8">
          Apartar producto
        </button>
      </>
    );
  }

  return (
    <>
      <button
        className="btn btn-block"
        disabled
        style={{ fontSize: 16, padding: 14 }}
      >
        🔒 Compra disponible en horario de mercado
      </button>
      <button className="btn btn-outline btn-block mt8">
        🤍 Guardar en favoritos
      </button>
    </>
  );
}
