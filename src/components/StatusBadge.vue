<template>
  <span class="admin-pill" :class="getOrderStatusClasses(status)">
    {{ status || 'unknown' }}
  </span>
</template>

<script setup>
import { getOrderStatusClasses } from '../utils/format'

// One look for order status everywhere (admin tables, dashboard, customer
// order history) so a status never reads differently on two screens.
defineProps({
  status: { type: String, default: '' },
})
</script>
