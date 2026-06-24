import {
  getApps,
  initializeApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

/**
 * Firebase Admin SDK (solo servidor) — inicialización PEREZOSA y tolerante.
 *
 * Se inicializa solo cuando se llama en tiempo de petición (no al importar el
 * módulo), para que un valor mal formado de la llave NUNCA rompa el build.
 * Limpia comillas envolventes y convierte los \n a saltos de línea.
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

let cachedApp: App | null = null;

/** Inicializa (o reutiliza) la app de Admin. Devuelve null si faltan llaves. */
function getAdminApp(): App | null {
  if (cachedApp) return cachedApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizeKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) return null;

  try {
    cachedApp = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
        });
    return cachedApp;
  } catch (e) {
    console.error("Firebase Admin no se pudo inicializar:", e);
    return null;
  }
}

let cachedDb: Firestore | null = null;

export function getAdminDb(): Firestore | null {
  if (cachedDb) return cachedDb;
  const app = getAdminApp();
  if (!app) return null;
  cachedDb = getFirestore(app);
  return cachedDb;
}

let cachedAuth: Auth | null = null;

/** Auth de Admin (para verificar el ID token del usuario en rutas del servidor). */
export function getAdminAuth(): Auth | null {
  if (cachedAuth) return cachedAuth;
  const app = getAdminApp();
  if (!app) return null;
  cachedAuth = getAuth(app);
  return cachedAuth;
}
