import { ref } from 'vue'

const confirmState = ref({
  show: false,
  title: '',
  message: '',
  tone: 'default',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  resolve: null,
})

export const useConfirm = () => {
  /**
   * @param {string} message
   * @param {string} [title]
   * @param {{ tone?: 'default' | 'danger', confirmLabel?: string, cancelLabel?: string }} [options]
   *   tone 'danger' renders the destructive (rose) variant and defaults the
   *   confirm button to "Delete".
   */
  const confirm = (message, title = 'Are you sure?', options = {}) => {
    const tone = options.tone === 'danger' ? 'danger' : 'default'

    confirmState.value = {
      show: true,
      title,
      message,
      tone,
      confirmLabel: options.confirmLabel || (tone === 'danger' ? 'Delete' : 'Confirm'),
      cancelLabel: options.cancelLabel || 'Cancel',
    }

    return new Promise((resolve) => {
      confirmState.value.resolve = resolve
    })
  }

  const settle = (result) => {
    const { resolve } = confirmState.value
    confirmState.value.show = false
    confirmState.value.resolve = null
    if (resolve) resolve(result)
  }

  const onConfirm = () => settle(true)
  const onCancel = () => settle(false)

  return { confirmState, confirm, onConfirm, onCancel }
}
