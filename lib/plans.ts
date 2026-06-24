/**
 * Planes de renta de puesto (cobro MENSUAL).
 *
 * Los precios mensuales amortizan la comisión fija de Stripe (~$3 por cobro),
 * que en cobros semanales de $10 se comía ~33%. Los `priceId` son los IDs de
 * precio de Stripe (se leen de variables de entorno del servidor).
 */
export type PlanId = "basico" | "destacado" | "premium";

export interface PlanInfo {
  id: PlanId;
  nombre: string;
  precioMensual: number; // MXN / mes
  destacado?: boolean;
  beneficios: string[];
  priceId: string | undefined; // Stripe Price ID (server-only)
}

export const PLANES: PlanInfo[] = [
  {
    id: "basico",
    nombre: "Puesto Básico",
    precioMensual: 40,
    beneficios: [
      "Aparece en el mercado",
      "Hasta 20 productos",
      "10 fotos por producto",
      "Chat con compradores",
    ],
    priceId: process.env.STRIPE_PRICE_BASICO,
  },
  {
    id: "destacado",
    nombre: "Puesto Destacado",
    precioMensual: 120,
    destacado: true,
    beneficios: [
      "Todo lo del Básico",
      "Aparece arriba en búsquedas",
      "Insignia Destacado",
      "Estadísticas avanzadas",
      "Video por producto",
    ],
    priceId: process.env.STRIPE_PRICE_DESTACADO,
  },
  {
    id: "premium",
    nombre: "Puesto Premium",
    precioMensual: 400,
    beneficios: [
      "Todo lo del Destacado",
      "Portada en la home",
      "Promoción en categorías",
      "Soporte prioritario",
      "Productos ilimitados",
    ],
    priceId: process.env.STRIPE_PRICE_PREMIUM,
  },
];

export function getPlan(id: string): PlanInfo | undefined {
  return PLANES.find((p) => p.id === id);
}
