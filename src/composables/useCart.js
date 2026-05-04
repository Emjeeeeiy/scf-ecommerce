import { ref, onMounted, onUnmounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../Firebase/Firebase'
import { getCart, registerCartRefresh, syncCartOnLogin } from '../services/cartService'

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
    
    // Listen for auth changes to sync cart and refresh
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await syncCartOnLogin()
      }
      refreshCartCount()
    })

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
