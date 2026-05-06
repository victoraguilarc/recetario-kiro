import type { Category } from '@/types'

export function fileToDataURL(file: File | null | undefined): Promise<string | null> {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export const CATEGORY_LABEL: Record<Category, string> = {
  entrada: 'Entrada',
  principal: 'Principal',
  postre: 'Postre',
  bebida: 'Bebida',
  salsa: 'Salsa',
}
