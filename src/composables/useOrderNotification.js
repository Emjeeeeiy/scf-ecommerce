import { ref, onUnmounted } from 'vue'
import { subscribeToUnseenOrdersCount } from '../services/orderService'

const unseenOrdersCount = ref(0)
let unsubscribe = null

export const useOrderNotification = () => {
  if (!unsubscribe) {
    unsubscribe = subscribeToUnseenOrdersCount((count) => {
      unseenOrdersCount.value = count
    })
  }

  // Optional: Clean up when the entire app is destroyed or on demand
  const stopSubscription = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    unseenOrdersCount,
    stopSubscription
  }
}
