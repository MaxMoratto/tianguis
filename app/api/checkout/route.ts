import { NextResponse } from "next/server";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { getPlan } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * Crea una sesión de Stripe Checkout (suscripción mensual) para rentar un puesto.
 * Body: { plan, uid?, email?, stallSlug? }
 */
export async function POST(req: Request) {
  if (!stripeEnabled || !stripe) {
    return NextResponse.json(
      { error: "Stripe no está configurado todavía." },
      { status: 503 }
    );
  }

  try {
    const { plan, uid, email, stallSlug } = await req.json();
    const info = getPlan(plan);

    if (!info || !info.priceId) {
      return NextResponse.json(
        { error: "Plan inválido o sin precio configurado en Stripe." },
        { status: 400 }
      );
    }

    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";

    const metadata = {
      plan: info.id,
      uid: uid || "",
      stallSlug: stallSlug || "",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: info.priceId, quantity: 1 }],
      success_url: `${origin}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pago/cancelado`,
      customer_email: email || undefined,
      metadata,
      subscription_data: { metadata },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error creando el checkout";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
