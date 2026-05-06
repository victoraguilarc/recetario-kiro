# Mi Recetario

App web tipo libro de recetas que funciona **100% en local**: agregar recetas con ingredientes, preparación y fotos sin backend ni cuentas. Persistencia en IndexedDB; las imágenes se guardan como Data URLs dentro del registro de la receta. Al primer arranque siembra 8 recetas mexicanas si la base está vacía.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle de producción
```

---

## Stack

| Capa | Elección |
|---|---|
| Build | Vite 8 |
| UI | React 19 + TypeScript estricto |
| Estilos | TailwindCSS v4 (plugin oficial de Vite, tokens en `@theme`) |
| Estado | Zustand |
| Persistencia | IndexedDB (`idb`) |
| Paquetes | npm |

---

## Estructura

```
src/
├── main.tsx              Bootstrap React
├── App.tsx               Layout + router por estado de la store
├── index.css             Tailwind v4 + tokens @theme
├── types.ts              Recipe, RecipeInput, Category, Difficulty
├── db.ts                 API tipada de IndexedDB
├── seed.ts               Recetas mexicanas seed + categorías UI
├── utils.ts              fileToDataURL, CATEGORY_LABEL
├── store/recipes.ts      Store Zustand + selectores
└── components/
    ├── RecipeCard.tsx
    ├── RecipeList.tsx
    ├── RecipeDetail.tsx
    └── RecipeForm.tsx
```

Importaciones absolutas con alias `@/*` → `./src/*` (configurado en `tsconfig.json` y `vite.config.ts`).

---

## Flujos

La app es una SPA sin router; `App.tsx` cambia de vista según el estado `view` de la store (`list` · `detail` · `form`).

### 1. Arranque / seed inicial
- Al montar, `initialize()` cuenta los registros en IndexedDB.
- Si la base está vacía, inserta `SEED_RECIPES` (8 recetas mexicanas) con `bulkAdd`.
- Carga todas las recetas y pasa a la vista lista. Muestra "Cargando recetas..." mientras tanto.

### 2. Listar recetas
- Vista por defecto. Renderiza `RecipeList` con un grid responsive de `RecipeCard`.
- Chips de categoría: **Todas · Entradas · Principales · Postres · Bebidas · Salsas**.
- Empty state diferenciado: "Aún no hay recetas" vs. "No se encontraron recetas con ese filtro".

### 3. Buscar
- Input tipo `search` en el header (solo visible en vista lista).
- Filtra en memoria por `title`, `description` e `ingredients` (case-insensitive, substring).
- Se combina con el filtro de categoría activo.

### 4. Filtrar por categoría
- Click en un chip actualiza `category` en la store.
- `'todas'` desactiva el filtro; cualquier otro valor restringe a esa `Category`.

### 5. Ver detalle
- Click en una `RecipeCard` → `setView({ name: 'detail', id })`.
- `RecipeDetail` muestra foto, descripción, categoría, tiempo, porciones, dificultad, ingredientes y pasos.

### 6. Crear receta
- Botón **"+ Nueva receta"** en el header → `setView({ name: 'form' })`.
- Campos: título, descripción, categoría, tiempo (min), porciones, dificultad (Fácil · Media · Difícil), foto, ingredientes (lista dinámica), pasos (lista dinámica).
- Foto: `<input type="file">` → `fileToDataURL` → se guarda como Data URL dentro del registro.
- Submit valida que `title` no esté vacío, limpia strings, persiste con `saveRecipe` y navega al detalle creado.

### 7. Editar receta
- Desde el detalle, botón **Editar** → `setView({ name: 'form', id })`.
- El formulario se hidrata con la receta existente; `saveRecipe` hace `put` en IndexedDB conservando `createdAt` y actualizando `updatedAt`.

### 8. Eliminar receta
- Desde el detalle, botón **Eliminar** → `deleteRecipe(id)` borra de IndexedDB y del estado, regresando a la lista.

### 9. Navegación
- Logo/título en el header siempre vuelve a la lista.
- Formulario y detalle tienen "← Cancelar" / "← Volver" propios.

---

## Configuración para editores con IA

### `.mcp.json` — Claude Code

Servidor MCP de Playwright registrado a nivel de proyecto:

```jsonc
{
  "mcpServers": {
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```

**Por qué**: permite que Claude Code abra un navegador real, navegue la app, tome snapshots y screenshots, y verifique flujos de UI sin que tengamos que escribir tests todavía. Coincide con la configuración recomendada por Microsoft en [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp).

### `.kiro/` — Kiro IDE

```
.kiro/
├── settings/mcp.json     MCPs específicos de Kiro
├── steering/             Reglas siempre activas que guían al agente
├── hooks/                Automatizaciones por evento o manuales
└── specs/                (vacío) Carpeta para specs de features
```

#### `.kiro/settings/mcp.json`

| Servidor | Activo | Por qué |
|---|---|---|
| **playwright** | ✅ | Pruebas visuales y exploración de UI con `autoApprove` para los tools de solo lectura. |
| **context7** | ✅ | Documentación actualizada de React/Vite/Tailwind/Zustand inyectada al contexto cuando se necesite. |
| **fetch** | ✅ | Permite leer páginas web públicas (specs MDN, RFCs) sin salirse del editor. |
| **filesystem** | ⛔️ (off) | Kiro ya tiene acceso al workspace; lo dejé como template por si se necesita acceso a otra ruta. |
| **github** | ⛔️ (off) | Listo para activar pasando `GITHUB_TOKEN`. Útil cuando se mueva el repo a GitHub. |

#### `.kiro/steering/` — reglas siempre activas

| Archivo | Para qué sirve |
|---|---|
| `product.md` | Qué es el producto, principios (privacidad total, español por defecto, mobile-first). Evita que el agente proponga features que rompan la promesa de "local-only". |
| `tech.md` | Stack, npm-only, Tailwind v4 sin `tailwind.config.js`, Zustand con una store por dominio, IndexedDB centralizado en `db.ts`. Evita mezclas con `pnpm`/`yarn` o `localStorage`. |
| `structure.md` | Convenciones de carpetas e importaciones absolutas (`@/...`). Evita rutas relativas profundas y carpetas tipo `pages/`. |
| `testing.md` | Solo se inyecta cuando se editan archivos de test (`fileMatch`). Define Vitest + Playwright, IndexedDB limpio por test. |

#### `.kiro/hooks/`

| Hook | Disparo | Acción |
|---|---|---|
| `typecheck-on-save.kiro.hook` | Al guardar `src/**/*.{ts,tsx}` | Pide al agente correr `npx tsc --noEmit` y proponer fix si hay errores. Detecta regresiones de tipos en caliente. |
| `visual-smoke-test.kiro.hook` | Manual | Usa el MCP de Playwright para abrir el dev server y capturar listado / detalle / formulario. Útil antes de hacer merge. |

#### Specs

Carpeta `.kiro/specs/` lista pero vacía. Cuando se quiera añadir una feature grande (export/import, modo offline PWA, sincronización), Kiro puede generar ahí el flujo `requirements → design → tasks`.

---

## Verificaciones

```bash
npx tsc --noEmit   # 0 errores
npx vite build     # bundle ~215 kB / 68 kB gzip
```

Sources:
- [Kiro — MCP configuration](https://kiro.dev/docs/mcp/configuration/)
- [Kiro — Steering](https://kiro.dev/docs/steering/)
- [Kiro — Powers](https://kiro.dev/docs/powers/)
- [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
