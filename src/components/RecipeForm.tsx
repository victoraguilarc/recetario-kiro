import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Category, Difficulty, RecipeInput } from '@/types'
import { selectRecipeById, useRecipesStore } from '@/store/recipes'
import { fileToDataURL } from '@/utils'

const empty: RecipeInput = {
  title: '',
  description: '',
  category: 'principal',
  time: 30,
  servings: 4,
  difficulty: 'Fácil',
  image: null,
  ingredients: [''],
  steps: [''],
}

interface Props {
  editingId?: number
}

export default function RecipeForm({ editingId }: Props) {
  const setView = useRecipesStore((s) => s.setView)
  const saveRecipe = useRecipesStore((s) => s.saveRecipe)
  const existing = useRecipesStore(editingId !== undefined ? selectRecipeById(editingId) : () => undefined)

  const [r, setR] = useState<RecipeInput>(() => {
    if (existing) {
      return {
        ...existing,
        ingredients: existing.ingredients.length ? existing.ingredients : [''],
        steps: existing.steps.length ? existing.steps : [''],
      }
    }
    return empty
  })
  const [saving, setSaving] = useState(false)

  const set = (patch: Partial<RecipeInput>) => setR((prev) => ({ ...prev, ...patch }))

  const updateList = (key: 'ingredients' | 'steps', idx: number, value: string) => {
    const next = [...r[key]]
    next[idx] = value
    set({ [key]: next } as Partial<RecipeInput>)
  }
  const addItem = (key: 'ingredients' | 'steps') =>
    set({ [key]: [...r[key], ''] } as Partial<RecipeInput>)
  const removeItem = (key: 'ingredients' | 'steps', idx: number) => {
    const next = r[key].filter((_, i) => i !== idx)
    set({ [key]: next.length ? next : [''] } as Partial<RecipeInput>)
  }

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataURL(file)
    set({ image: dataUrl })
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!r.title.trim()) return
    setSaving(true)
    const cleaned: RecipeInput = {
      ...r,
      title: r.title.trim(),
      description: r.description.trim(),
      time: Number(r.time) || 0,
      servings: Number(r.servings) || 1,
      ingredients: r.ingredients.map((s) => s.trim()).filter(Boolean),
      steps: r.steps.map((s) => s.trim()).filter(Boolean),
    }
    const saved = await saveRecipe(cleaned)
    setSaving(false)
    setView({ name: 'detail', id: saved.id! })
  }

  const inputCls =
    'w-full mt-1 px-3 py-2 border border-line rounded-lg bg-bg text-ink text-sm focus:outline-none focus:border-accent'

  return (
    <div>
      <button
        onClick={() => setView(editingId ? { name: 'detail', id: editingId } : { name: 'list' })}
        className="mb-4 text-ink-soft hover:text-primary transition-colors"
      >
        ← Cancelar
      </button>

      <form
        onSubmit={submit}
        className="bg-surface border border-line rounded-2xl p-6 sm:p-7 space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-2">
          {editingId !== undefined ? 'Editar receta' : 'Nueva receta'}
        </h2>

        <label className="block text-sm text-ink-soft">
          Título
          <input
            className={inputCls}
            type="text"
            required
            maxLength={100}
            value={r.title}
            onChange={(e) => set({ title: e.target.value })}
          />
        </label>

        <label className="block text-sm text-ink-soft">
          Descripción corta
          <textarea
            className={inputCls}
            rows={2}
            maxLength={300}
            value={r.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="block text-sm text-ink-soft">
            Categoría
            <select
              className={inputCls}
              value={r.category}
              onChange={(e) => set({ category: e.target.value as Category })}
            >
              <option value="entrada">Entrada</option>
              <option value="principal">Principal</option>
              <option value="postre">Postre</option>
              <option value="bebida">Bebida</option>
              <option value="salsa">Salsa</option>
            </select>
          </label>
          <label className="block text-sm text-ink-soft">
            Tiempo (min)
            <input
              type="number"
              min={1}
              className={inputCls}
              value={r.time}
              onChange={(e) => set({ time: Number(e.target.value) })}
            />
          </label>
          <label className="block text-sm text-ink-soft">
            Porciones
            <input
              type="number"
              min={1}
              className={inputCls}
              value={r.servings}
              onChange={(e) => set({ servings: Number(e.target.value) })}
            />
          </label>
          <label className="block text-sm text-ink-soft">
            Dificultad
            <select
              className={inputCls}
              value={r.difficulty}
              onChange={(e) => set({ difficulty: e.target.value as Difficulty })}
            >
              <option>Fácil</option>
              <option>Media</option>
              <option>Difícil</option>
            </select>
          </label>
        </div>

        <label className="block text-sm text-ink-soft">
          Foto
          <input type="file" accept="image/*" className={inputCls} onChange={handleImage} />
        </label>
        {r.image && (
          <div className="flex items-start gap-3">
            <img
              src={r.image}
              alt="preview"
              className="max-w-[240px] max-h-[180px] rounded-lg border border-line"
            />
            <button
              type="button"
              onClick={() => set({ image: null })}
              className="text-sm text-danger hover:underline"
            >
              Quitar foto
            </button>
          </div>
        )}

        <fieldset className="border border-line rounded-xl p-4">
          <legend className="px-1.5 text-sm text-ink-soft">Ingredientes</legend>
          <div className="space-y-2">
            {r.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  className={inputCls + ' flex-1'}
                  placeholder={`Ingrediente ${i + 1}`}
                  value={ing}
                  onChange={(e) => updateList('ingredients', i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeItem('ingredients', i)}
                  className="px-3 rounded-lg border border-line text-ink-soft hover:border-danger hover:text-danger"
                  title="Quitar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addItem('ingredients')}
            className="mt-3 px-3 py-1.5 rounded-lg border border-dashed border-line text-ink-soft hover:border-accent hover:text-accent text-sm"
          >
            + Agregar ingrediente
          </button>
        </fieldset>

        <fieldset className="border border-line rounded-xl p-4">
          <legend className="px-1.5 text-sm text-ink-soft">Preparación</legend>
          <div className="space-y-2">
            {r.steps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="mt-2 text-ink-soft text-sm w-6">{i + 1}.</span>
                <textarea
                  rows={2}
                  className={inputCls + ' flex-1'}
                  placeholder={`Paso ${i + 1}`}
                  value={step}
                  onChange={(e) => updateList('steps', i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeItem('steps', i)}
                  className="px-3 rounded-lg border border-line text-ink-soft hover:border-danger hover:text-danger"
                  title="Quitar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addItem('steps')}
            className="mt-3 px-3 py-1.5 rounded-lg border border-dashed border-line text-ink-soft hover:border-accent hover:text-accent text-sm"
          >
            + Agregar paso
          </button>
        </fieldset>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-[color:var(--color-primary-dark)] transition-colors disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar receta'}
          </button>
        </div>
      </form>
    </div>
  )
}
