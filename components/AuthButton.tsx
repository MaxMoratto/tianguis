"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { salir } from "@/lib/auth";

/** Botón de sesión en el header: muestra "Entrar" o el usuario + salir. */
export default function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <span className="btn btn-ghost btn-sm" style={{ opacity: 0.5 }}>
        ···
      </span>
    );
  }

  if (user) {
    const inicial = (user.displayName || user.email || "?")[0].toUpperCase();
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link
          href="/panel/comprador"
          className="avatar"
          style={{ background: "#0a7d4f", width: 34, height: 34, fontSize: 14 }}
          title={user.displayName || user.email || "Mi cuenta"}
        >
          {inicial}
        </Link>
        <button className="btn btn-ghost btn-sm" onClick={() => salir()}>
          Salir
        </button>
      </span>
    );
  }

  return (
    <Link className="btn btn-ghost btn-sm" href="/entrar">
      Entrar
    </Link>
  );
}
