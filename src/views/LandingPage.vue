<template>
  <AppShell subtitle="Firebase Auth + Firestore powered storefront">
    <section class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
        <p class="mb-3 text-sm uppercase tracking-[0.3em] text-amber-300">
          New collection
        </p>
        <h1 class="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
          A Firebase-native clothing store built around users, products, carts, and orders.
        </h1>
        <p class="mt-4 max-w-2xl text-slate-300">
          Browse categories, choose size and color variants, manage your cart, checkout with saved addresses, and use the admin area to manage the catalog.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <router-link
            to="/shop"
            class="rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-300"
          >
            Browse products
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            to="/register"
            class="rounded-full border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Create account
          </router-link>
          <router-link
            v-else-if="isAdmin"
            to="/admin/dashboard"
            class="rounded-full border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Open admin
          </router-link>
          <router-link
            v-else
            to="/account/orders"
            class="rounded-full border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            View orders
          </router-link>
        </div>
      </div>

      <div class="grid gap-4">
        <div class="rounded-3xl bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Data model</p>
          <h2 class="mt-2 text-xl font-semibold text-slate-900">Firestore collections</h2>
          <ul class="mt-4 space-y-2 text-sm text-slate-600">
            <li>`users/{uid}` and `addresses` subcollection</li>
            <li>`categories` and `products` with `variants` subcollections</li>
            <li>`carts/{uid}/items` for active shopping carts</li>
            <li>`orders/{orderId}/items` for completed checkouts</li>
          </ul>
        </div>

        <div class="rounded-3xl bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Access</p>
          <h2 class="mt-2 text-xl font-semibold text-slate-900">Role-based flows</h2>
          <p class="mt-4 text-sm text-slate-600">
            Customers can shop, manage addresses, and place orders. Admin users are identified from Firestore profile documents and can manage categories, products, and order statuses.
          </p>
        </div>
      </div>
    </section>
  </AppShell>
</template>

<script setup>
import AppShell from '../components/AppShell.vue'
import { useSession } from '../composables/useSession'

const { isAuthenticated, isAdmin } = useSession()
</script>