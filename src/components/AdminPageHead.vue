<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div class="min-w-0">
      <p v-if="eyebrow" class="admin-eyebrow">{{ eyebrow }}</p>
      <h1 class="mt-1 font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{{ title }}</h1>
      <p v-if="description" class="admin-muted mt-1 max-w-xl">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>
