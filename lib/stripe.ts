import Stripe from "stripe";

/**
 * Cliente de Stripe (solo servidor).
 * Si no hay STRIPE_SECRET_KEY, queda deshabilitado y las rutas responden 503.
 */
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

export const stripe = stripeEnabled
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string)
  : null;
