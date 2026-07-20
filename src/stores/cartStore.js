import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../Firebase/Firebase'
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  syncCartOnLogin,
  updateCartItemQuantity,
} from '../services/cartService'

/**
 * Centralized cart state, shared by every component that calls useCartStore()
 * (module-level singleton refs, same pattern as useSession). Previously every
 * view that touched the cart (AppShell's badge, Cart.vue, Checkout.vue,
 * ProductDetails.vue) called cartService directly and kept its own local copy,
 * so an add-to-cart on one page didn't reflect anywhere else until a manual
 * refetch. Now there is one cart, and any mutation refreshes it everywhere.
 */
const items = ref([])
const totalItems = ref(0)
const totalAmount = ref(0)
const loading = ref(false)
let initialized = false

const applyCart = (cart) => {
  items.value = cart.items
  totalItems.value = cart.totalItems
  totalAmount.value = cart.totalAmount
}

const refresh = async () => {
  loading.value = true
  try {
    applyCart(await getCart())
  } finally {
    loading.value = false
  }
}

const initOnce = () => {
  if (initialized) return
  initialized = true

  // Cross-tab edits (another tab adding to the guest cart) show up via storage events.
  window.addEventListener('storage', (event) => {
    if (event.key === 'scf_cart_items') refresh()
  })

  // On login, merge the guest cart into the account cart, then load the result.
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await syncCartOnLogin()
    }
    refresh()
  })
}

export function useCartStore() {
  initOnce()

  const addItem = async (payload) => {
    await addToCart(payload)
    await refresh()
  }

  const updateItemQuantity = async (payload) => {
    await updateCartItemQuantity(payload)
    await refresh()
  }

  const removeItem = async (payload) => {
    await removeCartItem(payload)
    await refresh()
  }

  const clear = async () => {
    await clearCart()
    await refresh()
  }

  return {
    items,
    totalItems,
    totalAmount,
    cartCount: totalItems,
    loading,
    refresh,
    addItem,
    updateItemQuantity,
    removeItem,
    clear,
  }
}
