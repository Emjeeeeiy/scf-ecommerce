<template>
  <Transition name="modal-shell">
    <div
      v-if="open"
      v-bind="$attrs"
      class="fixed inset-0 flex items-center justify-center p-4"
      :style="{ zIndex }"
    >
      <div
        class="absolute inset-0 bg-neutral-950/50 backdrop-blur-sm"
        aria-hidden="true"
        @click="onBackdropClick"
        @wheel.prevent
        @touchmove.prevent
      ></div>

      <div
        ref="panelRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="labelledby || undefined"
        :aria-label="label || undefined"
        tabindex="-1"
        class="modal-panel relative flex max-h-[90vh] w-full flex-col overflow-hidden outline-none"
        :class="[SIZES[size] || SIZES.md, panelClass]"
      >
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script>
// Modals can stack (a confirm dialog over the product editor). Only the
// topmost one reacts to Esc/Tab, and page scroll stays locked until the last
// one closes. Shared across every ModalShell instance.
const openStack = []
let nextId = 0
</script>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { getLenis } from '../utils/lenis'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  open: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  // id of the visible title, or a plain label when there is none
  labelledby: { type: String, default: '' },
  label: { type: String, default: '' },
  // Blocks Esc/backdrop dismissal, e.g. while a request is in flight.
  persistent: { type: Boolean, default: false },
  closeOnBackdrop: { type: Boolean, default: true },
  zIndex: { type: Number, default: 100 },
  panelClass: {
    type: [String, Array, Object],
    default: 'rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900',
  },
})

const emit = defineEmits(['close'])

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-none',
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const id = ++nextId
const panelRef = ref(null)
let returnFocusTo = null

const isTopmost = () => openStack[openStack.length - 1] === id

const focusables = () =>
  [...(panelRef.value?.querySelectorAll(FOCUSABLE) || [])].filter(
    (el) => el.getClientRects().length > 0,
  )

const requestClose = () => {
  if (!props.persistent) emit('close')
}

const onBackdropClick = () => {
  if (props.closeOnBackdrop) requestClose()
}

const onKeydown = (event) => {
  if (!isTopmost()) return

  if (event.key === 'Escape') {
    event.stopPropagation()
    requestClose()
    return
  }

  if (event.key !== 'Tab') return

  const items = focusables()
  if (!items.length) {
    event.preventDefault()
    panelRef.value?.focus()
    return
  }

  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  const outside = !panelRef.value?.contains(active)

  if (event.shiftKey && (active === first || outside)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault()
    first.focus()
  }
}

// Lenis drives the storefront scroll; without it (reduced motion) fall back
// to clipping the document so the page can't scroll behind the dialog.
const lockScroll = () => {
  const lenis = getLenis()
  if (lenis) lenis.stop()
  else document.documentElement.style.overflow = 'hidden'
}

const unlockScroll = () => {
  const lenis = getLenis()
  if (lenis) lenis.start()
  else document.documentElement.style.overflow = ''
}

const activate = async () => {
  if (openStack.includes(id)) return
  returnFocusTo = document.activeElement
  openStack.push(id)
  if (openStack.length === 1) lockScroll()
  document.addEventListener('keydown', onKeydown)

  await nextTick()
  const target = panelRef.value?.querySelector('[data-autofocus]') || focusables()[0] || panelRef.value
  target?.focus({ preventScroll: true })
}

const deactivate = () => {
  const index = openStack.indexOf(id)
  if (index === -1) return
  openStack.splice(index, 1)
  if (!openStack.length) unlockScroll()
  document.removeEventListener('keydown', onKeydown)

  if (returnFocusTo && document.contains(returnFocusTo)) {
    returnFocusTo.focus({ preventScroll: true })
  }
  returnFocusTo = null
}

watch(
  () => props.open,
  (isOpen) => (isOpen ? activate() : deactivate()),
  { immediate: true },
)

onBeforeUnmount(deactivate)
</script>

<style scoped>
.modal-shell-enter-active,
.modal-shell-leave-active {
  transition: opacity 0.2s ease;
}

.modal-shell-enter-active .modal-panel,
.modal-shell-leave-active .modal-panel {
  transition: transform 0.2s ease;
}

.modal-shell-enter-from,
.modal-shell-leave-to {
  opacity: 0;
}

.modal-shell-enter-from .modal-panel,
.modal-shell-leave-to .modal-panel {
  transform: translateY(6px) scale(0.98);
}
</style>
