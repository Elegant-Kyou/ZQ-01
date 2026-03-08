import { ref, watchEffect } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }

  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
  })

  return { theme, toggleTheme }
}
