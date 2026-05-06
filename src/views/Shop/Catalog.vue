<template>
  <AppShell subtitle="Premium collection for your lifestyle">
    <!-- Header Section -->
    <section class="relative overflow-hidden rounded-2xl bg-slate-900 p-6 sm:p-10">
      <div class="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div class="space-y-1.5">
          <p class="text-[9px] font-black uppercase tracking-[0.3em] text-amber-400">Our Collection</p>
          <h1 class="text-2xl font-black tracking-tight text-white sm:text-4xl">Shop Catalog</h1>
          <p class="text-[10px] sm:text-xs text-slate-400 font-medium">Discover {{ filteredProducts.length }} premium items handpicked for you.</p>
        </div>
        
        <div class="relative w-full lg:max-w-md">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" :size="18" />
          <input
            v-model="query"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-xl bg-white/5 border border-white/10 px-12 py-3 text-xs text-white placeholder:text-slate-500 outline-none focus:bg-white/10 focus:border-amber-400/50 transition-all shadow-inner backdrop-blur-sm"
          />
        </div>
      </div>
      <!-- Background accents -->
      <div class="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl"></div>
      <div class="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"></div>
    </section>

    <!-- Main Content Grid -->
    <section class="mt-6 sm:mt-10 grid gap-6 lg:grid-cols-[240px_1fr]">
      <!-- Category Sidebar/Top Bar -->
      <aside class="sticky top-16 z-30 -mx-4 px-4 bg-slate-50/80 backdrop-blur-md py-1 lg:sticky lg:top-24 lg:h-fit lg:p-0 lg:bg-transparent lg:backdrop-blur-none lg:mx-0">
        <div class="rounded-2xl bg-white p-2 lg:p-6 border border-slate-300 lg:border-slate-300 ring-1 ring-slate-100">
          <div class="hidden lg:flex items-center gap-2 mb-6">
            <Filter :size="16" class="text-slate-900" />
            <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Filter By Category</p>
          </div>
          
          <div class="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0 scrollbar-hide">
            <button
              type="button"
              class="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-[10px]  border border-slate-300 font-black uppercase tracking-widest transition-all lg:w-full lg:rounded-lg lg:py-2.5"
              :class="selectedCategory === '' ? 'bg-slate-900 text-white ' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'"
              @click="selectedCategory = ''"
            >
              <LayoutGrid :size="14" />
              <span>All</span>
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              class="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-[10px] border border-slate-300 font-black uppercase tracking-widest transition-all lg:w-full lg:rounded-lg lg:py-2.5"
              :class="selectedCategory === category.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'"
              @click="selectedCategory = category.id"
            >
              <Tag :size="14" />
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Product Grid -->
      <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="i in 6" :key="i" class="overflow-hidden rounded-3xl bg-white p-1.5 ring-1 ring-slate-100">
          <div class="h-48 w-full animate-pulse rounded-2xl bg-slate-100"></div>
          <div class="space-y-3 p-4 sm:p-6">
            <div class="h-3 w-20 animate-pulse rounded bg-slate-100"></div>
            <div class="h-6 w-40 animate-pulse rounded bg-slate-100"></div>
            <div class="h-10 w-full animate-pulse rounded-xl bg-slate-100"></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 px-4 py-6">  
        <article
          v-for="product in filteredProducts"
          :key="product.id"
          class="group relative flex flex-col bg-white"
        >
          <!-- Image Section: Clickable Link -->
          <router-link 
            :to="`/shop/product/${product.id}`"
            class="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-gray-100 border border-slate-300 block"
          >
            <img
              v-if="product.base64Image"
              :src="product.base64Image"
              :alt="product.name"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <!-- Fallback Placeholder -->
            <div v-else class="flex h-full items-center justify-center text-gray-300">
              <Image :size="40" stroke-width="1.5" />
            </div>

            <!-- Category Badge -->
            <div class="absolute left-2 top-2 sm:left-3 sm:top-3">
              <span class="rounded-full bg-white/80 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium backdrop-blur-md text-gray-900 shadow-sm">
                {{ categoryName(product.categoryId) || 'New' }}
              </span>
            </div>
            
            <!-- Overlay: Desktop Only (Hidden on Mobile) -->
            <div class="absolute inset-0 hidden sm:flex items-end justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/5">
              <div class="w-full rounded-xl bg-slate-800/90 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                View Details
              </div>
            </div>
          </router-link>

          <!-- Content Section -->
          <div class="flex flex-1 flex-col pt-3">
            <div class="flex flex-col gap-1">
              <div class="flex items-start justify-between gap-2">
                <!-- Product Name Link -->
                <router-link :to="`/shop/product/${product.id}`" class="block flex-1">
                  <h2 class="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-slate-600 transition-colors line-clamp-1">
                    {{ product.name }}
                  </h2>
                </router-link>
                
                <p class="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                  {{ formatCurrency(product.basePrice) }}
                </p>
              </div>
              
              <p class="line-clamp-1 text-[10px] sm:text-[11px] text-gray-500">
                {{ product.description }}
              </p>
            </div>

            <!-- Variant/Style Footer -->
            <div class="mt-2 flex items-center gap-2">
              <div class="flex -space-x-1">
                <div 
                  v-for="n in Math.min(product.variants?.length || 0, 3)" 
                  :key="n" 
                  class="h-2 w-2 rounded-full border border-white bg-slate-300"
                ></div>
              </div>
              <span class="text-[9px] sm:text-[10px] text-gray-400 font-medium">
                {{ product.variants?.length || 0 }} {{ product.variants?.length === 1 ? 'Style' : 'Styles' }}
              </span>
            </div>
          </div>
        </article>

        <!-- Empty State -->
        <div
          v-if="!filteredProducts.length"
          class="col-span-full rounded-3xl bg-white p-12 text-center shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-16"
        >
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-200 shadow-inner mb-6">
            <SearchX :size="32" />
          </div>
          <h3 class="text-xl font-black text-slate-900 tracking-tight">No products found</h3>
          <p class="mt-2 text-xs text-slate-400 font-medium max-w-xs mx-auto">We couldn't find any items matching your search or filters. Try another keyword!</p>
          <button 
            @click="query = ''; selectedCategory = ''"
            class="mt-8 rounded-full bg-slate-100 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-900 hover:text-white active:scale-95"
          >
            Clear All Filters
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
