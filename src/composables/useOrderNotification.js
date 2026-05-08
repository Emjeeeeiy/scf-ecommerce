import { ref, watch, onMounted } from 'vue'
import { subscribeToUnseenOrdersCount } from '../services/orderService'
import { useSession } from './useSession'

const unseenOrdersCount = ref(0)
let unsubscribe = null
let activeWatches = 0

export const useOrderNotification = () => {
  const { isAdmin, isAuthenticated } = useSession()

  const startSubscription = () => {
    if (unsubscribe) return
    console.log('[OrderNotification] Starting Firestore subscription...')
    unsubscribe = subscribeToUnseenOrdersCount((count) => {
      unseenOrdersCount.value = count
    })
  }

  const stopSubscription = () => {
    if (unsubscribe) {
      console.log('[OrderNotification] Stopping Firestore subscription.')
      unsubscribe()
      unsubscribe = null
      unseenOrdersCount.value = 0
    }
  }

  // Effect to manage the subscription based on session state
  const syncSubscription = () => {
    if (isAdmin.value && isAuthenticated.value) {
      startSubscription()
    } else {
      stopSubscription()
    }
  }

  // Use a watch that only runs once per component lifecycle
  // but updates the global subscription state.
  watch(
    [isAdmin, isAuthenticated],
    () => {
      syncSubscription()
    },
    { immediate: true }
  )

  return {
    unseenOrdersCount,
    stopSubscription,
    startSubscription
  }
}


