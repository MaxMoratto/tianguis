# AGENTS.md — Tianguis Digital MX

Instrucciones para agentes de IA (Claude, Cursor, Copilot, etc.) que trabajen en
este repositorio. El humano dirige la arquitectura; el agente escribe el código.

## Qué es esto

Marketplace tipo tianguis que **abre por horas** (miércoles y sábados, 6:30–14:00).
Vendedores rentan un puesto digital; no hay comisión por venta. MVP de frontend con
**Next.js (App Router) + TypeScript + Tailwind**. Datos de ejemplo en memoria.

## Stack y versiones

- Next.js 14 (App Router, carpeta `app/`)
- React 18 + TypeScript en modo `strict`
- Tailwind CSS 3 (paleta en `tailwind.config.ts`); el detalle de componentes está
  en `app/globals.css` con clases CSS y variables (`--verde`, etc.)
- Sin librería de estado ni de datos externa todavía

## Comandos

```bash
npm run dev        # desarrollo
npm run build      # build (debe pasar sin errores antes de un PR)
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

**Antes de dar por terminada una tarea: `npm run typecheck` y `npm run build` deben pasar.**

## Convenciones

- **Server Components por defecto.** Solo usa `"use client"` cuando necesites estado,
  efectos o interacción del navegador (ej. `Countdown`, `BuyBox`, `MarketStatusPill`).
- **La lógica de negocio va en `lib/`, no en componentes.** El horario del mercado
  vive en `lib/market.ts` y debe ser **puro** (sin `window`, sin React).
- **Los datos se leen con las funciones de `lib/data.ts`** (`getProducts`, etc.),
  nunca tocando los arrays directamente. Así, migrar a PostgreSQL solo cambia esas
  funciones sin tocar la UI.
- **Estilos:** reutiliza las clases existentes de `globals.css` (`.btn`, `.card`,
  `.panel`, `.kpi`, …). Para colores usa las variables CSS o las utilidades de Tailwind
  (`text-verde`, `bg-terracota`). No inventes una paleta nueva.
- **Idioma:** todo el texto de cara al usuario en **español de México**. Nombres de
  variables y comentarios también en español está bien.
- **Imports** con alias `@/` (ej. `@/lib/market`, `@/components/ProductCard`).
- **Accesibilidad / usuarios mayores:** letra legible, contraste alto, pasos claros.

## Reglas de producto que NO se deben romper

- Fuera del horario de mercado, **no se puede comprar** (solo navegar y guardar).
  Esto se controla con `isMarketOpen()` — respétalo en cualquier flujo de compra nuevo.
- **No hay comisión por venta.** El ingreso viene solo de la renta de puestos
  (Básico $10, Destacado $30, Premium $100 por semana).

## Al agregar una página

1. Crea `app/<ruta>/page.tsx` (Server Component si se puede).
2. Lee datos vía `lib/data.ts`.
3. Reutiliza `Header`/`Footer` (ya están en el layout) y clases de `globals.css`.
4. Agrega `metadata` para SEO.
5. Corre `typecheck` + `build`.

## Roadmap técnico (contexto, no implementado aquí)

PostgreSQL + Prisma → Auth y verificación (correo/SMS/INE) → Pagos (Stripe,
Mercado Pago, OXXO Pay, SPEI) → Chat → Moderación IA → Mapas/geolocalización → PWA.
