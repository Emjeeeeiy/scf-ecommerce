import { ref } from 'vue'

const toasts = ref([])
// Monotonic ids: Date.now() collided when two toasts fired in the same ms.
let nextId = 0

export const useToast = () => {
  // Errors stay up longer than confirmations so they can actually be read.
  const addToast = (message, type = 'success', duration) => {
    const id = ++nextId
    const toast = { id, message, type }
    toasts.value.push(toast)

    const ms = duration ?? (type === 'error' ? 5000 : 3500)
    if (ms > 0) {
      setTimeout(() => {
        removeToast(id)
      }, ms)
    }
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    removeToast,
  }
}
