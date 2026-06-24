import type { Estado } from "./types";

/** Formatea pesos mexicanos: 5200 -> "$5,200" */
export const money = (n: number): string =>
  "$" + n.toLocaleString("es-MX");

/** Primera letra en mayúscula */
export const cap = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

/** Clase CSS para la etiqueta de estado del producto */
export const estClass = (e: Estado): string =>
  ({ nuevo: "e-nuevo", usado: "e-usado", restaurado: "e-restaurado" })[e];

/** slug a partir de un nombre: "El Baúl de Lupita" -> "el-baul-de-lupita" */
export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
