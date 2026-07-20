import { ref } from 'vue'

const isDarkMode = ref(localStorage.getItem('storeTheme') === 'dark')

export const useStoreTheme = () => {
  const toggleTheme = (val) => {
    isDarkMode.value = val
    localStorage.setItem('storeTheme', val ? 'dark' : 'light')
  }

  return {
    isDarkMode,
    toggleTheme
  }
}
