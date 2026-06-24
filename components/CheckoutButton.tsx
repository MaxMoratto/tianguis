"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

/**
 * Botón que inicia el pago de la renta del puesto vía Stripe Checkout.
 * Requiere sesión iniciada (para asociar el puesto al vendedor).
 */
export default function CheckoutButton({
  plan,
  label,
  className,
}: {
  plan: string;
  label: string;
  className?: string;
}) {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setError("");
    if (!user) {
      window.location.href = "/entrar";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          uid: user.uid,
          email: user.email,
          stallSlug: `puesto-${user.uid.slice(0, 8)}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo iniciar el pago");
      if (data.url) window.location.href = data.url;
      else throw new Error("Respuesta sin URL de pago");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className={className || "btn btn-primary btn-block"}
        onClick={go}
        disabled={loading || authLoading}
      >
        {loading ? "Redirigiendo a pago…" : label}
      </button>
      {error && (
        <p style={{ color: "var(--rojo)", fontSize: 13, marginTop: 6 }}>{error}</p>
      )}
    </>
  );
}
