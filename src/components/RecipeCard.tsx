import type { Recipe } from '@/types'
import { CATEGORY_LABEL } from '@/utils'

interface Props {
  recipe: Recipe
  onClick: () => void
}

export default function RecipeCard({ recipe, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="group bg-surface border border-line rounded-2xl overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col"
    >
      <div
        className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-300 bg-cover bg-center relative"
        style={recipe.image ? { backgroundImage: `url(${recipe.image})` } : undefined}
      >
        <span className="absolute top-3 left-3 bg-black/65 text-white text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full">
          {CATEGORY_LABEL[recipe.category]}
        </span>
        {!recipe.image && (
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-70">
            🍽️
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-ink mb-1.5 line-clamp-1">{recipe.title}</h3>
        <p className="text-sm text-ink-soft line-clamp-2 mb-3 flex-1">{recipe.description}</p>
        <div className="flex gap-3 text-xs text-ink-soft">
          <span>⏱️ {recipe.time} min</span>
          <span>👥 {recipe.servings}</span>
          <span>🔥 {recipe.difficulty}</span>
        </div>
      </div>
    </button>
  )
}
