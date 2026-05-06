import type { View } from '@/store/recipes'

export function viewToHash(view: View): string {
  switch (view.name) {
    case 'list':
      return '#/'
    case 'detail':
      return `#/recipe/${view.id}`
    case 'form':
      return view.id !== undefined ? `#/recipe/${view.id}/edit` : '#/new'
  }
}

export function hashToView(hash: string): View {
  const path = hash.replace(/^#/, '') || '/'
  if (path === '/' || path === '') return { name: 'list' }
  if (path === '/new') return { name: 'form' }
  const edit = path.match(/^\/recipe\/(\d+)\/edit$/)
  if (edit) return { name: 'form', id: Number(edit[1]) }
  const detail = path.match(/^\/recipe\/(\d+)$/)
  if (detail) return { name: 'detail', id: Number(detail[1]) }
  return { name: 'list' }
}

export function currentViewFromUrl(): View {
  if (typeof window === 'undefined') return { name: 'list' }
  return hashToView(window.location.hash)
}
