<template>
  <header class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div class="min-w-0 max-w-2xl">
      <p v-if="eyebrow" class="store-eyebrow">{{ eyebrow }}</p>
      <h1 class="store-title mt-3">{{ title }}</h1>
      <div class="store-rule mt-5"></div>
      <p v-if="description || $slots.description" class="mt-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
        <slot name="description">{{ description }}</slot>
      </p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 items-center gap-3">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
// Storefront twin of AdminPageHead: every customer page opens with the same
// eyebrow → title → rule rhythm.
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>
