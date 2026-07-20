import { useConfirm } from './useConfirm'
import { useToast } from './useToast'

/**
 * Every destructive admin action followed the same shape: confirm -> try/await -> toast.
 * This collapses that boilerplate into one call so views only describe the outcome.
 */
export function useConfirmAction() {
  const { confirm } = useConfirm()
  const toast = useToast()

  const confirmAndRun = async (message, action, options = {}) => {
    const {
      title = 'Are you sure?',
      successMessage = '',
      errorMessage = 'Something went wrong. Please try again.',
    } = options

    const confirmed = await confirm(message, title)
    if (!confirmed) return false

    try {
      await action()
      if (successMessage) toast.success(successMessage)
      return true
    } catch (error) {
      console.error(error)
      toast.error(errorMessage)
      return false
    }
  }

  return { confirmAndRun }
}
