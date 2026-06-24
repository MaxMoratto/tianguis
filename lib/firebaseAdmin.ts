import {
  getApps,
  initializeApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firebase Admin SDK (solo servidor). Lo usa el webhook de Stripe para marcar
 * el puesto como pagado en Firestore con permisos de administrador.
 *
 * Requiere las variables FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y
 * FIREBASE_PRIVATE_KEY (de una cuenta de servicio). Si faltan, queda inactivo.
 */
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const adminEnabled = Boolean(projectId && clientEmail && privateKey);

let adminDb: Firestore | null = null;

if (adminEnabled) {
  const app: App = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: projectId as string,
          clientEmail: clientEmail as string,
          privateKey: privateKey as string,
        }),
      });
  adminDb = getFirestore(app);
}

export { adminDb };
