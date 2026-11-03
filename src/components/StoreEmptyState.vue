<template>
  <div class="text-center" :class="bare ? 'py-16' : 'store-card px-6 py-12 sm:p-16'">
    <h2 class="store-section-title">{{ title }}</h2>
    <div class="store-rule-muted mx-auto mt-5"></div>
    <p v-if="description" class="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-8 flex flex-wrap justify-center gap-3">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  // Drop the card frame when the empty state sits inside an existing card.
  bare: { type: Boolean, default: false },
})
</script>
