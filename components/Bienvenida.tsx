"use client";

import { useEffect, useState } from "react";

/**
 * Pantalla de bienvenida/carga (estilo splash). Aparece al entrar por primera
 * vez en la sesión, muestra la marca mientras "carga", y se desvanece sola.
 * No vuelve a salir en navegaciones internas (se recuerda en sessionStorage).
 */
export default function Bienvenida() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("tianguis_bienvenida")) {
      setShow(false);
      return;
    }
    const t1 = setTimeout(() => setFade(true), 1500);
    const t2 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("tianguis_bienvenida", "1");
    }, 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!show) return null;

  return (
    <div className={`bienvenida ${fade ? "fade" : ""}`} aria-hidden="true">
      <div className="bv-mark">🛖</div>
      <div className="bv-nombre">
        Tianguis<span className="mx">·MX</span>
      </div>
      <div className="bv-tag">El mercado que abre por horas</div>
      <div className="bv-bar">
        <i />
      </div>
      <div className="bv-hola">Bienvenido 👋</div>
    </div>
  );
}
