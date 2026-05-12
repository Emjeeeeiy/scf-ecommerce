import { ref, watch } from 'vue'
import { subscribeToUnseenUsersCount } from '../services/userService'
import { useSession } from './useSession'

const unseenUsersCount = ref(0)
let unsubscribe = null

export const useUserNotification = () => {
  const { isAdmin, isAuthenticated } = useSession()

  const startSubscription = () => {
    if (unsubscribe) return
    console.log('[UserNotification] Starting Firestore subscription...')
    unsubscribe = subscribeToUnseenUsersCount((count) => {
      unseenUsersCount.value = count
    })
  }

  const stopSubscription = () => {
    if (unsubscribe) {
      console.log('[UserNotification] Stopping Firestore subscription.')
      unsubscribe()
      unsubscribe = null
      unseenUsersCount.value = 0
    }
  }

  const syncSubscription = () => {
    if (isAdmin.value && isAuthenticated.value) {
      startSubscription()
    } else {
      stopSubscription()
    }
  }

  watch(
    [isAdmin, isAuthenticated],
    () => {
      syncSubscription()
    },
    { immediate: true }
  )

  return {
    unseenUsersCount,
    stopSubscription,
    startSubscription
  }
}
