import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook de Stripe. Verifica la firma y, al confirmarse el pago, marca el
 * puesto como activo en Firestore (vía Firebase Admin, inicializado en runtime).
 *
 * Configura el endpoint en Stripe Dashboard apuntando a /api/stripe/webhook
 * y pega el "Signing secret" en STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  if (!stripeEnabled || !stripe) {
    return NextResponse.json({ error: "Stripe no configurado" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    if (!sig || !secret) throw new Error("Falta firma o webhook secret");
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "firma inválida";
    return NextResponse.json({ error: `Webhook: ${msg}` }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "invoice.paid"
    ) {
      const obj = event.data.object as {
        metadata?: Record<string, string>;
        customer?: string | null;
      };
      const meta = obj.metadata || {};
      const stallSlug = meta.stallSlug;
      const plan = meta.plan;

      const db = getAdminDb();
      if (db && stallSlug) {
        await db
          .collection("stalls")
          .doc(stallSlug)
          .set(
            {
              plan: plan || null,
              estadoPago: "activo",
              stripeCustomerId: obj.customer ?? null,
              actualizado: Date.now(),
            },
            { merge: true }
          );
      }
    }
  } catch {
    return NextResponse.json(
      { error: "Error procesando el evento" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
