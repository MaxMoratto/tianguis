import { NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebaseAdmin";
import { getPlan } from "@/lib/plans";
import { normalizarCodigo, vencimientoDesde, DIAS_PASE } from "@/lib/pases";
import { slugify } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BGS = [
  "linear-gradient(135deg,#0a7d4f,#06623b)",
  "linear-gradient(135deg,#3a5bb8,#26408a)",
  "linear-gradient(135deg,#e0654b,#b83a26)",
  "linear-gradient(135deg,#7a5cc4,#4f3a8a)",
];

/**
 * Canjea un pase de regalo: activa un puesto GRATIS por 30 días, sin tarjeta.
 *
 * Body: { codigo, idToken, nombrePuesto, descripcion }
 *  - idToken: token de Firebase Auth del usuario (se verifica en el servidor).
 *
 * Todo ocurre con Firebase Admin (transacción atómica), así que un mismo pase
 * no se puede usar dos veces aunque varios lo intenten al mismo tiempo.
 */
export async function POST(req: Request) {
  const db = getAdminDb();
  const adminAuth = getAdminAuth();
  if (!db || !adminAuth) {
    return NextResponse.json(
      { error: "El servidor no tiene configuradas las llaves de Firebase Admin." },
      { status: 503 }
    );
  }

  let body: {
    codigo?: string;
    idToken?: string;
    nombrePuesto?: string;
    descripcion?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const codigo = normalizarCodigo(body.codigo || "");
  const nombrePuesto = (body.nombrePuesto || "").trim();
  const descripcion = (body.descripcion || "").trim();

  if (!codigo) {
    return NextResponse.json({ error: "Escribe tu código de pase." }, { status: 400 });
  }
  if (!nombrePuesto) {
    return NextResponse.json(
      { error: "Ponle un nombre a tu puesto." },
      { status: 400 }
    );
  }

  // 1) Verificar al usuario
  let uid: string;
  let email = "";
  try {
    const decoded = await adminAuth.verifyIdToken(body.idToken || "");
    uid = decoded.uid;
    email = decoded.email || "";
  } catch {
    return NextResponse.json(
      { error: "Tu sesión expiró. Vuelve a iniciar sesión e inténtalo de nuevo." },
      { status: 401 }
    );
  }

  const plan = getPlan(process.env.NEXT_PUBLIC_PLAN_PASE || "basico") || getPlan("basico");
  const slug = `puesto-${uid.slice(0, 8)}-${slugify(nombrePuesto).slice(0, 24) || "tianguis"}`;
  const ahora = Date.now();
  const accesoHasta = vencimientoDesde(ahora, DIAS_PASE);

  const paseRef = db.collection("pases").doc(codigo);
  const stallRef = db.collection("stalls").doc(slug);

  try {
    await db.runTransaction(async (tx) => {
      const paseSnap = await tx.get(paseRef);
      if (!paseSnap.exists) {
        throw new Error("CODE_NOT_FOUND");
      }
      const pase = paseSnap.data() as { estado?: string };
      if (pase.estado === "usado") {
        throw new Error("CODE_USED");
      }

      // Activa el puesto (sin Stripe, sin tarjeta).
      tx.set(
        stallRef,
        {
          slug,
          n: nombrePuesto,
          tag: descripcion || "Puesto del tianguis",
          plan: "Básico",
          rating: 5,
          prod: 0,
          ventas: 0,
          bg: BGS[Math.floor(Math.random() * BGS.length)],
          ownerId: uid,
          estadoPago: "activo",
          accesoHasta,
          origenAcceso: "pase",
          paseCodigo: codigo,
          actualizado: ahora,
        },
        { merge: true }
      );

      // Marca el pase como usado.
      tx.set(
        paseRef,
        {
          estado: "usado",
          usadoPor: uid,
          usadoEmail: email,
          stallSlug: slug,
          usadoEn: ahora,
        },
        { merge: true }
      );
    });
  } catch (e) {
    const code = e instanceof Error ? e.message : "";
    if (code === "CODE_NOT_FOUND") {
      return NextResponse.json(
        { error: "Ese código no existe. Revisa que lo hayas escrito bien." },
        { status: 404 }
      );
    }
    if (code === "CODE_USED") {
      return NextResponse.json(
        { error: "Este pase ya fue usado. Cada pase sirve una sola vez." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "No se pudo activar el pase. Inténtalo de nuevo." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    slug,
    accesoHasta,
    dias: DIAS_PASE,
    plan: plan?.nombre || "Puesto Básico",
  });
}
