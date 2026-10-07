<template>
  <AppShell subtitle="Premium collection for your lifestyle">
    <!-- Header Section — minimalist -->
    <section class="mx-auto w-full max-w-5xl px-2 pt-4 sm:px-6 sm:pt-8">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Our collection</p>
          <h1 class="mt-3 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">Shop catalog</h1>
          <div class="mt-5 h-px w-12 bg-neutral-900 dark:bg-white"></div>
          <p class="mt-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            Discover {{ loading ? '…' : filteredProducts.length }} premium items handpicked for you.
          </p>
        </div>
        <div class="relative w-full lg:max-w-xs">
          <Search
            class="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-400"
            :size="16"
            stroke-width="1.5"
          />
          <input
            v-model="query"
            type="text"
            placeholder="Search products..."
            class="w-full border-0 border-b border-neutral-200 bg-transparent py-2.5 pl-7 pr-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
          />
        </div>
      </div>
    </section>

    <!-- Main Content Grid -->
    <section class="mx-auto mt-10 grid w-full max-w-5xl gap-10 px-2 sm:px-6 lg:grid-cols-[200px_1fr]">
      <!-- Category Sidebar/Top Bar — minimalist -->
      <aside class="lg:sticky lg:top-24 lg:h-fit">
        <p class="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 lg:block dark:text-neutral-500">Filter</p>
        <div class="mt-0 flex gap-6 overflow-x-auto border-b border-neutral-200 pb-0 scrollbar-hide lg:mt-4 lg:flex-col lg:gap-0 lg:border-b-0 dark:border-neutral-800">
          <button
            type="button"
            class="shrink-0 border-b-2 border-transparent pb-3 text-sm transition-colors lg:border-b-0 lg:border-l-2 lg:pb-0 lg:pl-4 lg:py-2 lg:text-left"
            :class="selectedCategory === ''
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'"
            @click="selectedCategory = ''"
          >
            All
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            class="shrink-0 border-b-2 border-transparent pb-3 text-sm transition-colors lg:border-b-0 lg:border-l-2 lg:pb-0 lg:pl-4 lg:py-2 lg:text-left"
            :class="selectedCategory === category.id
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'"
            @click="selectedCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>
      </aside>

      <!-- Product Grid — minimalist -->
      <div v-if="loading" class="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
        <div v-for="i in 6" :key="i" class="space-y-4">
          <div class="aspect-4/5 w-full animate-pulse bg-neutral-200/70 dark:bg-neutral-800"></div>
          <div class="h-3 w-2/3 animate-pulse bg-neutral-200/70 dark:bg-neutral-800"></div>
          <div class="h-3 w-1/3 animate-pulse bg-neutral-200/70 dark:bg-neutral-800"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
        <article
          v-for="product in pagedProducts"
          :key="product.id"
          class="group flex flex-col"
        >
          <router-link
            :to="`/shop/product/${product.id}`"
            class="relative block aspect-4/5 w-full overflow-hidden border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800"
          >
            <img
              v-if="product.base64Image"
              :src="product.base64Image"
              :alt="product.name"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div v-else class="flex h-full items-center justify-center text-neutral-300 dark:text-neutral-600">
              <Image :size="28" stroke-width="1.5" />
            </div>
          </router-link>

          <div class="flex flex-1 flex-col pt-4">
            <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">{{ categoryName(product.categoryId) || 'New' }}</p>
            <router-link :to="`/shop/product/${product.id}`" class="mt-1 block">
              <h2 class="line-clamp-1 text-sm font-medium text-neutral-900 transition-colors group-hover:text-neutral-500 dark:text-white">
                {{ product.name }}
              </h2>
            </router-link>
            <div class="mt-2 flex items-baseline gap-3">
              <p class="text-sm text-neutral-900 dark:text-white">{{ formatCurrency(product.studentPrice) }}</p>
              <p class="text-xs text-neutral-400 line-through dark:text-neutral-500">{{ formatCurrency(product.nonStudentPrice) }}</p>
            </div>
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ product.variants?.length || 0 }} {{ product.variants?.length === 1 ? 'style' : 'styles' }}</p>
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

      <Pagination class="lg:col-span-2" :page="page" :total-pages="totalPages" :total-items="filteredProducts.length" @update:page="goToPage" />
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
