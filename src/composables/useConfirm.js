import { ref } from 'vue'

const confirmState = ref({
  show: false,
  title: '',
  message: '',
  resolve: null,
})

export const useConfirm = () => {
  const confirm = (message, title = 'Are you sure?') => {
    confirmState.value = {
      show: true,
      title,
      message,
    }

    return new Promise((resolve) => {
      confirmState.value.resolve = resolve
    })
  }

  const onConfirm = () => {
    if (confirmState.value.resolve) confirmState.value.resolve(true)
    confirmState.value.show = false
  }

  const onCancel = () => {
    if (confirmState.value.resolve) confirmState.value.resolve(false)
    confirmState.value.show = false
  }

  return { confirmState, confirm, onConfirm, onCancel }
}
