import { ref, watch } from 'vue'

const isDarkMode = ref(localStorage.getItem('adminTheme') === 'dark')

export const useAdminTheme = () => {
  const toggleTheme = (val) => {
    isDarkMode.value = val
    localStorage.setItem('adminTheme', val ? 'dark' : 'light')
  }

  return {
    isDarkMode,
    toggleTheme
  }
}
