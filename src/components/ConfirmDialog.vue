<template>
  <ModalShell
    :open="confirmState.show"
    size="sm"
    :z-index="10000"
    labelledby="confirm-dialog-title"
    @close="onCancel"
  >
    <div class="p-6 text-center">
      <div
        class="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg"
        :class="isDanger
          ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
          : 'bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400'"
      >
        <AlertTriangle v-if="isDanger" :size="22" />
        <HelpCircle v-else :size="24" />
      </div>
      <h3 id="confirm-dialog-title" class="font-heading text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
        {{ confirmState.title }}
      </h3>
      <p class="mt-3 text-sm font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
        {{ confirmState.message }}
      </p>
    </div>

    <div class="flex border-t border-neutral-100 dark:border-neutral-800">
      <!-- Focus starts on Cancel so Enter never confirms a destructive action by accident. -->
      <button
        type="button"
        data-autofocus
        class="flex-1 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        @click="onCancel"
      >
        {{ confirmState.cancelLabel }}
      </button>
      <div class="w-px bg-neutral-100 dark:bg-neutral-800"></div>
      <button
        type="button"
        class="flex-1 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors"
        :class="isDanger
          ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10'
          : 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10'"
        @click="onConfirm"
      >
        {{ confirmState.confirmLabel }}
      </button>
    </div>
  </ModalShell>
</template>

<script setup>
import { computed } from 'vue'
import { AlertTriangle, HelpCircle } from 'lucide-vue-next'
import ModalShell from './ModalShell.vue'
import { useConfirm } from '../composables/useConfirm'

const { confirmState, onConfirm, onCancel } = useConfirm()
const isDanger = computed(() => confirmState.value.tone === 'danger')
</script>
