import { create } from 'zustand'
import type { Recipe, RecipeInput, Category } from '@/types'
import {
  bulkAdd,
  countRecipes,
  deleteRecipe as dbDelete,
  getAllRecipes,
  saveRecipe as dbSave,
} from '@/db'
import { SEED_RECIPES } from '@/seed'

export type View =
  | { name: 'list' }
  | { name: 'detail'; id: number }
  | { name: 'form'; id?: number }

export type CategoryFilter = Category | 'todas'

interface RecipesState {
  recipes: Recipe[]
  loading: boolean
  search: string
  category: CategoryFilter
  view: View

  initialize: () => Promise<void>
  setSearch: (q: string) => void
  setCategory: (c: CategoryFilter) => void
  setView: (v: View) => void
  saveRecipe: (recipe: RecipeInput) => Promise<Recipe>
  deleteRecipe: (id: number) => Promise<void>
}

let initPromise: Promise<void> | null = null

export const useRecipesStore = create<RecipesState>((set, get) => ({
  recipes: [],
  loading: true,
  search: '',
  category: 'todas',
  view: { name: 'list' },

  initialize: () => {
    if (initPromise) return initPromise
    initPromise = (async () => {
      set({ loading: true })
      const count = await countRecipes()
      if (count === 0) {
        await bulkAdd(SEED_RECIPES)
      }
      const recipes = await getAllRecipes()
      set({ recipes, loading: false })
    })()
    return initPromise
  },

  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setView: (view) => set({ view }),

  saveRecipe: async (input) => {
    const saved = await dbSave(input)
    const list = get().recipes
    const idx = list.findIndex((r) => r.id === saved.id)
    const next = idx >= 0 ? list.map((r) => (r.id === saved.id ? saved : r)) : [...list, saved]
    set({ recipes: next })
    return saved
  },

  deleteRecipe: async (id) => {
    await dbDelete(id)
    set({ recipes: get().recipes.filter((r) => r.id !== id) })
  },
}))

export function selectFilteredRecipes(state: RecipesState): Recipe[] {
  const { recipes, category, search } = state
  const q = search.trim().toLowerCase()
  return recipes.filter((r) => {
    const inCat = category === 'todas' || r.category === category
    if (!inCat) return false
    if (!q) return true
    const haystack = `${r.title} ${r.description} ${r.ingredients.join(' ')}`.toLowerCase()
    return haystack.includes(q)
  })
}

export function selectRecipeById(id: number) {
  return (state: RecipesState): Recipe | undefined =>
    state.recipes.find((r) => r.id === id)
}
