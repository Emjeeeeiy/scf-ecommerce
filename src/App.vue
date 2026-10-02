<template>
  <router-view />
  <!-- Toasts and confirm dialogs are mounted globally, outside AppShell, so
       they need the storefront scope applied here. The wrapper is unstyled and
       both children are `position: fixed`, so it has no layout effect. -->
  <div :class="isAdminRoute ? undefined : 'store-scope'">
    <ToastContainer />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

const route = useRoute()
const isAdminRoute = computed(() =>
  route.matched.some((record) => record.meta.requiresAdmin)
)
</script>
