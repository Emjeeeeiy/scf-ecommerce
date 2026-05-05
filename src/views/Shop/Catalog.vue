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
      <!-- Category Sidebar -->
      <aside class="lg:sticky lg:top-24 lg:h-fit">
        <div class="rounded-2xl bg-white p-4 lg:p-6 border border-slate-300 ring-1 ring-slate-100">
          <div class="hidden lg:flex items-center gap-2 mb-6">
            <Filter :size="16" class="text-slate-900" />
            <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Filter By Category</p>
          </div>
          
          <div class="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 scrollbar-hide">
            <button
              type="button"
              class="flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all lg:w-full"
              :class="selectedCategory === '' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'"
              @click="selectedCategory = ''"
            >
              <LayoutGrid :size="14" />
              <span>All Items</span>
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              class="flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all lg:w-full"
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

      <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="product in filteredProducts"
          :key="product.id"
          class="group flex flex-col overflow-hidden rounded-3xl bg-white p-1.5 ring-1 ring-slate-100 border border-slate-300 "
        >
          <!-- Image Section -->
          <div class="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-50">
            <img
              v-if="product.base64Image"
              :src="product.base64Image"
              :alt="product.name"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full items-center justify-center text-slate-300">
              <Image :size="32" />
            </div>
            <div class="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-slate-900 backdrop-blur-md shadow-lg">
              {{ categoryName(product.categoryId) || 'New Arrival' }}
            </div>
          </div>

          <!-- Content Section -->
          <div class="flex flex-1 flex-col p-4 sm:p-5">
            <div class="flex-1 space-y-2">
              <h2 class="line-clamp-1 text-base font-black tracking-tight text-slate-900 group-hover:text-amber-500 transition-colors">
                {{ product.name }}
              </h2>
              <p class="line-clamp-2 text-xs leading-relaxed text-slate-400 font-medium">
                {{ product.description }}
              </p>
            </div>

            <div class="mt-5">
              <div class="flex items-center justify-between border-t border-slate-50 pt-4">
                <div>
                  <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Price</p>
                  <p class="text-lg font-black text-slate-900 tracking-tighter">
                    {{ formatCurrency(product.basePrice) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Styles</p>
                  <p class="text-xs font-black text-slate-900 uppercase tracking-tighter">{{ product.variants?.length || 0 }} Options</p>
                </div>
              </div>

              <router-link
                :to="`/shop/product/${product.id}`"
                class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 active:scale-95"
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
