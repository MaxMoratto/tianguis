export type Estado = "nuevo" | "usado" | "restaurado";
export type Plan = "Básico" | "Destacado" | "Premium";

export interface Category {
  id: string;
  n: string; // nombre
  e: string; // emoji
}

export interface Product {
  id: number;
  n: string; // nombre
  cat: string; // id de categoría
  e: string; // emoji (placeholder visual)
  price: number;
  estado: Estado;
  stall: string; // nombre del puesto
  rating: number;
  bg: string; // color de fondo del placeholder
  km: number; // distancia aproximada
  views: number;
  img?: string; // URL de foto (Firebase Storage) — opcional
  ownerId?: string; // uid del vendedor dueño — opcional
}

export interface Stall {
  slug: string;
  n: string; // nombre
  tag: string; // descripción corta
  plan: Plan;
  rating: number;
  prod: number; // # de productos
  ventas: number; // ventas reportadas
  bg: string; // gradiente de portada

  // --- Acceso / cobro (opcionales: no todos los puestos los tienen aún) ---
  ownerId?: string; // uid del vendedor dueño
  estadoPago?: "activo" | "inactivo"; // lo marca el webhook de Stripe o el canje de un pase
  accesoHasta?: number; // timestamp (ms) en que vence el acceso. Solo para puestos por PASE.
  origenAcceso?: "pase" | "stripe"; // cómo obtuvo el puesto su acceso
  paseCodigo?: string; // código del pase con el que se activó (si aplica)
}

/**
 * Pase de regalo: activa un puesto gratis por un tiempo, sin tarjeta.
 * Documento en Firestore (colección "pases"), con id = código.
 */
export interface Pase {
  codigo: string; // p. ej. TIANGUIS-A1B2 (también es el id del documento)
  estado: "libre" | "usado";
  plan: string; // id de plan que regala (p. ej. "basico")
  dias: number; // duración del acceso gratis
  creado: number; // timestamp ms
  // Se rellenan al canjearse:
  usadoPor?: string; // uid
  usadoEmail?: string;
  stallSlug?: string;
  usadoEn?: number; // timestamp ms
}
