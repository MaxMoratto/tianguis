import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";
import type { Category, Product, Stall, Plan } from "./types";
import { accesoVigente } from "./pases";

/**
 * Capa de acceso a datos — SOLO datos reales (Firestore).
 * Sin datos de ejemplo: si no hay nada en Firestore, se devuelve vacío y la UI
 * muestra su estado vacío.
 */

// ---------------------------- Taxonomía (fija) ----------------------------

export const CATS: Category[] = [
  { id: "lentes", n: "Lentes", e: "🕶️" },
  { id: "electronica", n: "Electrónica", e: "📱" },
  { id: "herramientas", n: "Herramientas", e: "🔧" },
  { id: "ropa", n: "Ropa", e: "👕" },
  { id: "juguetes", n: "Juguetes", e: "🧸" },
  { id: "decoracion", n: "Decoración", e: "🪅" },
  { id: "coleccionables", n: "Coleccionables", e: "🎴" },
  { id: "mascotas", n: "Mascotas", e: "🐕" },
  { id: "hogar", n: "Hogar", e: "🏠" },
  { id: "vehiculos", n: "Vehículos", e: "🚗" },
  { id: "otros", n: "Otros", e: "📦" },
];

export const PLAN_COLOR: Record<Plan, string> = {
  Básico: "#79827d",
  Destacado: "#f4b740",
  Premium: "#0a7d4f",
};

export function getCategories(): Category[] {
  return CATS;
}

// ------------------------- Lectura de productos --------------------------

async function allProducts(): Promise<Product[]> {
  if (firebaseEnabled && db) {
    const snap = await getDocs(collection(db, "products"));
    return snap.docs.map((d) => d.data() as Product);
  }
  return [];
}

export async function getProducts(opts?: {
  cat?: string;
  q?: string;
}): Promise<Product[]> {
  let list = await allProducts();
  if (opts?.cat && opts.cat !== "todos") {
    list = list.filter((p) => p.cat === opts.cat);
  }
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    list = list.filter((p) => p.n.toLowerCase().includes(q));
  }
  return list;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  if (firebaseEnabled && db) {
    const s = await getDoc(doc(db, "products", String(id)));
    if (s.exists()) return s.data() as Product;
  }
  return undefined;
}

export async function getProductsByStall(name: string): Promise<Product[]> {
  if (firebaseEnabled && db) {
    const q = query(collection(db, "products"), where("stall", "==", name));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Product);
  }
  return [];
}

// -------------------------- Lectura de puestos ---------------------------

/**
 * ¿Este puesto se muestra al público?
 * Los puestos activados por un PASE de regalo desaparecen solos cuando vence su
 * mes gratis. Los demás (demo o de paga vía Stripe) siempre se muestran.
 */
function visiblePublicamente(s: Stall): boolean {
  if (s.origenAcceso === "pase") return accesoVigente(s);
  return true;
}

export async function getStalls(): Promise<Stall[]> {
  if (firebaseEnabled && db) {
    const snap = await getDocs(collection(db, "stalls"));
    return snap.docs
      .map((d) => d.data() as Stall)
      .filter(visiblePublicamente);
  }
  return [];
}

export async function getStallBySlug(slug: string): Promise<Stall | undefined> {
  if (firebaseEnabled && db) {
    const s = await getDoc(doc(db, "stalls", slug));
    if (s.exists()) return s.data() as Stall;
  }
  return undefined;
}

export async function getStallByName(name: string): Promise<Stall | undefined> {
  if (firebaseEnabled && db) {
    const q = query(collection(db, "stalls"), where("n", "==", name));
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs[0].data() as Stall;
  }
  return undefined;
}
