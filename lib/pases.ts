import type { Stall } from "./types";

/**
 * Lógica PURA de los pases de regalo (campaña "1000 pases").
 *
 * Un pase activa un puesto gratis por `DIAS_PASE` días, sin tarjeta. Cuando
 * vence, el puesto deja de estar vigente y se invita al vendedor a suscribirse
 * con Stripe (renta normal). No hay nada de Stripe en este archivo: es solo
 * cálculo y se puede probar sin red.
 */

/** Plan que regala cada pase (id de lib/plans.ts). */
export const PLAN_PASE = "basico";

/** Duración del acceso gratis, en días. */
export const DIAS_PASE = 30;

/** Prefijo legible de los códigos. */
export const PREFIJO_PASE = "TIANGUIS-";

/**
 * Alfabeto sin caracteres ambiguos (sin 0/O, 1/I/L) para que un código se
 * pueda dictar por teléfono o leer impreso sin confusión.
 */
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Genera la parte aleatoria de un código (4 caracteres por defecto). */
export function generarSufijo(largo = 4, rnd: () => number = Math.random): string {
  let s = "";
  for (let i = 0; i < largo; i++) {
    s += ALFABETO[Math.floor(rnd() * ALFABETO.length)];
  }
  return s;
}

/** Código completo, p. ej. "TIANGUIS-A1B2". */
export function generarCodigo(largo = 4, rnd: () => number = Math.random): string {
  return PREFIJO_PASE + generarSufijo(largo, rnd);
}

/**
 * Normaliza lo que escribe el usuario: mayúsculas, sin espacios, y le agrega
 * el prefijo si solo tecleó la parte corta. Así "a1b2", "A1B2" y
 * "tianguis-a1b2" caen todos en el mismo código.
 */
export function normalizarCodigo(entrada: string): string {
  let c = (entrada || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!c) return "";
  if (!c.startsWith(PREFIJO_PASE)) {
    // quita un prefijo parcial mal escrito y vuelve a anteponer el bueno
    c = c.replace(/^TIANGUIS-?/, "");
    c = PREFIJO_PASE + c;
  }
  return c;
}

/** ¿El acceso de este puesto sigue vigente HOY? */
export function accesoVigente(stall: Pick<Stall, "estadoPago" | "accesoHasta">, ahora = Date.now()): boolean {
  if (stall.estadoPago !== "activo") return false;
  // Puestos de Stripe no llevan accesoHasta: vigentes mientras estén activos.
  if (stall.accesoHasta == null) return true;
  return stall.accesoHasta > ahora;
}

/** Días enteros que faltan para que venza el acceso (0 si ya venció o no aplica). */
export function diasRestantes(stall: Pick<Stall, "accesoHasta">, ahora = Date.now()): number {
  if (stall.accesoHasta == null) return 0;
  const ms = stall.accesoHasta - ahora;
  if (ms <= 0) return 0;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/** Calcula la fecha de vencimiento a partir de ahora. */
export function vencimientoDesde(ahora = Date.now(), dias = DIAS_PASE): number {
  return ahora + dias * 24 * 60 * 60 * 1000;
}
