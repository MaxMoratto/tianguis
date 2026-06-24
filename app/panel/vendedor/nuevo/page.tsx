"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db, firebaseEnabled } from "@/lib/firebase";
import { subirFotoProducto } from "@/lib/storage";
import { useAuth } from "@/components/AuthProvider";
import { CATS } from "@/lib/data";
import type { Estado, Product } from "@/lib/types";

const BGS = ["#fff3e0", "#eaf0fb", "#e8f5ee", "#fbecea", "#f3e9fb", "#eef1ef"];

export default function NuevoProductoPage() {
  const router = useRouter();
  const { user, loading, enabled } = useAuth();

  const [n, setN] = useState("");
  const [cat, setCat] = useState(CATS[0].id);
  const [price, setPrice] = useState("");
  const [estado, setEstado] = useState<Estado>("usado");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!enabled || !db || !user) {
      setError("Necesitas iniciar sesión y tener Firebase configurado.");
      return;
    }
    setGuardando(true);
    try {
      let img: string | undefined;
      if (file) img = await subirFotoProducto(user.uid, file);

      const id = Date.now();
      const producto: Product = {
        id,
        n,
        cat,
        e: CATS.find((c) => c.id === cat)?.e || "📦",
        price: Number(price),
        estado,
        stall: user.displayName || "Mi puesto",
        rating: 5,
        bg: BGS[Math.floor(Math.random() * BGS.length)],
        km: 1,
        views: 0,
        ownerId: user.uid,
        ...(img ? { img } : {}),
      };

      await setDoc(doc(db, "products", String(id)), producto);
      router.push(`/producto/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="page">
      <div className="wrap" style={{ maxWidth: 560 }}>
        <div className="crumbs">
          <Link href="/">Inicio</Link> /{" "}
          <Link href="/panel/vendedor">Panel del vendedor</Link> / Nuevo producto
        </div>
        <h2 className="sec-title" style={{ margin: "8px 0 0" }}>
          Subir producto
        </h2>

        {!loading && !user && (
          <div className="closedbar" style={{ marginTop: 16 }}>
            🔒{" "}
            <span>
              Necesitas <Link href="/entrar">iniciar sesión</Link> para publicar.
            </span>
          </div>
        )}
        {!enabled && (
          <div className="closedbar" style={{ marginTop: 12 }}>
            ⚙️ <span>Configura Firebase para guardar productos reales.</span>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="panel"
          style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}
        >
          <label style={{ fontSize: 14, fontWeight: 600 }}>Nombre del producto</label>
          <input
            className="searchline"
            style={{ padding: "12px 16px" }}
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="Ej. Bicicleta de montaña rodada 26"
            required
          />

          <label style={{ fontSize: 14, fontWeight: 600 }}>Categoría</label>
          <select
            className="select"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            {CATS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.e} {c.n}
              </option>
            ))}
          </select>

          <label style={{ fontSize: 14, fontWeight: 600 }}>Precio (MXN)</label>
          <input
            className="searchline"
            style={{ padding: "12px 16px" }}
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            required
          />

          <label style={{ fontSize: 14, fontWeight: 600 }}>Estado</label>
          <select
            className="select"
            value={estado}
            onChange={(e) => setEstado(e.target.value as Estado)}
          >
            <option value="nuevo">Nuevo</option>
            <option value="usado">Usado</option>
            <option value="restaurado">Restaurado</option>
          </select>

          <label style={{ fontSize: 14, fontWeight: 600 }}>Foto (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {error && <p style={{ color: "var(--rojo)", fontSize: 13.5 }}>{error}</p>}

          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={guardando || !enabled || !user}
          >
            {guardando ? "Publicando…" : "Publicar producto"}
          </button>
        </form>
      </div>
    </div>
  );
}
