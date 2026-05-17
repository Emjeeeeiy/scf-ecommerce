<template>
  <AppShell subtitle="Product details">
    <div v-if="loading" class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
        <div class="h-80 w-full animate-pulse rounded-xl bg-slate-100"></div>
        <div class="space-y-4 p-6">
          <div class="h-3 w-20 animate-pulse rounded bg-slate-100"></div>
          <div class="h-8 w-56 animate-pulse rounded bg-slate-100"></div>
          <div class="h-20 w-full animate-pulse rounded-xl bg-slate-100"></div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="h-64 w-full animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm"></div>
        <div class="h-48 w-full animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm"></div>
      </div>
    </div>

    <section v-else-if="product" class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div class="relative h-80 w-full overflow-hidden rounded-xl bg-slate-50 sm:h-105">  
          <img
            v-if="product.base64Image"
            :src="product.base64Image"
            :alt="product.name"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
            <Image :size="36" stroke-width="1.5" />
            <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">No Image Available</span>
          </div>
          
          <router-link
            to="/shop"
            class="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-950"
          >
            <ArrowLeft :size="14" />
            <span>Back to Shop</span>
          </router-link>
        </div>

        <div class="px-4 py-6 sm:p-8">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="flex-1 space-y-2">
              <div class="flex items-center">
                <span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-800">
                  <Tag :size="10" />
                  Premium Collection
                </span>
              </div>
              <h1 class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {{ product.name }}
              </h1>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</p>
              <p class="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
                {{ formatCurrency(product.basePrice) }}
              </p>
            </div>
          </div>

          <div class="mt-6 border-t border-slate-100 pt-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</span>
            </div>
            <p class="text-sm leading-relaxed text-slate-600">
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>

      <aside class="space-y-6 lg:sticky lg:top-24 h-fit">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="space-y-6">
            <!-- Color Selection -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <Palette :size="14" class="text-slate-400" />
                  <h2 class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Color</h2>
                </div>
                <span v-if="selectedColor" class="text-[10px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  {{ selectedColor }}
                </span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in availableColors"
                  :key="color"
                  type="button"
                  class="relative group flex items-center justify-center min-w-[3rem] px-3 py-2 rounded-lg border transition-all duration-200"
                  :class="selectedColor === color
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
                  @click="selectedColor = color"
                >
                  <span class="text-[10px] font-bold uppercase tracking-tight">{{ color }}</span>
                </button>
              </div>
            </div>

            <!-- Size Selection (Only visible if color is selected) -->
            <div v-if="selectedColor" class="animate-in fade-in slide-in-from-top-2 duration-300">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <Layers :size="14" class="text-slate-400" />
                  <h2 class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Size</h2>
                </div>
                <span v-if="selectedSize" class="text-[10px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  {{ selectedSize }}
                </span>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="v in availableSizesForSelectedColor"
                  :key="v.id"
                  type="button"
                  class="flex flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-all duration-200"
                  :class="[
                    selectedSize === v.size
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                    v.stock <= 0 ? 'opacity-40 cursor-not-allowed bg-slate-50' : ''
                  ]"
                  :disabled="v.stock <= 0"
                  @click="selectedSize = v.size"
                >
                  <span class="text-[10px] font-bold uppercase tracking-tight">{{ v.size }}</span>
                  <span class="text-[8px] font-medium mt-0.5" :class="selectedSize === v.size ? 'text-slate-400' : 'text-slate-500'">
                    {{ v.stock > 0 ? `${v.stock}` : 'Out' }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <ShoppingBag :size="14" class="text-slate-400" />
            <h2 class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Purchase Details</h2>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-1.5">
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition shadow-sm hover:bg-slate-50 active:scale-95 disabled:opacity-50"
                :disabled="quantity <= 1"
                @click="quantity = Math.max(1, quantity - 1)"
              >
                <Minus :size="14" />
              </button>
              <div class="flex-1 text-center">
                <p class="text-lg font-bold text-slate-900">{{ quantity }}</p>
                <p class="text-[8px] font-bold uppercase tracking-widest text-slate-400">Quantity</p>
              </div>
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition shadow-sm hover:bg-slate-50 active:scale-95"
                @click="quantity = quantity + 1"
              >
                <Plus :size="14" />
              </button>
            </div>

            <div v-if="message" 
              class="flex items-start gap-2.5 rounded-xl border p-3.5 text-xs transition-all duration-300"
              :class="isSuccess ? 'border-emerald-100 bg-emerald-50/50 text-emerald-800' : 'border-amber-100 bg-amber-50/50 text-amber-800'"
            >
              <Check v-if="isSuccess" :size="14" class="shrink-0 text-emerald-600 mt-0.5" />
              <AlertCircle v-else :size="14" class="shrink-0 text-amber-600 mt-0.5" />
              <p class="font-medium leading-relaxed">{{ message }}</p>
            </div>

            <div class="grid gap-2 pt-2">
              <button
                type="button"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-xs font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.99] shadow-sm shadow-slate-950/10 disabled:opacity-70 disabled:cursor-not-allowed"
                :disabled="adding"
                @click="handleAddToCart"
              >
                <ShoppingCart v-if="!adding" :size="16" />
                <span v-else class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
                <span>{{ adding ? 'Adding to Selection...' : 'Add to Selection' }}</span>
              </button>

              <router-link
                to="/cart"
                class="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <span>View Cart</span>
                <ArrowRight :size="16" />
              </router-link>
            </div>
          </div>
        </div>
      </aside>
    </section>

    <div v-else class="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm sm:p-16">
      <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <PackageX :size="24" stroke-width="1.5" />
      </div>
      <h2 class="text-lg font-bold text-slate-900 tracking-tight">Product Not Found</h2>
      <p class="mt-1 text-xs text-slate-500 max-w-xs mx-auto">The item you are looking for might have been moved or removed from our catalog.</p>
      
      <router-link
        to="/shop"
        class="mt-6 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <ArrowLeft :size="14" />
        Return to Shop
      </router-link>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '../../components/AppShell.vue'
import { getProduct } from '../../services/catalogService'
import { addToCart } from '../../services/cartService'
import { formatCurrency } from '../../utils/format'
import { 
  ArrowLeft, 
  ArrowRight, 
  ShoppingCart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Tag, 
  Palette, 
  Layers, 
  AlertCircle, 
  Check,
  PackageX,
  Image
} from 'lucide-vue-next'

const route = useRoute()

const loading = ref(true)
const product = ref(null)
const selectedVariantId = ref('')
const quantity = ref(1)
const message = ref('')
const isSuccess = ref(false)
const adding = ref(false)

const selectedColor = ref('')
const selectedSize = ref('')

const availableColors = computed(() => {
  if (!product.value?.variants) return []
  const colors = product.value.variants.map(v => v.color || 'Standard')
  return [...new Set(colors)]
})

const availableSizesForSelectedColor = computed(() => {
  if (!product.value?.variants || !selectedColor.value) return []
  return product.value.variants
    .filter(v => (v.color || 'Standard') === selectedColor.value)
    .map(v => ({ 
      id: v.id, 
      size: v.size || 'Free size', 
      stock: v.stock 
    }))
})

watch(selectedColor, (newColor) => {
  selectedSize.value = ''
})

watch([selectedColor, selectedSize], () => {
  if (!product.value?.variants) return
  const variant = product.value.variants.find(v => 
    (v.color || 'Standard') === selectedColor.value && 
    (v.size || 'Free size') === selectedSize.value
  )
  selectedVariantId.value = variant?.id || ''
})

const loadProduct = async () => {
  loading.value = true
  product.value = await getProduct(route.params.productId)
  loading.value = false
}

const handleAddToCart = async () => {
  if (!selectedColor.value || !selectedSize.value || !selectedVariantId.value) {
    message.value = 'Please select both color and size.'
    isSuccess.value = false
    return
  }

  adding.value = true
  try {
    await addToCart({
      productId: product.value.id,
      variantId: selectedVariantId.value,
      quantity: quantity.value,
    })
    message.value = 'Item added to selection!'
    isSuccess.value = true
    
    // Reset quantity to 1 for the next selection
    quantity.value = 1
    
    // Clear message after 3 seconds
    setTimeout(() => {
      message.value = ''
      isSuccess.value = false
    }, 3000)
  } catch (error) {
    message.value = error.message || 'Unable to add item to selection.'
    isSuccess.value = false
  } finally {
    adding.value = false
  }
}

onMounted(loadProduct)
</script>
