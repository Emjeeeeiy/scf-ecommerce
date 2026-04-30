<template>
  <AppShell subtitle="Premium collection for your lifestyle">
    <!-- Header Section with Search -->
    <section class="relative overflow-hidden rounded-2xl bg-slate-900 p-6 sm:p-10 shadow-2xl">
      <div class="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div class="space-y-1">
          <h1 class="text-2xl font-black tracking-tighter text-white sm:text-4xl">Our Catalog</h1>
          <p class="text-xs sm:text-sm text-slate-400 font-medium">Discover {{ filteredProducts.length }} premium items.</p>
        </div>
        
        <div class="relative w-full lg:max-w-md">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" :size="18" />
          <input
            v-model="query"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-xl bg-white/10 border border-white/10 px-11 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none focus:bg-white/20 focus:border-white/20 transition-all shadow-inner"
          />
        </div>
      </div>
      <!-- Background accents -->
      <div class="absolute -right-10 -top-10 h-32 w-32 sm:h-64 sm:w-64 rounded-full bg-amber-400/10 blur-3xl"></div>
      <div class="absolute -left-10 -bottom-10 h-32 w-32 sm:h-64 sm:w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
    </section>

    <!-- Main Content Grid -->
    <section class="mt-6 sm:mt-10 grid gap-6 lg:grid-cols-[240px_1fr]">
      <!-- Enhanced Category Sidebar -->
      <aside class="lg:sticky lg:top-28 lg:h-fit">
        <div class="rounded-2xl bg-white p-4 lg:p-8 shadow-sm ring-1 ring-slate-100">
          <div class="hidden lg:flex items-center gap-2 mb-6">
            <Filter :size="16" class="text-slate-900" />
            <p class="text-xs font-black uppercase tracking-widest text-slate-900">Categories</p>
          </div>
          
          <!-- Mobile categories: horizontal scroll -->
          <!-- Desktop categories: vertical list -->
          <div class="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0 scrollbar-hide">
            <button
              type="button"
              class="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold lg:w-full lg:text-sm lg:px-5 lg:py-3"
              :class="selectedCategory === '' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-slate-50 text-slate-500'"
              @click="selectedCategory = ''"
            >
              <LayoutGrid :size="14" />
              <span>All Items</span>
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              class="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold lg:w-full lg:text-sm lg:px-5 lg:py-3"
              :class="selectedCategory === category.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-slate-50 text-slate-500'"
              @click="selectedCategory = category.id"
            >
              <Tag :size="14" />
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Optimized Product Grid -->
      <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6 lg:gap-8">
        <div v-for="i in 6" :key="i" class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div class="h-52 w-full animate-pulse bg-slate-100 sm:h-64"></div>
          <div class="space-y-4 p-6 sm:p-8">
            <div class="h-4 w-24 animate-pulse rounded bg-slate-100"></div>
            <div class="h-8 w-48 animate-pulse rounded bg-slate-100"></div>
            <div class="h-12 w-full animate-pulse rounded-xl bg-slate-100"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6 lg:gap-8">
        <article
          v-for="product in filteredProducts"
          :key="product.id"
          class="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100"
        >
          <!-- Image Section -->
          <div class="relative h-52 w-full overflow-hidden bg-slate-50 sm:h-64">
            <img
              v-if="product.base64Image"
              :src="product.base64Image"
              :alt="product.name"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full items-center justify-center text-[10px] font-bold text-slate-300">
              NO IMAGE
            </div>
            <div class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-900 backdrop-blur-md shadow-sm">
              {{ categoryName(product.categoryId) || 'Uncategorized' }}
            </div>
          </div>

          <!-- Content Section -->
          <div class="flex flex-1 flex-col p-5 sm:p-8">
            <div class="flex-1">
              <h2 class="line-clamp-2 text-base font-black tracking-tight text-slate-900 sm:text-xl">
                {{ product.name }}
              </h2>
              <p class="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-500 font-medium sm:text-sm">
                {{ product.description }}
              </p>
            </div>

            <div class="mt-6">
              <div class="flex items-center justify-between border-t border-slate-50 pt-5">
                <div>
                  <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Price</p>
                  <p class="text-lg font-black text-slate-900 sm:text-2xl">
                    {{ formatCurrency(product.basePrice) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Styles</p>
                  <p class="text-[13px] font-bold text-slate-900 sm:text-sm">{{ product.variants?.length || 0 }}</p>
                </div>
              </div>

              <router-link
                :to="`/shop/product/${product.id}`"
                class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-xs font-black text-white shadow-lg shadow-slate-900/10 sm:text-sm"
              >
                <span>View Details</span>
                <ArrowRight :size="16" />
              </router-link>
            </div>
          </div>
        </article>

        <!-- Empty State -->
        <div
          v-if="!filteredProducts.length"
          class="col-span-full rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-100 sm:p-20"
        >
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-6">
            <SearchX :size="32" />
          </div>
          <p class="text-xl font-black text-slate-900 tracking-tight">No products found</p>
          <p class="mt-2 text-sm text-slate-500 font-medium">Try adjusting your search.</p>
          <button 
            @click="query = ''; selectedCategory = ''"
            class="mt-6 rounded-full bg-slate-100 px-6 py-2.5 text-xs font-black text-slate-900"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </section>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppShell from '../../components/AppShell.vue'
import { ensureDemoCatalog, listCategories, listProducts } from '../../services/catalogService'
import { formatCurrency } from '../../utils/format'
import { 
  Search, 
  Filter, 
  Tag, 
  LayoutGrid, 
  ArrowRight, 
  SearchX 
} from 'lucide-vue-next'

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
