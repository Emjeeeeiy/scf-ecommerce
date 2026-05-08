import { ref, watch } from 'vue'
import { subscribeToUnseenOrdersCount } from '../services/orderService'
import { useSession } from './useSession'

const unseenOrdersCount = ref(0)
let unsubscribe = null

export const useOrderNotification = () => {
  const { isAdmin, isAuthenticated } = useSession()

  const startSubscription = () => {
    if (unsubscribe) return
    
    unsubscribe = subscribeToUnseenOrdersCount((count) => {
      unseenOrdersCount.value = count
    })
  }

  const stopSubscription = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
      unseenOrdersCount.value = 0
    }
  }

  // Watch for admin status changes to start/stop the subscription
  watch(
    [isAdmin, isAuthenticated],
    ([newIsAdmin, newIsAuth]) => {
      if (newIsAdmin && newIsAuth) {
        startSubscription()
      } else {
        stopSubscription()
      }
    },
    { immediate: true }
  )

  return {
    unseenOrdersCount,
    stopSubscription,
    startSubscription
  }
}

