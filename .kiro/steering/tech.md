---
inclusion: always
---

# Stack y convenciones técnicas

## Stack
- **Build**: Vite 8 (`vite.config.ts`)
- **UI**: React 19 + TypeScript estricto
- **Estilos**: TailwindCSS v4 vía `@tailwindcss/vite`. Tokens declarados en `src/index.css` con `@theme`.
- **Estado**: Zustand (`src/store/recipes.ts`). Una sola store por dominio.
- **Persistencia**: IndexedDB con `idb` (`src/db.ts`). No usar `localStorage` para datos de recetas.
- **Gestor de paquetes**: npm (no usar pnpm ni yarn).

## TypeScript
- `strict: true`, `noUnusedLocals`, `noUnusedParameters` activos.
- **Importaciones absolutas con alias `@/*` → `./src/*`**. Nunca usar `../../` ni rutas relativas profundas.
- Definir tipos de dominio en `src/types.ts`. No usar `any`; preferir `unknown` cuando haga falta.

## Tailwind v4
- No existe `tailwind.config.js`. Las customizaciones van en `@theme` dentro de `src/index.css`.
- Usar variables del theme (`bg-surface`, `text-ink`, `border-line`, `bg-primary`, `bg-accent`, `bg-danger`).
- No mezclar CSS arbitrario por componente; preferir clases utility.

## Zustand
- Una sola store por slice de dominio. Acciones como métodos en el mismo objeto del estado.
- Selectores tipados exportados desde el archivo de la store (`selectFilteredRecipes`, `selectRecipeById`).
- Los componentes deben suscribirse a slices mínimas, no al estado completo.

## IndexedDB
- Toda mutación va por `src/db.ts`. Los componentes nunca llaman a `idb` directo.
- Las imágenes se guardan como Data URLs dentro del registro de la receta.

## Calidad
- Antes de cerrar un cambio: `npx tsc --noEmit` debe pasar.
- `vite build` debe pasar sin warnings de TypeScript.
- No introducir dependencias nuevas sin razón clara; preferir resolver con la API de la plataforma.
