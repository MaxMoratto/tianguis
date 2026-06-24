/**
 * Genera los 1000 pases de regalo de la campaña.
 *
 *   - Crea 1000 códigos únicos tipo TIANGUIS-A1B2.
 *   - Escribe dos archivos en ./pases/ :
 *       pases.csv          → codigo,link  (para repartir / hojas de cálculo)
 *       pases-imprimir.txt → lista bonita para imprimir y recortar
 *   - Si hay credenciales de Firebase Admin en el entorno, los sube a la
 *     colección "pases" de Firestore (id del documento = código).
 *
 * Uso (Node 20.6+):
 *   node --env-file=.env.local scripts/gen-pases.mjs
 *   node --env-file=.env.local scripts/gen-pases.mjs 1000   (cantidad opcional)
 *
 * Variables que usa:
 *   NEXT_PUBLIC_SITE_URL        → para armar los links (si falta, usa un marcador)
 *   FIREBASE_PROJECT_ID         ┐
 *   FIREBASE_CLIENT_EMAIL       ├ para subir a Firestore (opcional)
 *   FIREBASE_PRIVATE_KEY        ┘
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// --- Config (debe coincidir con lib/pases.ts) ---
const PREFIJO = "TIANGUIS-";
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I/L
const LARGO = 4;
const PLAN = "basico";
const DIAS = 30;

const CANTIDAD = Number(process.argv[2]) || 1000;
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://TU-SITIO.vercel.app").replace(/\/$/, "");

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "pases");

function sufijo() {
  let s = "";
  for (let i = 0; i < LARGO; i++) s += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  return s;
}

function generarCodigos(n) {
  const set = new Set();
  while (set.size < n) set.add(PREFIJO + sufijo());
  return [...set];
}

async function subirAFirestore(codigos) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    console.log("ℹ️  Sin credenciales de Firebase Admin: solo generé los archivos (no subí a Firestore).");
    return false;
  }
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, "\n");

  const { initializeApp, cert, getApps } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  const db = getFirestore(app);

  const creado = Date.now();
  // Firestore admite 500 escrituras por lote.
  for (let i = 0; i < codigos.length; i += 450) {
    const lote = db.batch();
    for (const codigo of codigos.slice(i, i + 450)) {
      lote.set(db.collection("pases").doc(codigo), {
        codigo,
        estado: "libre",
        plan: PLAN,
        dias: DIAS,
        creado,
      });
    }
    await lote.commit();
    console.log(`   subidos ${Math.min(i + 450, codigos.length)}/${codigos.length}…`);
  }
  return true;
}

/** Reutiliza los códigos ya generados (para que impresos y subidos coincidan). */
function leerCodigosExistentes() {
  const csvPath = join(OUT_DIR, "pases.csv");
  if (!existsSync(csvPath)) return null;
  const lineas = readFileSync(csvPath, "utf8").trim().split("\n").slice(1); // salta encabezado
  const codigos = lineas.map((l) => l.split(",")[0]).filter(Boolean);
  return codigos.length ? codigos : null;
}

async function run() {
  mkdirSync(OUT_DIR, { recursive: true });

  const existentes = leerCodigosExistentes();
  const codigos = existentes || generarCodigos(CANTIDAD);
  if (existentes) {
    console.log(`♻️  Reutilizo ${existentes.length} pases ya generados en pases/pases.csv`);
  }

  // CSV
  const csv = ["codigo,link", ...codigos.map((c) => `${c},${SITE}/pase/${c}`)].join("\n");
  writeFileSync(join(OUT_DIR, "pases.csv"), csv, "utf8");

  // Lista para imprimir
  const txt = [
    `TIANGUIS DIGITAL MX — ${codigos.length} PASES DE REGALO`,
    `Cada pase = ${DIAS} días de puesto gratis, sin tarjeta.`,
    `Se canjea en: ${SITE}/pase  (o abriendo su link directo)`,
    "".padEnd(48, "="),
    "",
    ...codigos.map((c, i) => `${String(i + 1).padStart(4, " ")}.  ${c}    ${SITE}/pase/${c}`),
  ].join("\n");
  writeFileSync(join(OUT_DIR, "pases-imprimir.txt"), txt, "utf8");

  console.log(`✅ Generé ${codigos.length} pases.`);
  console.log(`   → scripts/../pases/pases.csv`);
  console.log(`   → scripts/../pases/pases-imprimir.txt`);

  await subirAFirestore(codigos);
  process.exit(0);
}

run().catch((e) => {
  console.error("❌ Error generando pases:", e.message);
  process.exit(1);
});
