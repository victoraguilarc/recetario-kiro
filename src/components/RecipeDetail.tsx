import { useRecipesStore, selectRecipeById } from '@/store/recipes'
import { CATEGORY_LABEL } from '@/utils'

interface Props {
  id: number
}

export default function RecipeDetail({ id }: Props) {
  const recipe = useRecipesStore(selectRecipeById(id))
  const setView = useRecipesStore((s) => s.setView)
  const removeRecipe = useRecipesStore((s) => s.deleteRecipe)

  if (!recipe) {
    return (
      <div>
        <button
          onClick={() => setView({ name: 'list' })}
          className="mb-4 text-ink-soft hover:text-primary transition-colors"
        >
          ← Volver
        </button>
        <p className="text-ink-soft">Receta no encontrada.</p>
      </div>
    )
  }

  const onDelete = async () => {
    if (!confirm(`¿Eliminar "${recipe.title}"?`)) return
    await removeRecipe(recipe.id!)
    setView({ name: 'list' })
  }

  return (
    <div>
      <button
        onClick={() => setView({ name: 'list' })}
        className="mb-4 text-ink-soft hover:text-primary transition-colors"
      >
        ← Volver
      </button>

      <article className="bg-surface border border-line rounded-2xl overflow-hidden">
        <div className="aspect-[16/7] bg-amber-100">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-amber-100 to-amber-300">
              🍽️
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <span className="inline-block bg-accent text-white text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            {CATEGORY_LABEL[recipe.category]}
          </span>
          <h2 className="text-3xl font-semibold mt-3 mb-1">{recipe.title}</h2>
          <p className="text-ink-soft">{recipe.description}</p>

          <div className="flex flex-wrap gap-5 mt-3 mb-5 text-ink-soft text-sm">
            <span>⏱️ <b>{recipe.time}</b> min</span>
            <span>👥 <b>{recipe.servings}</b> porciones</span>
            <span>🔥 <b>{recipe.difficulty}</b></span>
          </div>

          <h3 className="text-base font-semibold mt-6 mb-2 pb-1.5 border-b border-line">
            Ingredientes
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          <h3 className="text-base font-semibold mt-6 mb-2 pb-1.5 border-b border-line">
            Preparación
          </h3>
          <ol className="list-decimal pl-6 space-y-2">
            {recipe.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setView({ name: 'form', id: recipe.id })}
              className="px-4 py-2 rounded-lg border border-line bg-surface hover:border-accent transition-colors"
            >
              Editar
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 rounded-lg bg-danger text-white hover:bg-red-800 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
