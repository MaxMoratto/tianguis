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

/**
 * Capa de acceso a datos.
 *
 * Si Firebase está configurado (`firebaseEnabled`), lee de Firestore.
 * Si no, devuelve los datos de ejemplo de abajo. La UI siempre llama estas
 * funciones (getProducts, getProductById, ...) y nunca toca Firestore directo,
 * así el cambio entre maqueta y producción es transparente.
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

// ---------------------------- Datos de ejemplo ----------------------------

export const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, n: "Lentes Ray-Ban vintage", cat: "lentes", e: "🕶️", price: 450, estado: "usado", stall: "El Baúl de Lupita", rating: 4.8, bg: "#fff3e0", km: 1.2, views: 312 },
  { id: 2, n: "iPhone 12 restaurado 128GB", cat: "electronica", e: "📱", price: 5200, estado: "restaurado", stall: "TecnoTianguis", rating: 4.9, bg: "#eaf0fb", km: 3.4, views: 980 },
  { id: 3, n: "Taladro inalámbrico 20V", cat: "herramientas", e: "🔧", price: 890, estado: "nuevo", stall: "Don Herramientas", rating: 4.7, bg: "#e8f5ee", km: 5.1, views: 201 },
  { id: 4, n: "Chamarra de mezclilla retro", cat: "ropa", e: "🧥", price: 320, estado: "usado", stall: "Vintage MX", rating: 4.6, bg: "#fbecea", km: 0.8, views: 154 },
  { id: 5, n: "Lego Star Wars sellado", cat: "juguetes", e: "🧱", price: 1450, estado: "nuevo", stall: "Juguetería El Sol", rating: 5.0, bg: "#fff8e1", km: 8.7, views: 540 },
  { id: 6, n: "Alebrije tallado a mano", cat: "decoracion", e: "🐉", price: 680, estado: "nuevo", stall: "Arte Oaxaca", rating: 4.9, bg: "#f3e9fb", km: 12.0, views: 430 },
  { id: 7, n: "Cartas Pokémon 1ra edición", cat: "coleccionables", e: "🎴", price: 2300, estado: "usado", stall: "Coleccio-MX", rating: 4.8, bg: "#e8f5ee", km: 4.0, views: 760 },
  { id: 8, n: "Casa para perro mediana", cat: "mascotas", e: "🐕", price: 540, estado: "nuevo", stall: "Patitas Felices", rating: 4.5, bg: "#fff3e0", km: 2.2, views: 99 },
  { id: 9, n: "Licuadora Oster restaurada", cat: "hogar", e: "🍹", price: 380, estado: "restaurado", stall: "Hogar Útil", rating: 4.4, bg: "#eaf0fb", km: 6.6, views: 120 },
  { id: 10, n: "Rines rin 15 (juego)", cat: "vehiculos", e: "🛞", price: 3200, estado: "usado", stall: "AutoPartes Beto", rating: 4.6, bg: "#f0f0f0", km: 9.3, views: 288 },
  { id: 11, n: "Guitarra acústica usada", cat: "otros", e: "🎸", price: 1100, estado: "usado", stall: "El Baúl de Lupita", rating: 4.7, bg: "#fff3e0", km: 1.2, views: 340 },
  { id: 12, n: "Reloj automático vintage", cat: "coleccionables", e: "⌚", price: 1850, estado: "restaurado", stall: "Coleccio-MX", rating: 4.9, bg: "#eef1ef", km: 4.0, views: 610 },
];

export const SAMPLE_STALLS: Stall[] = [
  { slug: "el-baul-de-lupita", n: "El Baúl de Lupita", tag: "Vintage y curiosidades", plan: "Premium", rating: 4.8, prod: 24, ventas: 312, bg: "linear-gradient(135deg,#0a7d4f,#06623b)" },
  { slug: "tecnotianguis", n: "TecnoTianguis", tag: "Electrónica restaurada", plan: "Destacado", rating: 4.9, prod: 18, ventas: 540, bg: "linear-gradient(135deg,#3a5bb8,#26408a)" },
  { slug: "arte-oaxaca", n: "Arte Oaxaca", tag: "Artesanía mexicana", plan: "Premium", rating: 4.9, prod: 31, ventas: 480, bg: "linear-gradient(135deg,#e0654b,#b83a26)" },
];

// ------------------------- Lectura de productos --------------------------

async function allProducts(): Promise<Product[]> {
  if (firebaseEnabled && db) {
    const snap = await getDocs(collection(db, "products"));
    if (!snap.empty) return snap.docs.map((d) => d.data() as Product);
  }
  return SAMPLE_PRODUCTS;
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
    const ref = doc(db, "products", String(id));
    const s = await getDoc(ref);
    if (s.exists()) return s.data() as Product;
  }
  return SAMPLE_PRODUCTS.find((p) => p.id === id);
}

export async function getProductsByStall(name: string): Promise<Product[]> {
  if (firebaseEnabled && db) {
    const q = query(collection(db, "products"), where("stall", "==", name));
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs.map((d) => d.data() as Product);
  }
  return SAMPLE_PRODUCTS.filter((p) => p.stall === name);
}

// -------------------------- Lectura de puestos ---------------------------

export async function getStalls(): Promise<Stall[]> {
  if (firebaseEnabled && db) {
    const snap = await getDocs(collection(db, "stalls"));
    if (!snap.empty) return snap.docs.map((d) => d.data() as Stall);
  }
  return SAMPLE_STALLS;
}

export async function getStallBySlug(slug: string): Promise<Stall | undefined> {
  if (firebaseEnabled && db) {
    const s = await getDoc(doc(db, "stalls", slug));
    if (s.exists()) return s.data() as Stall;
  }
  return SAMPLE_STALLS.find((s) => s.slug === slug);
}

export async function getStallByName(name: string): Promise<Stall | undefined> {
  if (firebaseEnabled && db) {
    const q = query(collection(db, "stalls"), where("n", "==", name));
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs[0].data() as Stall;
  }
  return SAMPLE_STALLS.find((s) => s.n === name);
}
