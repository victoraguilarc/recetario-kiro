import { useMemo } from 'react'
import RecipeCard from '@/components/RecipeCard'
import { CATEGORIES } from '@/seed'
import { useRecipesStore } from '@/store/recipes'

export default function RecipeList() {
  const recipes = useRecipesStore((s) => s.recipes)
  const category = useRecipesStore((s) => s.category)
  const search = useRecipesStore((s) => s.search)
  const setCategory = useRecipesStore((s) => s.setCategory)
  const setView = useRecipesStore((s) => s.setView)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return recipes.filter((r) => {
      const inCat = category === 'todas' || r.category === category
      if (!inCat) return false
      if (!q) return true
      const haystack = `${r.title} ${r.description} ${r.ingredients.join(' ')}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [recipes, category, search])

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
              category === c.id
                ? 'bg-ink text-white border-ink'
                : 'bg-surface text-ink border-line hover:border-accent'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-ink-soft py-16">
          {recipes.length === 0
            ? 'Aún no hay recetas. Crea la primera con "+ Nueva receta".'
            : 'No se encontraron recetas con ese filtro.'}
        </p>
      ) : (
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
          {filtered.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onClick={() => setView({ name: 'detail', id: r.id! })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
