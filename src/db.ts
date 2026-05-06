import { openDB, type IDBPDatabase, type DBSchema } from 'idb'
import type { Recipe, RecipeInput } from '@/types'

interface RecetarioDB extends DBSchema {
  recipes: {
    key: number
    value: Recipe
    indexes: { category: string; createdAt: number }
  }
}

const DB_NAME = 'recetario'
const DB_VERSION = 1
const STORE = 'recipes' as const

const dbPromise: Promise<IDBPDatabase<RecetarioDB>> = openDB<RecetarioDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      store.createIndex('category', 'category')
      store.createIndex('createdAt', 'createdAt')
    }
  },
})

export async function getAllRecipes(): Promise<Recipe[]> {
  const db = await dbPromise
  return db.getAll(STORE)
}

export async function getRecipe(id: number): Promise<Recipe | undefined> {
  const db = await dbPromise
  return db.get(STORE, id)
}

export async function saveRecipe(recipe: RecipeInput): Promise<Recipe> {
  const db = await dbPromise
  const now = Date.now()
  if (recipe.id !== undefined) {
    const existing = await db.get(STORE, recipe.id)
    const updated: Recipe = { ...(existing as Recipe), ...recipe, updatedAt: now }
    await db.put(STORE, updated)
    return updated
  }
  const created: Recipe = { ...recipe, createdAt: now, updatedAt: now }
  const id = await db.add(STORE, created)
  return { ...created, id: id as number }
}

export async function deleteRecipe(id: number): Promise<void> {
  const db = await dbPromise
  await db.delete(STORE, id)
}

export async function countRecipes(): Promise<number> {
  const db = await dbPromise
  return db.count(STORE)
}

export async function bulkAdd(recipes: RecipeInput[]): Promise<void> {
  const db = await dbPromise
  const tx = db.transaction(STORE, 'readwrite')
  const now = Date.now()
  for (const r of recipes) {
    await tx.store.add({ ...r, createdAt: now, updatedAt: now } as Recipe)
  }
  await tx.done
}
