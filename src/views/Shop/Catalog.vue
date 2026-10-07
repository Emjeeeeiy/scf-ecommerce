<template>
  <AppShell subtitle="Premium collection for your lifestyle">
    <!-- Header Section -->
    <section class="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-8 lg:px-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Our collection</p>
          <h1 class="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">Shop catalog</h1>
          <div class="mt-5 h-px w-12 bg-neutral-900 dark:bg-white"></div>
          <p class="mt-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            Discover {{ loading ? '…' : filteredProducts.length }} premium items handpicked for you.
          </p>
        </div>
      </div>

      <!-- Toolbar: search + horizontal category pills -->
      <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative w-full sm:max-w-xs">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            :size="16"
            stroke-width="1.5"
          />
          <input
            v-model="query"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-9 pr-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-neutral-500 dark:focus:ring-neutral-800"
          />
        </div>

        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            type="button"
            class="shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors"
            :class="selectedCategory === ''
              ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
              : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-white'"
            @click="selectedCategory = ''"
          >
            All
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            class="shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors"
            :class="selectedCategory === category.id
              ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
              : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-white'"
            @click="selectedCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Product Grid -->
    <section class="mx-auto mt-10 w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div v-if="loading" class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="i in 8" :key="i" class="space-y-4">
          <div class="aspect-[4/5] w-full animate-pulse rounded-xl bg-neutral-200/70 dark:bg-neutral-800"></div>
          <div class="h-3 w-2/3 animate-pulse rounded bg-neutral-200/70 dark:bg-neutral-800"></div>
          <div class="h-3 w-1/3 animate-pulse rounded bg-neutral-200/70 dark:bg-neutral-800"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <article
          v-for="product in pagedProducts"
          :key="product.id"
          class="group flex flex-col"
        >
          <router-link
            :to="`/shop/product/${product.id}`"
            class="relative block aspect-[4/5] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
          >
            <img
              v-if="product.base64Image"
              :src="product.base64Image"
              :alt="product.name"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div v-else class="flex h-full items-center justify-center text-neutral-300 dark:text-neutral-600">
              <Image :size="28" stroke-width="1.5" />
            </div>
            <div class="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-neutral-900/70 py-3 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0 dark:bg-white/80 dark:text-neutral-900">
              Quick View
            </div>
          </router-link>

          <div class="flex flex-1 flex-col pt-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{{ categoryName(product.categoryId) || 'New' }}</p>
            <router-link :to="`/shop/product/${product.id}`" class="mt-1 block">
              <h2 class="line-clamp-1 text-base font-bold text-neutral-900 transition-colors group-hover:text-black dark:text-white">
                {{ product.name }}
              </h2>
            </router-link>
            <div class="mt-2 flex items-baseline">
              <p class="text-sm font-semibold text-neutral-900 dark:text-white">{{ formatCurrency(product.studentPrice) }}</p>
              <p class="ml-2 text-xs text-neutral-400 line-through dark:text-neutral-500">{{ formatCurrency(product.nonStudentPrice) }}</p>
            </div>
            <p class="mt-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">{{ product.variants?.length || 0 }} {{ product.variants?.length === 1 ? 'style' : 'styles' }}</p>
          </div>
        </article>

        <!-- Empty State -->
        <div
          v-if="!filteredProducts.length"
          class="col-span-full border border-neutral-200 bg-white p-12 text-center sm:p-16 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 class="text-xl font-medium tracking-tight text-neutral-900 dark:text-white">No products found</h3>
          <div class="mx-auto mt-5 h-px w-12 bg-neutral-300 dark:bg-neutral-700"></div>
          <p class="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">We couldn't find any items matching your search or filters.</p>
          <button
            @click="query = ''; selectedCategory = ''"
            class="mt-8 bg-neutral-900 px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Clear all filters
          </button>
        </div>
      </div>

      <Pagination class="mt-8" :page="page" :total-pages="totalPages" :total-items="filteredProducts.length" @update:page="goToPage" />
    </section>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AppShell from '../../components/AppShell.vue'
import Pagination from '../../components/Pagination.vue'
import { useCatalogStore } from '../../stores/catalogStore'
import { useSearchFilter } from '../../composables/useSearchFilter'
import { usePagination } from '../../composables/usePagination'
import { formatCurrency } from '../../utils/format'
import { useSession } from '../../composables/useSession'
import {
  Search,
  Image
} from 'lucide-vue-next'

const { profile, isAuthenticated } = useSession()
const isStudent = computed(() => profile.value?.isStudent || false)

const { products, categories, productsLoading: loading, loadCatalog, seedDemoCatalog, categoryName } = useCatalogStore()
const selectedCategory = ref('')

const categoryFiltered = computed(() =>
  selectedCategory.value
    ? products.value.filter((product) => product.categoryId === selectedCategory.value)
    : products.value,
)
const { query, filtered: filteredProducts } = useSearchFilter(categoryFiltered, (product) => [
  product.name,
  product.description,
])

const { page, totalPages, paged: pagedProducts, goToPage, resetPage } = usePagination(filteredProducts, 24)
watch([query, selectedCategory], resetPage)

onMounted(async () => {
  try {
    await seedDemoCatalog()
  } catch (e) {
    console.warn('Demo catalog seeding skipped or failed:', e.message)
  }
  await loadCatalog()
})
</script>
