/**
 * Lógica del horario del mercado.
 *
 * El tianguis abre miércoles (día 3) y sábado (día 6) de 06:30 a 14:00.
 * Estas funciones son puras (no dependen del navegador ni de React), así que
 * sirven igual en el servidor, en el cliente y, a futuro, en el backend.
 */

export const MARKET = {
  /** Días de apertura (getDay(): 0=domingo ... 6=sábado) */
  days: [3, 6] as number[],
  open: { h: 6, m: 30 },
  close: { h: 14, m: 0 },
};

export const DIAS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

/** ¿El mercado está abierto en `now`? */
export function isMarketOpen(now: Date = new Date()): boolean {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = MARKET.open.h * 60 + MARKET.open.m;
  const close = MARKET.close.h * 60 + MARKET.close.m;
  return MARKET.days.includes(day) && mins >= open && mins < close;
}

export interface NextChange {
  /** true si el mercado está abierto (el target es el cierre) */
  open: boolean;
  /** etiqueta lista para mostrar */
  label: string;
  /** momento del próximo cambio de estado */
  target: Date;
}

/**
 * Devuelve el próximo cambio de estado: si está abierto, cuándo cierra;
 * si está cerrado, cuándo es la próxima apertura.
 */
export function nextChange(now: Date = new Date()): NextChange {
  if (isMarketOpen(now)) {
    const target = new Date(now);
    target.setHours(MARKET.close.h, MARKET.close.m, 0, 0);
    return { open: true, label: "Cierra en", target };
  }
  for (let i = 0; i < 8; i++) {
    const target = new Date(now);
    target.setDate(now.getDate() + i);
    target.setHours(MARKET.open.h, MARKET.open.m, 0, 0);
    if (MARKET.days.includes(target.getDay()) && target > now) {
      return { open: false, label: "Próxima apertura en", target };
    }
  }
  // fallback teórico (nunca debería ocurrir)
  const target = new Date(now);
  target.setDate(now.getDate() + 7);
  return { open: false, label: "Próxima apertura en", target };
}

/** Formatea un Date como "Sábado 27/6 · 06:30" */
export function fmtTarget(t: Date): string {
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  return `${DIAS[t.getDay()]} ${t.getDate()}/${t.getMonth() + 1} · ${hh}:${mm}`;
}
