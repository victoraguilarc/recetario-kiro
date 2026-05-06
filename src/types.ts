export type Category = 'entrada' | 'principal' | 'postre' | 'bebida' | 'salsa'
export type Difficulty = 'Fácil' | 'Media' | 'Difícil'

export interface Recipe {
  id?: number
  title: string
  description: string
  category: Category
  time: number
  servings: number
  difficulty: Difficulty
  image: string | null
  ingredients: string[]
  steps: string[]
  createdAt?: number
  updatedAt?: number
}

export type RecipeInput = Omit<Recipe, 'createdAt' | 'updatedAt'>
