"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { normalizarCodigo, DIAS_PASE } from "@/lib/pases";

/**
 * Formulario para canjear un pase de regalo: activa un puesto gratis 30 días,
 * sin tarjeta. Se usa tanto en /pase (código a mano) como en /pase/[codigo]
 * (link, con el código precargado).
 */
export default function CanjearPase({ codigoInicial = "" }: { codigoInicial?: string }) {
  const router = useRouter();
  const { user, loading, enabled } = useAuth();

  const [codigo, setCodigo] = useState(codigoInicial);
  const [nombre, setNombre] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [activando, setActivando] = useState(false);
  const [listo, setListo] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!enabled) {
      setError("Configura Firebase para activar pases reales.");
      return;
    }
    if (!user) {
      router.push("/entrar");
      return;
    }

    setActivando(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/pase/canjear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: normalizarCodigo(codigo),
          idToken,
          nombrePuesto: nombre,
          descripcion: desc,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo activar el pase");
      setListo(true);
      setTimeout(() => router.push("/panel/vendedor"), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setActivando(false);
    }
  }

  if (listo) {
    return (
      <div className="panel" style={{ textAlign: "center", padding: 28 }}>
        <div style={{ fontSize: 40 }}>🎉</div>
        <h3 style={{ margin: "8px 0" }}>¡Tu puesto está activo!</h3>
        <p className="muted" style={{ fontSize: 14.5 }}>
          Tienes {DIAS_PASE} días gratis, sin tarjeta. Te llevamos a tu panel…
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="panel"
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      {!loading && !user && (
        <div className="closedbar">
          🔒{" "}
          <span>
            <Link href="/entrar">Inicia sesión</Link> para activar tu pase (no
            te pediremos tarjeta).
          </span>
        </div>
      )}
      {!enabled && (
        <div className="closedbar">
          ⚙️ <span>Configura Firebase para activar pases reales.</span>
        </div>
      )}

      <label style={{ fontSize: 14, fontWeight: 600 }}>Código del pase</label>
      <input
        className="searchline"
        style={{ padding: "12px 16px", letterSpacing: 1, textTransform: "uppercase" }}
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="TIANGUIS-A1B2"
        required
      />

      <label style={{ fontSize: 14, fontWeight: 600 }}>Nombre de tu puesto</label>
      <input
        className="searchline"
        style={{ padding: "12px 16px" }}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej. El Baúl de Lupita"
        maxLength={40}
        required
      />

      <label style={{ fontSize: 14, fontWeight: 600 }}>¿Qué vendes? (corto)</label>
      <input
        className="searchline"
        style={{ padding: "12px 16px" }}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Ej. Vintage y curiosidades"
        maxLength={60}
      />

      {error && <p style={{ color: "var(--rojo)", fontSize: 13.5 }}>{error}</p>}

      <button
        className="btn btn-primary btn-block"
        type="submit"
        disabled={activando || loading}
      >
        {activando ? "Activando…" : `Activar mi mes gratis`}
      </button>

      <p className="muted" style={{ fontSize: 12.5, textAlign: "center", margin: 0 }}>
        Sin tarjeta. Al terminar tus {DIAS_PASE} días decides si quieres seguir
        rentando tu puesto.
      </p>
    </form>
  );
}
