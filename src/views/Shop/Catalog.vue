<template>
  <AppShell subtitle="Find the right fit, fast">
    <section class="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-lg">
      <div class="grid gap-6 px-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-amber-300">SCF collections</p>
          <h1 class="mt-4 text-4xl font-bold leading-tight lg:text-5xl">
            Shop curated pieces with size + color variants.
          </h1>
          <p class="mt-4 max-w-xl text-sm text-slate-300">
            Search, filter by category, and pick the exact variant you want. Everything is backed by Firestore, including base64 product images.
          </p>
        </div>

        <div class="rounded-3xl bg-white/10 p-5">
          <label class="block">
            <span class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">Search</span>
            <input
              v-model="query"
              type="text"
              placeholder="Try 'jacket', 'linen', 'cream'..."
              class="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-300 outline-none focus:border-white/30"
            />
          </label>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition"
              :class="selectedCategory === '' ? 'bg-white text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'"
              @click="selectedCategory = ''"
            >
              All
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              class="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition"
              :class="selectedCategory === category.id ? 'bg-white text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'"
              @click="selectedCategory = category.id"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-10 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-sm text-slate-500">Results</p>
        <h2 class="mt-1 text-2xl font-bold text-slate-900">
          {{ filteredProducts.length }} products
        </h2>
      </div>
      <p class="text-sm text-slate-500">
        Tip: add images in the admin panel for a premium look.
      </p>
    </section>

    <div v-if="loading" class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="i in 6" :key="i" class="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div class="h-56 w-full animate-pulse bg-slate-200"></div>
        <div class="space-y-3 p-6">
          <div class="h-4 w-32 animate-pulse rounded bg-slate-200"></div>
          <div class="h-6 w-44 animate-pulse rounded bg-slate-200"></div>
          <div class="h-4 w-full animate-pulse rounded bg-slate-200"></div>
          <div class="h-4 w-2/3 animate-pulse rounded bg-slate-200"></div>
          <div class="h-10 w-36 animate-pulse rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>

    <div v-else class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="product in filteredProducts"
        :key="product.id"
        class="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div class="h-56 w-full bg-slate-200">
          <img
            v-if="product.base64Image"
            :src="product.base64Image"
            :alt="product.name"
            class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
            No image
          </div>
        </div>

        <div class="p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {{ categoryName(product.categoryId) || 'Uncategorized' }}
              </p>
              <h2 class="mt-2 line-clamp-2 text-xl font-semibold text-slate-900">
                {{ product.name }}
              </h2>
            </div>
            <span class="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {{ product.status || 'active' }}
            </span>
          </div>

          <p class="mt-4 line-clamp-3 text-sm text-slate-600">
            {{ product.description }}
          </p>

          <div class="mt-5 flex items-center justify-between">
            <p class="text-lg font-bold text-slate-900">
              {{ formatCurrency(product.basePrice) }}
            </p>
            <p class="text-sm text-slate-500">
              {{ product.variants?.length || 0 }} variants
            </p>
          </div>

          <router-link
            :to="`/shop/product/${product.id}`"
            class="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View product
          </router-link>
        </div>
      </article>

      <div
        v-if="!filteredProducts.length"
        class="md:col-span-2 xl:col-span-3 rounded-3xl bg-white p-10 text-center text-slate-600 shadow-sm ring-1 ring-slate-200"
      >
        No products match your search. Try a different keyword or clear the filters.
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppShell from '../../components/AppShell.vue'
import { ensureDemoCatalog, listCategories, listProducts } from '../../services/catalogService'
import { formatCurrency } from '../../utils/format'

const loading = ref(true)
const categories = ref([])
const products = ref([])
const selectedCategory = ref('')
const query = ref('')

const loadCatalog = async () => {
  loading.value = true
  await ensureDemoCatalog()
  categories.value = await listCategories()
  products.value = await listProducts()
  loading.value = false
}

const filteredProducts = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()

  if (!selectedCategory.value) {
    return products.value.filter((product) => {
      if (!normalizedQuery) return true
      return (
        product.name?.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery)
      )
    })
  }

  return products.value
    .filter((product) => product.categoryId === selectedCategory.value)
    .filter((product) => {
      if (!normalizedQuery) return true
      return (
        product.name?.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery)
      )
    })
})

const categoryName = (categoryId) =>
  categories.value.find((category) => category.id === categoryId)?.name || ''

onMounted(loadCatalog)
</script>
