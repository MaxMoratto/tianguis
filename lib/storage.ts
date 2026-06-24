"use client";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, firebaseEnabled } from "./firebase";

/**
 * Sube una foto de producto a Firebase Storage y devuelve su URL pública.
 * Las fotos se guardan en products/{uid}/{archivo}.
 */
export async function subirFotoProducto(
  uid: string,
  file: File
): Promise<string> {
  if (!firebaseEnabled || !storage) {
    throw new Error("Firebase Storage no está configurado.");
  }
  const nombre = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const r = ref(storage, `products/${uid}/${nombre}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}
