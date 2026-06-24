"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

/** Botón "Editar" que solo ve el dueño del producto. */
export default function BotonEditarProducto({
  productoId,
  ownerId,
}: {
  productoId: number;
  ownerId?: string;
}) {
  const { user } = useAuth();
  if (!user || !ownerId || user.uid !== ownerId) return null;
  return (
    <Link
      className="btn btn-outline btn-sm"
      href={`/panel/vendedor/producto/${productoId}/editar`}
      style={{ marginTop: 8, alignSelf: "flex-start" }}
    >
      ✏️ Editar producto
    </Link>
  );
}
