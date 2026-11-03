<template>
  <div class="flex flex-col items-center justify-center px-6 text-center" :class="compact ? 'py-10' : 'py-16'">
    <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
      <component :is="icon" :size="22" :stroke-width="1.75" />
    </div>
    <p class="text-sm font-bold text-neutral-900 dark:text-white">{{ title }}</p>
    <p v-if="hint" class="admin-muted mt-1 max-w-xs">{{ hint }}</p>
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { PackageSearch } from 'lucide-vue-next'

defineProps({
  icon: { type: [Object, Function], default: () => PackageSearch },
  title: { type: String, required: true },
  hint: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})
</script>
