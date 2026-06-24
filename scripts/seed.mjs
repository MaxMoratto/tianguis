/**
 * Carga los datos de ejemplo (productos y puestos) en Firestore.
 *
 * Uso (Node 20.6+):
 *   1) Asegúrate de tener .env.local con tus llaves de Firebase.
 *   2) En Firestore, pon temporalmente las reglas en modo prueba
 *      (allow read, write: if true) para poder sembrar, o ejecuta esto
 *      mientras tengas sesión. Al terminar, vuelve a las reglas seguras.
 *   3) Corre:  node --env-file=.env.local scripts/seed.mjs
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!cfg.apiKey || !cfg.projectId) {
  console.error("❌ Faltan variables de Firebase. Revisa .env.local");
  process.exit(1);
}

const db = getFirestore(initializeApp(cfg));

const PRODUCTS = [
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

const STALLS = [
  { slug: "el-baul-de-lupita", n: "El Baúl de Lupita", tag: "Vintage y curiosidades", plan: "Premium", rating: 4.8, prod: 24, ventas: 312, bg: "linear-gradient(135deg,#0a7d4f,#06623b)" },
  { slug: "tecnotianguis", n: "TecnoTianguis", tag: "Electrónica restaurada", plan: "Destacado", rating: 4.9, prod: 18, ventas: 540, bg: "linear-gradient(135deg,#3a5bb8,#26408a)" },
  { slug: "arte-oaxaca", n: "Arte Oaxaca", tag: "Artesanía mexicana", plan: "Premium", rating: 4.9, prod: 31, ventas: 480, bg: "linear-gradient(135deg,#e0654b,#b83a26)" },
];

async function run() {
  for (const p of PRODUCTS) await setDoc(doc(db, "products", String(p.id)), p);
  for (const s of STALLS) await setDoc(doc(db, "stalls", s.slug), s);
  console.log(`✅ Sembrados ${PRODUCTS.length} productos y ${STALLS.length} puestos.`);
  process.exit(0);
}

run().catch((e) => {
  console.error("❌ Error sembrando:", e.message);
  process.exit(1);
});
