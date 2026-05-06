---
inclusion: fileMatch
fileMatchPattern: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', 'tests/**/*']
---

# Testing

Si llega el momento de añadir pruebas:

- **Unit / componentes**: Vitest + React Testing Library. Configurar en `vite.config.ts` con `test: { environment: 'jsdom' }`.
- **E2E**: usar el MCP de Playwright (ya configurado en `.kiro/settings/mcp.json`) o Playwright como dependencia con `playwright/test`.
- Las pruebas E2E deben correr contra el `vite preview` del build, no contra `dev`.
- Datos: cada test arranca con IndexedDB limpio (`indexedDB.deleteDatabase('recetario')` en setup).
- Cubrir: alta de receta con foto, edición, eliminado con confirmación, filtro por categoría y búsqueda.
