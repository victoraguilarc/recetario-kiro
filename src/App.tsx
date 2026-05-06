import { useEffect } from 'react'
import RecipeList from '@/components/RecipeList'
import RecipeDetail from '@/components/RecipeDetail'
import RecipeForm from '@/components/RecipeForm'
import { useRecipesStore } from '@/store/recipes'

export default function App() {
  const initialize = useRecipesStore((s) => s.initialize)
  const loading = useRecipesStore((s) => s.loading)
  const view = useRecipesStore((s) => s.view)
  const search = useRecipesStore((s) => s.search)
  const setSearch = useRecipesStore((s) => s.setSearch)
  const setView = useRecipesStore((s) => s.setView)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 bg-surface border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
          <button
            onClick={() => setView({ name: 'list' })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🌶️</span>
            <h1 className="text-xl font-semibold tracking-tight">Mi Recetario</h1>
          </button>
          <div className="flex flex-1 justify-end gap-2 items-center">
            {view.name === 'list' && (
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar receta o ingrediente..."
                className="flex-1 max-w-sm px-4 py-2 rounded-full border border-line bg-bg text-sm focus:outline-none focus:border-accent"
              />
            )}
            <button
              onClick={() => setView({ name: 'form' })}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-[color:var(--color-primary-dark)] transition-colors text-sm"
            >
              + Nueva receta
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20">
        {loading ? (
          <p className="text-center text-ink-soft py-16">Cargando recetas...</p>
        ) : view.name === 'list' ? (
          <RecipeList />
        ) : view.name === 'detail' ? (
          <RecipeDetail id={view.id} />
        ) : (
          <RecipeForm editingId={view.id} />
        )}
      </main>
    </div>
  )
}
