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
}
