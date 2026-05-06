# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Producto

App web local "Mi Recetario": libro de recetas que corre 100% en el navegador. Sin backend, sin red, sin cuentas. Persistencia en IndexedDB; imágenes como Data URLs. UI en español neutro, mobile-first.

## Comandos

Usar **npm** (no pnpm ni yarn — convención del proyecto, ver `.kiro/steering/tech.md`).

- `npm run dev` — Vite dev server con HMR
- `npm run build` — build de producción
- `npm run preview` — sirve el build (E2E debe correr contra esto, no `dev`)
- `npm run lint` — ESLint sobre todo el repo
- `npx tsc --noEmit` — type-check; debe pasar antes de cerrar un cambio

No hay framework de tests instalado todavía. Si se añade: Vitest + RTL para unit, Playwright para E2E (limpiar IndexedDB en setup con `indexedDB.deleteDatabase('recetario')`).

## Arquitectura

Navegación **por estado en la store, no por URL**. No existen carpetas `pages/` ni `routes/`: `App.tsx` decide qué componente renderizar según el estado de Zustand.

Capas:
- **`src/types.ts`** — tipos de dominio (`Recipe`, `RecipeInput`, `Category`, `Difficulty`).
- **`src/db.ts`** — única puerta a IndexedDB (vía `idb`). Los componentes nunca llaman a `idb` directo; toda mutación pasa por aquí.
- **`src/store/recipes.ts`** — Zustand store única para el dominio de recetas. Las acciones son métodos del mismo objeto del estado. Exporta selectores tipados (`selectFilteredRecipes`, `selectRecipeById`); los componentes se suscriben a slices mínimas.
- **`src/seed.ts`** — recetas mexicanas que se siembran solo si la base está vacía; también define categorías UI.
- **`src/components/`** — un `.tsx` por componente UI. Sin lógica de estado/persistencia adentro.
- **`src/utils.ts`** — helpers puros (`fileToDataURL`, `CATEGORY_LABEL`). Partir por dominio si crece.

Flujo de datos: componente → acción de la store → `db.ts` → IndexedDB; el estado se rehidrata desde IndexedDB al arrancar.

## Convenciones

- **TypeScript estricto**: `strict`, `noUnusedLocals`, `noUnusedParameters`. No usar `any`; preferir `unknown`.
- **Imports**: alias absoluto `@/*` → `./src/*`. Nunca `../../`. Usar `import type { ... }` para tipos.
- **Tailwind v4** (sin `tailwind.config.js`): customizaciones en `@theme` dentro de `src/index.css`. Usar tokens del theme: `bg-surface`, `text-ink`, `border-line`, `bg-primary`, `bg-accent`, `bg-danger`. No CSS arbitrario por componente.
- **Persistencia**: IndexedDB para recetas. **No usar `localStorage`** para datos del dominio.
- **Dependencias**: no añadir nuevas sin razón clara; preferir API de la plataforma.

## Notas de Kiro

`.kiro/steering/*.md` contiene las reglas vivas del proyecto (product, tech, structure, testing). Si hay duda sobre intención de producto o convenciones, esos archivos son la fuente de verdad.
