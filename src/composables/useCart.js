import { ref, onMounted, onUnmounted } from 'vue'
import { getCart, registerCartRefresh } from '../services/cartService'

const cartCount = ref(0)
let isInitialized = false

export function useCart() {
  const refreshCartCount = async () => {
    const cart = await getCart()
    cartCount.value = cart.totalItems
  }

  const handleStorageChange = (event) => {
    if (event.key === 'scf_cart_items') {
      refreshCartCount()
    }
  }

  if (!isInitialized) {
    registerCartRefresh(refreshCartCount)
    isInitialized = true
  }

  onMounted(() => {
    refreshCartCount()
    window.addEventListener('storage', handleStorageChange)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })

  return {
    cartCount,
    refreshCartCount
  }
}
