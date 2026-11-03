<template>
  <div
    role="group"
    :aria-label="label"
    class="items-center overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-transparent"
    :class="block ? 'flex w-full justify-between p-1' : 'inline-flex'"
  >
    <button
      type="button"
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
      :disabled="disabled || modelValue <= min"
      :aria-label="`Decrease ${label.toLowerCase()}`"
      @click="update(modelValue - 1)"
    >
      <Minus :size="14" />
    </button>

    <div class="min-w-10 px-1 text-center" aria-live="polite">
      <p class="text-sm font-medium tabular-nums text-neutral-900 dark:text-white">{{ modelValue }}</p>
      <p v-if="caption" class="text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">{{ caption }}</p>
    </div>

    <button
      type="button"
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
      :disabled="disabled || (max !== null && modelValue >= max)"
      :aria-label="`Increase ${label.toLowerCase()}`"
      @click="update(modelValue + 1)"
    >
      <Plus :size="14" />
    </button>
  </div>
</template>

<script setup>
import { Minus, Plus } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  // null = no upper bound
  max: { type: Number, default: null },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: 'Quantity' },
  // Small caption under the number (e.g. "Qty") for the full-width variant
  caption: { type: String, default: '' },
  block: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const update = (value) => {
  const upper = props.max === null ? value : Math.min(value, props.max)
  const next = Math.max(props.min, upper)
  if (next !== props.modelValue) emit('update:modelValue', next)
}
</script>
