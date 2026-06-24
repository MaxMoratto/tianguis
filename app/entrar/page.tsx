"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registrar, entrar, entrarConGoogle } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";

export default function EntrarPage() {
  const router = useRouter();
  const { enabled, user } = useAuth();
  const [modo, setModo] = useState<"entrar" | "registro">("entrar");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      if (modo === "registro") await registrar(nombre, email, pass);
      else await entrar(email, pass);
      router.push("/panel/comprador");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setCargando(false);
    }
  }

  async function onGoogle() {
    setError("");
    try {
      await entrarConGoogle();
      router.push("/panel/comprador");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    }
  }

  return (
    <div className="page">
      <div className="wrap" style={{ maxWidth: 440 }}>
        <div className="crumbs">
          <Link href="/">Inicio</Link> / Entrar
        </div>

        <div className="panel" style={{ marginTop: 18, padding: 28 }}>
          <h2 className="sec-title" style={{ fontSize: 26 }}>
            {modo === "entrar" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
          </h2>
          <p className="muted" style={{ marginTop: 6, fontSize: 14.5 }}>
            {modo === "entrar"
              ? "Entra para seguir vendedores, guardar favoritos y abrir tu puesto."
              : "Regístrate gratis. Solo pagas si rentas un puesto."}
          </p>

          {!enabled && (
            <div className="closedbar" style={{ marginTop: 16 }}>
              ⚙️{" "}
              <span>
                El login se activa cuando configures Firebase (variables en
                .env.local / Vercel). Por ahora puedes explorar el sitio.
              </span>
            </div>
          )}

          {user && (
            <div className="closedbar openbar" style={{ marginTop: 16 }}>
              ✅ <span>Ya tienes sesión iniciada.</span>
            </div>
          )}

          <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}
          >
            {modo === "registro" && (
              <input
                className="searchline"
                style={{ padding: "12px 16px" }}
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            )}
            <input
              className="searchline"
              style={{ padding: "12px 16px" }}
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="searchline"
              style={{ padding: "12px 16px" }}
              type="password"
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />

            {error && (
              <p style={{ color: "var(--rojo)", fontSize: 13.5 }}>{error}</p>
            )}

            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={cargando || !enabled}
            >
              {cargando
                ? "Un momento…"
                : modo === "entrar"
                  ? "Entrar"
                  : "Crear cuenta"}
            </button>
          </form>

          <button
            className="btn btn-outline btn-block mt8"
            onClick={onGoogle}
            disabled={!enabled}
          >
            Continuar con Google
          </button>

          <p
            className="muted"
            style={{ marginTop: 18, fontSize: 14, textAlign: "center" }}
          >
            {modo === "entrar" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button
              onClick={() => setModo(modo === "entrar" ? "registro" : "entrar")}
              style={{
                color: "var(--verde-700)",
                fontWeight: 700,
                background: "none",
              }}
            >
              {modo === "entrar" ? "Regístrate" : "Entra"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
