import {
  getApps,
  initializeApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firebase Admin SDK (solo servidor) — inicialización PEREZOSA y tolerante.
 *
 * Se inicializa solo cuando se llama getAdminDb() en tiempo de petición (no al
 * importar el módulo), para que un valor mal formado de la llave NUNCA rompa el
 * build. Limpia comillas envolventes y convierte los \n a saltos de línea.
 */
function normalizeKey(k?: string): string | undefined {
  if (!k) return undefined;
  let key = k.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\n/g, "\n");
  return key;
}

let cached: Firestore | null = null;

export function getAdminDb(): Firestore | null {
  if (cached) return cached;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizeKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) return null;

  try {
    const app: App = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
        });
    cached = getFirestore(app);
    return cached;
  } catch (e) {
    console.error("Firebase Admin no se pudo inicializar:", e);
    return null;
  }
}
