<template>
  <AppShell subtitle="Product details">
    <div v-if="loading" class="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div class="h-64 w-full animate-pulse bg-slate-100 sm:h-96"></div>
        <div class="space-y-4 p-8">
          <div class="h-4 w-24 animate-pulse rounded bg-slate-100"></div>
          <div class="h-10 w-64 animate-pulse rounded bg-slate-100"></div>
          <div class="h-20 w-full animate-pulse rounded-xl bg-slate-100"></div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="h-64 w-full animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"></div>
        <div class="h-48 w-full animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"></div>
      </div>
    </div>

    <section v-else-if="product" class="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <!-- Product Main Info -->
      <div class="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
        <div class="relative h-72 w-full overflow-hidden bg-slate-50 sm:h-[28rem]">
          <img
            v-if="product.base64Image"
            :src="product.base64Image"
            :alt="product.name"
            class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div v-else class="flex h-full flex-col items-center justify-center gap-4 text-slate-300">
            <Image :size="64" />
            <span class="text-[10px] font-black uppercase tracking-widest">No Image Available</span>
          </div>
          
          <router-link
            to="/shop"
            class="absolute left-6 top-6 flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2.5 text-xs font-black text-slate-900 backdrop-blur-md shadow-lg"
          >
            <ArrowLeft :size="16" />
            <span>Back</span>
          </router-link>
        </div>

        <div class="p-6 sm:p-10">
          <div class="flex flex-wrap items-start justify-between gap-6">
            <div class="flex-1 space-y-4">
              <h1 class="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {{ product.name }}
              </h1>
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <Tag :size="12" />
                  Premium Collection
                </span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Price</p>
              <p class="text-2xl font-black text-slate-900 sm:text-4xl">
                {{ formatCurrency(product.basePrice) }}
              </p>
            </div>
          </div>

          <div class="mt-8 border-t border-slate-50 pt-8">
            <h3 class="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900">
              <Info :size="16" class="text-amber-500" />
              Description
            </h3>
            <p class="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Selection & Action Sidebar -->
      <aside class="space-y-6 lg:sticky lg:top-24 h-fit">
        <!-- Variant Selection -->
        <div class="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
          <div class="flex items-center gap-2 mb-6">
            <Layers :size="18" class="text-slate-900" />
            <h2 class="text-xs font-black uppercase tracking-widest text-slate-900">Choose Style</h2>
          </div>
          
          <div class="grid gap-3">
            <button
              v-for="variant in product.variants"
              :key="variant.id"
              type="button"
              class="group flex items-center justify-between gap-4 rounded-xl border-2 p-4 text-left transition-all duration-300"
              :class="selectedVariantId === variant.id
                ? 'border-slate-900 bg-slate-950 text-white shadow-lg shadow-slate-950/20'
                : 'border-slate-50 bg-slate-50 text-slate-900 hover:border-slate-200 hover:bg-white'"
              @click="selectedVariantId = variant.id"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center"
                  :class="selectedVariantId === variant.id ? 'bg-white/10' : 'bg-white'"
                >
                  <Palette :size="18" :class="selectedVariantId === variant.id ? 'text-amber-400' : 'text-slate-400'" />
                </div>
                <div>
                  <p class="text-xs font-black uppercase tracking-tight">
                    {{ variant.color || 'Standard' }} / {{ variant.size || 'Free size' }}
                  </p>
                  <p class="text-[9px] font-bold" :class="selectedVariantId === variant.id ? 'text-slate-400' : 'text-slate-500'">
                    {{ variant.stock }} units left
                  </p>
                </div>
              </div>
              <div 
                v-if="variant.stock > 0"
                class="rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest"
                :class="selectedVariantId === variant.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'"
              >
                In Stock
              </div>
              <div 
                v-else
                class="rounded-full bg-rose-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-rose-600"
              >
                Sold Out
              </div>
            </button>
          </div>
        </div>

        <!-- Quantity & Add to Cart -->
        <div class="rounded-2xl bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div class="flex items-center gap-2 mb-6">
            <ShoppingBag :size="18" class="text-amber-400" />
            <h2 class="text-xs font-black uppercase tracking-widest text-white">Purchase</h2>
          </div>

          <div class="flex items-center justify-between gap-4 rounded-xl bg-white/10 p-2">
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-90"
              @click="quantity = Math.max(1, quantity - 1)"
            >
              <Minus :size="18" />
            </button>
            <div class="flex-1 text-center">
              <p class="text-xl font-black text-white">{{ quantity }}</p>
              <p class="text-[8px] font-black uppercase tracking-widest text-slate-500">Qty</p>
            </div>
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-90"
              @click="quantity = quantity + 1"
            >
              <Plus :size="18" />
            </button>
          </div>

          <div v-if="message" class="mt-6 flex items-start gap-3 rounded-xl bg-amber-400/10 p-4 text-xs font-bold text-amber-400 ring-1 ring-amber-400/20">
            <AlertCircle :size="16" class="shrink-0" />
            <p>{{ message }}</p>
          </div>

          <div class="mt-8 space-y-3">
            <button
              type="button"
              class="group flex w-full items-center justify-center gap-3 rounded-xl bg-amber-400 px-6 py-4 text-xs font-black text-slate-900 transition-all hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98] shadow-lg shadow-amber-400/20"
              @click="handleAddToCart"
            >
              <ShoppingCart :size="18" />
              <span>Add to Cart</span>
            </button>

            <router-link
              to="/cart"
              class="flex w-full items-center justify-center gap-3 rounded-xl bg-white/10 px-6 py-4 text-xs font-black text-white transition-all hover:bg-white/20"
            >
              View Cart
              <ArrowRight :size="18" />
            </router-link>
          </div>
        </div>
      </aside>
    </section>

    <div v-else class="rounded-2xl bg-white p-12 text-center shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-20">
      <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
        <PackageX :size="40" />
      </div>
      <h2 class="text-xl font-black text-slate-900">Product Not Found</h2>
      <p class="mt-2 text-sm text-slate-500 font-medium">The item you are looking for might have been removed.</p>
      <router-link
        to="/shop"
        class="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-xs font-black text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20"
      >
        <ArrowLeft :size="16" />
        Return to Shop
      </router-link>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from 'vue'
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
  Info, 
  Tag, 
  Palette, 
  Layers, 
  AlertCircle, 
  PackageX,
  Image
} from 'lucide-vue-next'

const route = useRoute()

const loading = ref(true)
const product = ref(null)
const selectedVariantId = ref('')
const quantity = ref(1)
const message = ref('')

const loadProduct = async () => {
  loading.value = true
  product.value = await getProduct(route.params.productId)
  selectedVariantId.value = product.value?.variants?.[0]?.id || ''
  loading.value = false
}

const handleAddToCart = async () => {
  if (!selectedVariantId.value) {
    message.value = 'Select a variant before adding to cart.'
    return
  }

  try {
    await addToCart({
      productId: product.value.id,
      variantId: selectedVariantId.value,
      quantity: quantity.value,
    })
    message.value = 'Item added to cart successfully!'
    
    // Clear message after 3 seconds
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    message.value = error.message || 'Unable to add item to cart.'
  }
}

onMounted(loadProduct)
</script>
