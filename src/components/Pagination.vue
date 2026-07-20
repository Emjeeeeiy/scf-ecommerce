<template>
  <div
    v-if="totalPages > 1"
    class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-neutral-800 px-1 py-4"
  >
    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
      Page {{ page }} of {{ totalPages }}
      <span class="text-slate-300 dark:text-neutral-600">&middot;</span>
      {{ totalItems }} total
    </p>

    <div class="flex items-center gap-1.5">
      <button
        type="button"
        :disabled="page <= 1"
        class="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-neutral-300 transition hover:bg-slate-50 dark:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
        @click="$emit('update:page', page - 1)"
      >
        <ChevronLeft :size="14" />
        Prev
      </button>
      <button
        type="button"
        :disabled="page >= totalPages"
        class="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-neutral-300 transition hover:bg-slate-50 dark:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
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
