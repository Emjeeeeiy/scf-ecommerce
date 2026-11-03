<template>
  <router-view />
  <!-- Toasts and confirm dialogs are mounted globally, outside AppShell and
       AdminPanelLayout, so they need the right scope applied here: the
       storefront radius on customer pages, the admin theme on admin pages.
       The wrapper is unstyled and both children are `position: fixed`, so it
       has no layout effect. -->
  <div :class="overlayScope">
    <ToastContainer />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import { useAdminTheme } from './composables/useAdminTheme'

const route = useRoute()
const { isDarkMode } = useAdminTheme()

const isAdminRoute = computed(() =>
  route.matched.some((record) => record.meta.requiresAdmin)
)

const overlayScope = computed(() => {
  if (!isAdminRoute.value) return 'store-scope'
  return isDarkMode.value ? 'dark' : undefined
})
</script>
