import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'what-to-eat-favorites'

const favorites = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

export function useFavorites() {
  function isFavorite(dishId) {
    return favorites.value.includes(dishId)
  }

  function toggleFavorite(dishId) {
    const idx = favorites.value.indexOf(dishId)
    if (idx > -1) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(dishId)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
  }

  return { favorites, isFavorite, toggleFavorite }
}
