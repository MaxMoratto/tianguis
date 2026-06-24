"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, firebaseEnabled } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

/**
 * Lista los productos del vendedor (por ownerId) con accesos a Ver y Editar,
 * para no tener que abrir cada producto. Va en el panel del vendedor.
 */
export default function MisProductos() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
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
          collection(db, "products"),
          where("ownerId", "==", user.uid)
        );
        const snap = await getDocs(q);
        if (activo) setItems(snap.docs.map((d) => d.data() as Product));
      } finally {
        if (activo) setCargando(false);
      }
    }
    if (!loading) cargar();
    return () => {
      activo = false;
    };
  }, [user, loading]);

  return (
    <div className="panel">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ margin: 0 }}>Mis productos</h3>
        <Link className="btn btn-primary btn-sm" href="/panel/vendedor/nuevo">
          + Subir producto
        </Link>
      </div>

      {loading || cargando ? (
        <p className="muted" style={{ fontSize: 14, marginTop: 12 }}>
          Cargando tus productos…
        </p>
      ) : !user ? (
        <p className="muted" style={{ fontSize: 14, marginTop: 12 }}>
          <Link href="/entrar">Inicia sesión</Link> para ver tus productos.
        </p>
      ) : items.length === 0 ? (
        <p className="muted" style={{ fontSize: 14, marginTop: 12 }}>
          Aún no tienes productos.{" "}
          <Link
            href="/panel/vendedor/nuevo"
            style={{ color: "var(--verde-700)", fontWeight: 700 }}
          >
            Sube tu primer producto
          </Link>{" "}
          para empezar a vender.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {items.map((p) => {
            const foto = p.imgs?.length ? p.imgs[0] : p.img;
            return (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 10,
                  border: "1px solid var(--gris-300)",
                  borderRadius: 12,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    background: foto
                      ? `#000 center/cover no-repeat url(${foto})`
                      : p.bg,
                  }}
                >
                  {!foto && p.e}
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontWeight: 700 }}>{p.n}</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {money(p.price)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link className="btn btn-outline btn-sm" href={`/producto/${p.id}`}>
                    Ver
                  </Link>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/panel/vendedor/producto/${p.id}/editar`}
                  >
                    ✏️ Editar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
