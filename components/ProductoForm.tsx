"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, firebaseEnabled } from "@/lib/firebase";
import { subirFotosProducto } from "@/lib/storage";
import { useAuth } from "@/components/AuthProvider";
import { CATS } from "@/lib/data";
import type { Estado, Product } from "@/lib/types";

const BGS = ["#fff3e0", "#eaf0fb", "#e8f5ee", "#fbecea", "#f3e9fb", "#eef1ef"];

/**
 * Formulario para CREAR o EDITAR un producto.
 * - Sin productoId  → crea uno nuevo.
 * - Con productoId  → carga ese producto y lo edita (solo su dueño).
 * Soporta varias fotos: las nuevas se agregan a las que ya tenía.
 */
export default function ProductoForm({ productoId }: { productoId?: number }) {
  const router = useRouter();
  const { user, loading, enabled } = useAuth();
  const editando = productoId != null;

  const [n, setN] = useState("");
  const [cat, setCat] = useState(CATS[0].id);
  const [price, setPrice] = useState("");
  const [estado, setEstado] = useState<Estado>("usado");
  const [files, setFiles] = useState<File[]>([]);
  const [imgsActuales, setImgsActuales] = useState<string[]>([]);
  const [cargandoProd, setCargandoProd] = useState<boolean>(editando);
  const [noAutorizado, setNoAutorizado] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Modo edición: cargar el producto y verificar que sea del usuario.
  useEffect(() => {
    async function cargar() {
      if (!editando || !firebaseEnabled || !db) {
        setCargandoProd(false);
        return;
      }
      const snap = await getDoc(doc(db, "products", String(productoId)));
      if (snap.exists()) {
        const p = snap.data() as Product;
        if (user && p.ownerId && p.ownerId !== user.uid) {
          setNoAutorizado(true);
        }
        setN(p.n);
        setCat(p.cat);
        setPrice(String(p.price));
        setEstado(p.estado);
        setImgsActuales(p.imgs?.length ? p.imgs : p.img ? [p.img] : []);
      }
      setCargandoProd(false);
    }
    if (!loading) cargar();
  }, [editando, productoId, user, loading]);

  function quitarFoto(i: number) {
    setImgsActuales((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!enabled || !db || !user) {
      setError("Necesitas iniciar sesión y tener Firebase configurado.");
      return;
    }
    setGuardando(true);
    try {
      let imgs = [...imgsActuales];
      if (files.length) {
        const nuevas = await subirFotosProducto(user.uid, files);
        imgs = [...imgs, ...nuevas];
      }

      const id = editando ? (productoId as number) : Date.now();
      const emoji = CATS.find((c) => c.id === cat)?.e || "📦";
      const fotos = { img: imgs[0] ?? "", imgs };

      if (editando) {
        // Solo actualiza los campos editables (conserva views, bg, rating…).
        await setDoc(
          doc(db, "products", String(id)),
          { n, cat, e: emoji, price: Number(price), estado, ...fotos },
          { merge: true }
        );
      } else {
        const nuevo: Product = {
          id,
          n,
          cat,
          e: emoji,
          price: Number(price),
          estado,
          stall: user.displayName || "Mi puesto",
          rating: 5,
          bg: BGS[Math.floor(Math.random() * BGS.length)],
          km: 1,
          views: 0,
          ownerId: user.uid,
          ...fotos,
        };
        await setDoc(doc(db, "products", String(id)), nuevo);
      }
      router.push(`/producto/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  }

  if (noAutorizado) {
    return (
      <div className="closedbar" style={{ marginTop: 16 }}>
        🔒 <span>Este producto no es tuyo, no puedes editarlo.</span>
      </div>
    );
  }

  return (
    <>
      {!loading && !user && (
        <div className="closedbar" style={{ marginTop: 16 }}>
          🔒{" "}
          <span>
            Necesitas <Link href="/entrar">iniciar sesión</Link> para{" "}
            {editando ? "editar" : "publicar"}.
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
        <select className="select" value={cat} onChange={(e) => setCat(e.target.value)}>
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

        {imgsActuales.length > 0 && (
          <>
            <label style={{ fontSize: 14, fontWeight: 600 }}>Fotos actuales</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {imgsActuales.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Foto ${i + 1}`}
                    style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10 }}
                  />
                  <button
                    type="button"
                    onClick={() => quitarFoto(i)}
                    title="Quitar foto"
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: "none",
                      background: "var(--rojo)",
                      color: "#fff",
                      cursor: "pointer",
                      lineHeight: "20px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <label style={{ fontSize: 14, fontWeight: 600 }}>
          {imgsActuales.length ? "Agregar más fotos" : "Fotos"} (puedes elegir varias)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
        {files.length > 0 && (
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            {files.length} foto{files.length === 1 ? "" : "s"} nueva
            {files.length === 1 ? "" : "s"} por subir.
          </p>
        )}

        {error && <p style={{ color: "var(--rojo)", fontSize: 13.5 }}>{error}</p>}

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={guardando || cargandoProd || !enabled || !user}
        >
          {guardando
            ? "Guardando…"
            : cargandoProd
            ? "Cargando…"
            : editando
            ? "Guardar cambios"
            : "Publicar producto"}
        </button>
      </form>
    </>
  );
}
