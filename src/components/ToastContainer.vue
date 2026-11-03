<template>
  <div
    class="pointer-events-none fixed inset-x-4 top-4 z-9999 flex flex-col gap-3 sm:inset-x-auto sm:right-6 sm:top-6 sm:w-96"
    aria-live="polite"
  >
    <TransitionGroup
      name="toast"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-2 opacity-0 sm:translate-x-8 sm:translate-y-0"
      enter-to-class="translate-x-0 translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="opacity-0 sm:translate-x-8"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :role="toast.type === 'error' ? 'alert' : 'status'"
        class="pointer-events-auto flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          :class="{
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400': toast.type === 'success',
            'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400': toast.type === 'error',
            'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400': toast.type === 'warning',
            'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400': toast.type === 'info',
          }"
        >
          <CheckCircle2 v-if="toast.type === 'success'" :size="18" />
          <AlertCircle v-else-if="toast.type === 'error'" :size="18" />
          <AlertTriangle v-else-if="toast.type === 'warning'" :size="18" />
          <Info v-else :size="18" />
        </div>

        <p class="flex-1 pt-1.5 text-[13px] font-semibold leading-snug text-neutral-900 dark:text-white">{{ toast.message }}</p>

        <button
          type="button"
          aria-label="Dismiss notification"
          class="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          @click="removeToast(toast.id)"
        >
          <X :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-vue-next'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-move {
  transition: all 0.3s ease;
}
</style>
