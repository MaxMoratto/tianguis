# 🛖 Tianguis Digital MX

> El mercado en línea que **abre por horas**. Inspirado en los tianguis mexicanos.

Marketplace donde los vendedores **rentan un puesto digital** (desde $10 MXN/semana,
sin comisión por venta) y el mercado **solo abre miércoles y sábados de 6:30 a 14:00**.
Ese horario genera urgencia, tráfico concentrado y sensación de evento — la diferencia
clave contra Mercado Libre o Facebook Marketplace.

Este repositorio es el **MVP del frontend** construido con Next.js (App Router) +
TypeScript + Tailwind. Los datos son de ejemplo (en memoria); el backend real
(PostgreSQL, pagos, auth) se conecta después manteniendo las mismas funciones de `lib/data.ts`.

---

## 🚀 Arrancar en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

Otros comandos:

```bash
npm run build      # build de producción
npm run start      # servir el build
npm run typecheck  # revisar tipos sin compilar
npm run lint       # linting de Next
```

## ☁️ Desplegar en Vercel

1. Sube este repo a GitHub.
2. En Vercel: **New Project → importa el repo**.
3. Framework: **Next.js** (autodetectado). No requiere variables de entorno todavía.
4. Deploy. Listo.

---

## 🗺️ Rutas

| Ruta | Qué es |
|------|--------|
| `/` | Home: hero, contador en vivo, categorías, destacados, planes, FAQ |
| `/mercado` | Listado con búsqueda y filtros (`?cat=` y `?q=`) |
| `/producto/[id]` | Detalle de producto (compra bloqueada fuera de horario) |
| `/puesto/[slug]` | Perfil del puesto con su reputación y productos |
| `/mapa` | Mapa de actividad (placeholder para Mapbox/Google Maps) |
| `/panel/vendedor` | Dashboard del vendedor |
| `/panel/comprador` | Dashboard del comprador |
| `/panel/admin` | Centro de control (moderación IA, ingresos) |

## 🧠 La pieza central: el horario del mercado

Toda la lógica vive en [`lib/market.ts`](lib/market.ts) y es **pura** (sirve en
servidor, cliente y futuro backend):

- `isMarketOpen(now)` → ¿abierto ahora?
- `nextChange(now)` → próximo cierre o próxima apertura
- `fmtTarget(date)` → texto legible

El contador (`components/Countdown.tsx`), la píldora del header
(`MarketStatusPill.tsx`), el aviso (`MarketBanner.tsx`) y los botones de compra
(`BuyBox.tsx`) consumen estas funciones y se actualizan en vivo en el cliente.

---

## 📁 Estructura

```
app/                  # rutas (App Router)
  layout.tsx          # header + footer + metadata/SEO
  page.tsx            # home
  globals.css         # sistema de diseño completo
  mercado/            # listado
  producto/[id]/      # detalle de producto
  puesto/[slug]/      # perfil de puesto
  mapa/               # mapa
  panel/              # dashboards (vendedor, comprador, admin)
components/           # UI reutilizable (cliente y servidor)
lib/                  # lógica y datos
  market.ts           # ⭐ horario del mercado (pura)
  data.ts             # datos de ejemplo + funciones de acceso
  types.ts            # tipos compartidos
  format.ts           # helpers (money, slug, etc.)
prototipo/            # prototipo HTML original de referencia
```

## 🔥 Firebase (ya integrado)

El proyecto incluye Firebase con diseño tolerante a fallos: si no hay llaves,
usa datos de ejemplo; al configurarlas, se activa solo.

- Firestore → catálogo real de productos y puestos (`lib/data.ts`)
- Authentication → registro/login con correo y Google (`/entrar`)
- Storage → fotos de productos (alta en `/panel/vendedor/nuevo`)

Para crear el proyecto y publicarlo paso a paso, ver **[`DEPLOY.md`](DEPLOY.md)**.
Reglas de seguridad en `firestore.rules` y `storage.rules`. Variables en
`.env.local.example`. Sembrar datos: `npm run seed`.

## 🔜 Siguientes pasos (futuras fases)

Pagos (Stripe, Mercado Pago, OXXO Pay, SPEI), chat interno en tiempo real,
verificación con INE/SMS, moderación con IA, geolocalización con mapas reales,
y app móvil (PWA).

Ver `AGENTS.md` para convenciones de desarrollo.
