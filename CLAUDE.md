# CLAUDE.md

Guía para Claude Code en este repositorio. Las convenciones completas están en
[`AGENTS.md`](AGENTS.md) — léelo primero. Aquí van los puntos que más importan.

## Contexto en una línea

Marketplace "tianguis" que **abre por horas** (Mié y Sáb, 6:30–14:00). MVP frontend
en **Next.js App Router + TypeScript + Tailwind**, datos de ejemplo en memoria.

## Antes de terminar cualquier cambio

```bash
npm run typecheck && npm run build
```

Ambos deben pasar. No marques una tarea como hecha si fallan.

## Reglas que no se rompen

- Server Components por defecto; `"use client"` solo si hay estado/efectos/navegador.
- Lógica de negocio en `lib/` (el horario en `lib/market.ts`, **puro**).
- Lee datos con las funciones de `lib/data.ts`, no los arrays directos.
- Fuera de horario **no se puede comprar** (`isMarketOpen()`).
- **Cero comisión por venta**; el ingreso es la renta de puestos.
- Texto de usuario en español de México; reutiliza clases de `globals.css`.

## Dónde está cada cosa

- Horario del mercado → `lib/market.ts`
- Datos y acceso → `lib/data.ts`, tipos → `lib/types.ts`
- Diseño/estilos → `app/globals.css` (+ `tailwind.config.ts`)
- Componentes vivos → `components/` (`Countdown`, `BuyBox`, `MarketStatusPill`, `MarketBanner`)
- Rutas → `app/**/page.tsx`
