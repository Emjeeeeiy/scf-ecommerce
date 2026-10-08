<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3 dark:border-neutral-800 sm:px-5"
  >
    <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
      Page {{ page }} of {{ totalPages }}
      <span class="text-neutral-300 dark:text-neutral-600">&middot;</span>
      {{ totalItems }} total
    </p>

    <div class="flex items-center gap-1.5">
      <button
        type="button"
        :disabled="page <= 1"
        class="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-bold text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        @click="$emit('update:page', page - 1)"
      >
        <ChevronLeft :size="14" />
        Prev
      </button>
      <button
        type="button"
        :disabled="page >= totalPages"
        class="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-bold text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        @click="$emit('update:page', page + 1)"
      >
        Next
        <ChevronRight :size="14" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalItems: { type: Number, required: true },
})
defineEmits(['update:page'])
</script>
