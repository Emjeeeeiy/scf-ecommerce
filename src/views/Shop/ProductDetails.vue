<template>
  <AppShell subtitle="Product details">
    <div v-if="loading" class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="overflow-hidden rounded-3xl bg-white p-1.5 shadow-sm ring-1 ring-slate-100">
        <div class="h-64 w-full animate-pulse rounded-2xl bg-slate-100"></div>
        <div class="space-y-4 p-6 sm:p-8">
          <div class="h-3 w-20 animate-pulse rounded bg-slate-100"></div>
          <div class="h-8 w-56 animate-pulse rounded bg-slate-100"></div>
          <div class="h-16 w-full animate-pulse rounded-xl bg-slate-100"></div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="h-64 w-full animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-slate-100"></div>
        <div class="h-56 w-full animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-slate-100"></div>
      </div>
    </div>

    <section v-else-if="product" class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <!-- Product Main Info -->
      <div class="overflow-hidden rounded-3xl bg-white p-1.5 border border-slate-300 ring-1 ring-slate-100">
        <div class="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-50 sm:h-96">
          <img
            v-if="product.base64Image"
            :src="product.base64Image"
            :alt="product.name"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full flex-col items-center justify-center gap-3 text-slate-300">
            <Image :size="48" />
            <span class="text-[8px] font-black uppercase tracking-[0.3em]">No Image Available</span>
          </div>
          
          <router-link
            to="/shop"
            class="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-900"
          >
            <ArrowLeft :size="16" />
            <span>Back</span>
          </router-link>
        </div>

        <div class="p-6 sm:p-8">
          <div class="flex flex-wrap items-start justify-between gap-6">
            <div class="flex-1 space-y-3">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-amber-600">
                  <Tag :size="10" />
                  Premium Collection
                </span>
              </div>
              <h1 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {{ product.name }}
              </h1>
            </div>
            <div class="text-right">
              <p class="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Price</p>
              <p class="text-2xl font-black text-slate-900 sm:text-3xl tracking-tighter">
                {{ formatCurrency(product.basePrice) }}
              </p>
            </div>
          </div>

          <div class="mt-8 border-t border-slate-50 pt-6">
            <div class="flex items-center gap-2 mb-4">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-amber-500 shadow-inner">
                <Info :size="16" />
              </div>
              <h3 class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Product Description</h3>
            </div>
            <p class="text-sm leading-relaxed text-slate-500 sm:text-base">
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Selection & Action Sidebar -->
      <aside class="space-y-6 lg:sticky lg:top-24 h-fit">
        <!-- Variant Selection -->
        <div class="rounded-3xl bg-white p-6 border border-slate-300 ring-1 ring-slate-100 sm:p-8">
          <div class="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-amber-400 shadow-lg shadow-slate-900/10">
              <Layers :size="16" />
            </div>
            <h2 class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Select Style</h2>
          </div>
          
          <div class="grid gap-3">
            <button
              v-for="variant in product.variants"
              :key="variant.id"
              type="button"
              class="group flex items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300"
              :class="selectedVariantId === variant.id
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-50 bg-slate-50 text-slate-900 hover:border-slate-200 hover:bg-white'"
              @click="selectedVariantId = variant.id"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center shadow-inner"
                  :class="selectedVariantId === variant.id ? 'bg-white/10' : 'bg-white'"
                >
                  <Palette :size="16" :class="selectedVariantId === variant.id ? 'text-amber-400' : 'text-slate-400'" />
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest">
                    {{ variant.color || 'Standard' }} / {{ variant.size || 'Free size' }}
                  </p>
                  <p class="mt-0.5 text-[8px] font-bold" :class="selectedVariantId === variant.id ? 'text-slate-400' : 'text-slate-400'">
                    {{ variant.stock }} items available
                  </p>
                </div>
              </div>
              <div 
                v-if="variant.stock > 0"
                class="rounded-full px-2 py-0.5 text-[7px] font-black uppercase tracking-widest shadow-sm"
                :class="selectedVariantId === variant.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'"
              >
                In Stock
              </div>
              <div 
                v-else
                class="rounded-full bg-rose-100 px-2 py-0.5 text-[7px] font-black uppercase tracking-widest text-rose-600 shadow-sm"
              >
                Sold Out
              </div>
            </button>
          </div>
        </div>

        <!-- Quantity & Add to Cart -->
        <div class="rounded-3xl bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
          <div class="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-amber-400 shadow-inner">
              <ShoppingBag :size="16" />
            </div>
            <h2 class="text-[9px] font-black uppercase tracking-[0.2em] text-white">Add to Cart</h2>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-between gap-4 rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-90"
                @click="quantity = Math.max(1, quantity - 1)"
              >
                <Minus :size="16" />
              </button>
              <div class="flex-1 text-center">
                <p class="text-2xl font-black text-white tracking-tighter">{{ quantity }}</p>
                <p class="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Quantity</p>
              </div>
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-90"
                @click="quantity = quantity + 1"
              >
                <Plus :size="16" />
              </button>
            </div>

            <div v-if="message" class="flex items-start gap-3 rounded-xl bg-amber-400/10 p-4 text-[10px] font-bold text-amber-400 ring-1 ring-amber-400/20 backdrop-blur-md">
              <AlertCircle :size="16" class="shrink-0" />
              <p>{{ message }}</p>
            </div>

            <div class="grid gap-3">
              <button
                type="button"
                class="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98]"
                @click="handleAddToCart"
              >
                <ShoppingCart :size="18" />
                <span>Add to Selection</span>
              </button>

              <router-link
                to="/cart"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
              >
                <span>View Cart</span>
                <ArrowRight :size="18" />
              </router-link>
            </div>
          </div>
        </div>
      </aside>
    </section>

    <div v-else class="rounded-3xl bg-white p-12 text-center shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-16">
      <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-200 shadow-inner">
        <PackageX :size="32" />
      </div>
      <h2 class="text-xl font-black text-slate-900 tracking-tight">Product Not Found</h2>
      <p class="mt-2 text-xs text-slate-400 font-medium max-w-xs mx-auto">The item you are looking for might have been moved or removed from our catalog.</p>
      <router-link
        to="/shop"
        class="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95"
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
