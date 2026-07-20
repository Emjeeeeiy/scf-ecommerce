import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Wires up a single-consumer Firestore onSnapshot subscription for the lifetime of
 * the component that calls it: subscribes on mount, tears down on unmount, tracks
 * a loading flag until the first snapshot arrives.
 *
 * For state shared across multiple simultaneously-mounted views (e.g. orders used by
 * both the Dashboard and the Orders page), use a ref-counted store subscription instead
 * so the underlying listener isn't torn down while another consumer still needs it.
 *
 * @param {(callback: (data: any) => void) => Function} subscribeFn - starts the
 *   subscription and returns an unsubscribe function, e.g. subscribeToAllUsers
 * @param {any} initialValue - initial value of the returned data ref
 */
export function useFirestoreSubscription(subscribeFn, initialValue = []) {
  const data = ref(initialValue)
  const loading = ref(true)
  let unsubscribe = null

  onMounted(() => {
    unsubscribe = subscribeFn((next) => {
      data.value = next
      loading.value = false
    })
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  })

  return { data, loading }
}
