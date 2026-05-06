---
inclusion: always
---

# Estructura del proyecto

```
recetario/
├── index.html               # Entrada HTML; carga /src/main.tsx
├── vite.config.ts           # Plugins react + tailwind + alias @ → ./src
├── tsconfig.json            # paths: @/* → ./src/*
├── .mcp.json                # MCP para Claude Code
├── .kiro/
│   ├── settings/mcp.json    # MCP para Kiro
│   ├── steering/            # Reglas (este directorio)
│   ├── hooks/               # Automatizaciones de Kiro
│   └── specs/               # Specs de features
└── src/
    ├── main.tsx             # Bootstrap React
    ├── App.tsx              # Layout + router por estado de la store
    ├── index.css            # Tailwind v4 + tokens @theme
    ├── types.ts             # Recipe, RecipeInput, Category, Difficulty
    ├── db.ts                # API de IndexedDB
    ├── seed.ts              # Recetas mexicanas seed + resolver de imágenes Wikipedia
    ├── router.ts            # Mapeo view ↔ location.hash
    ├── utils.ts             # Helpers (fileToDataURL, CATEGORY_LABEL)
    ├── store/
    │   └── recipes.ts       # Zustand store + selectores
    └── components/
        ├── RecipeCard.tsx
        ├── RecipeList.tsx
        ├── RecipeDetail.tsx
        └── RecipeForm.tsx
```

## Reglas de ubicación
- Componentes UI nuevos van en `src/components/` con un archivo `.tsx` por componente.
- Lógica de estado/persistencia nunca vive dentro de un componente; va en `store/` o `db.ts`.
- Helpers puros van en `utils.ts`. Si crece, partir por dominio (`utils/format.ts`, `utils/file.ts`).
- Tipos compartidos en `types.ts`. Tipos privados de un componente pueden quedarse en su archivo.
- Nada de carpetas `pages/` o `routes/`. La app navega por estado en la store; `src/router.ts` espeja ese estado en `location.hash` (back/forward del navegador y enlaces compartibles), pero el render sigue siendo `view → componente` desde la store.

## Importaciones
- Siempre con alias absoluto: `import RecipeCard from '@/components/RecipeCard'`.
- Imports de tipos con `import type { ... }` cuando solo se usan como tipo.
