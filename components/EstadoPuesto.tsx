"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db, firebaseEnabled } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";
import { accesoVigente, diasRestantes } from "@/lib/pases";
import type { Stall } from "@/lib/types";

/**
 * Tarjeta del panel del vendedor: muestra el estado real de su puesto.
 * - Sin puesto         → invitación a activar pase o rentar.
 * - Pase vigente       → días restantes del mes gratis.
 * - Pase por vencer    → aviso + CTA a /rentar.
 * - Pase vencido       → puesto pausado + CTA a /rentar.
 * - Stripe activo      → plan de paga, sin vencimiento.
 */
export default function EstadoPuesto() {
  const { user, loading } = useAuth();
  const [stall, setStall] = useState<Stall | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    async function cargar() {
      if (!firebaseEnabled || !db || !user) {
        setCargando(false);
        return;
      }
      try {
        const q = query(
          collection(db, "stalls"),
          where("ownerId", "==", user.uid),
          limit(1)
        );
        const snap = await getDocs(q);
        if (activo) setStall(snap.empty ? null : (snap.docs[0].data() as Stall));
      } finally {
        if (activo) setCargando(false);
      }
    }
    if (!loading) cargar();
    return () => {
      activo = false;
    };
  }, [user, loading]);

  // ---- Estados de carga / sesión ----
  if (loading || cargando) {
    return (
      <div className="panel">
        <p className="muted" style={{ fontSize: 14, margin: 0 }}>Cargando tu puesto…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="panel acc-between">
        <div>
          <h3 style={{ margin: 0 }}>Inicia sesión</h3>
          <p className="muted" style={{ fontSize: 14 }}>
            Entra para ver el estado de tu puesto.
          </p>
        </div>
        <Link className="btn btn-primary btn-sm" href="/entrar">Iniciar sesión</Link>
      </div>
    );
  }

  // ---- Sin puesto todavía ----
  if (!stall) {
    return (
      <div className="panel acc-between">
        <div>
          <h3 style={{ margin: 0 }}>Aún no tienes puesto</h3>
          <p className="muted" style={{ fontSize: 14 }}>
            ¿Tienes un pase de regalo? Actívalo gratis, sin tarjeta.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="btn btn-primary btn-sm" href="/pase">🎟️ Usar pase</Link>
          <Link className="btn btn-outline btn-sm" href="/rentar">Rentar puesto</Link>
        </div>
      </div>
    );
  }

  const porPase = stall.origenAcceso === "pase";
  const vigente = accesoVigente(stall);
  const dias = diasRestantes(stall);

  // ---- Pase vencido ----
  if (porPase && !vigente) {
    return (
      <div className="panel acc-between" style={{ borderLeft: "4px solid var(--rojo)" }}>
        <div>
          <h3 style={{ margin: 0 }}>Tu mes gratis terminó</h3>
          <p className="muted" style={{ fontSize: 14 }}>
            Tu puesto <b>{stall.n}</b> está en pausa. Renta un plan para volver a
            aparecer en el mercado.
          </p>
        </div>
        <Link className="btn btn-primary btn-sm" href="/rentar">Reactivar puesto</Link>
      </div>
    );
  }

  // ---- Pase vigente ----
  if (porPase && vigente) {
    const porVencer = dias <= 5;
    return (
      <div
        className="panel acc-between"
        style={{ borderLeft: `4px solid ${porVencer ? "#f4b740" : "var(--verde-700)"}` }}
      >
        <div>
          <h3 style={{ margin: 0 }}>
            {stall.n} · <span style={{ color: "var(--verde-700)" }}>Plan gratis activo</span>
          </h3>
          <p className="muted" style={{ fontSize: 14 }}>
            Te {dias === 1 ? "queda" : "quedan"} <b>{dias}</b>{" "}
            {dias === 1 ? "día" : "días"} de tu mes gratis.
            {porVencer && " Renta un plan para no perder tu lugar."}
          </p>
        </div>
        <Link
          className={`btn btn-sm ${porVencer ? "btn-primary" : "btn-outline"}`}
          href="/rentar"
        >
          {porVencer ? "Seguir rentando" : "Ver planes"}
        </Link>
      </div>
    );
  }

  // ---- Stripe / plan de paga ----
  return (
    <div className="panel acc-between" style={{ borderLeft: "4px solid var(--verde-700)" }}>
      <div>
        <h3 style={{ margin: 0 }}>{stall.n} · Plan {stall.plan}</h3>
        <p className="muted" style={{ fontSize: 14 }}>Tu puesto está activo.</p>
      </div>
      <Link className="btn btn-outline btn-sm" href="/rentar">Cambiar plan</Link>
    </div>
  );
}
