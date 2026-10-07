<template>
  <AppShell subtitle="Product details">
    <div v-if="loading" class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-2  dark:border-neutral-800 dark:bg-neutral-900">
        <div class="h-80 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800"></div>
        <div class="space-y-4 p-6">
          <div class="h-3 w-20 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800"></div>
          <div class="h-8 w-56 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800"></div>
          <div class="h-20 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800"></div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="h-64 w-full animate-pulse rounded-2xl border border-neutral-100 bg-white  dark:border-neutral-800 dark:bg-neutral-900"></div>
        <div class="h-48 w-full animate-pulse rounded-2xl border border-neutral-100 bg-white  dark:border-neutral-800 dark:bg-neutral-900"></div>
      </div>
    </div>

    <section v-else-if="product" class="mx-auto grid w-full max-w-5xl gap-10 px-2 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div class="relative h-80 w-full overflow-hidden bg-neutral-100 sm:h-105 dark:bg-neutral-800">
          <img
            v-if="product.base64Image"
            :src="product.base64Image"
            :alt="product.name"
            decoding="async"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full flex-col items-center justify-center gap-2 text-neutral-300 dark:text-neutral-600">
            <Image :size="36" stroke-width="1.5" />
            <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">No Image Available</span>
          </div>

          <router-link
            to="/shop"
            class="absolute left-4 top-4 flex items-center gap-1.5 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700 transition-colors hover:text-neutral-950 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            <ArrowLeft :size="14" />
            <span>Back</span>
          </router-link>
        </div>

        <div class="p-6 sm:p-8">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Premium collection</p>
          <h1 class="mt-3 text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            {{ product.name }}
          </h1>
          <div class="mt-5 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-b border-neutral-200 pb-6 dark:border-neutral-800">
            <div>
              <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Student</p>
              <p class="mt-1 text-xl font-medium tracking-tight text-neutral-900 dark:text-white">
                {{ formatCurrency(product.studentPrice) }}
              </p>
            </div>
            <div>
              <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Regular</p>
              <p class="mt-1 text-xl font-medium tracking-tight text-neutral-500 dark:text-neutral-400">
                {{ formatCurrency(product.nonStudentPrice) }}
              </p>
            </div>
          </div>

          <div class="mt-6">
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Description</p>
            <p class="mt-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>

      <aside class="h-fit space-y-6 lg:sticky lg:top-24">
        <div class="border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div class="space-y-6">
            <!-- Color Selection -->
            <div>
              <div class="mb-3 flex items-center justify-between">
                <h2 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Color{{ selectedColor ? ` — ${selectedColor}` : '' }}</h2>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in availableColors"
                  :key="color"
                  type="button"
                  class="min-w-12 border px-3 py-2 transition-colors"
                  :class="selectedColor === color
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300'"
                  @click="selectedColor = color"
                >
                  <span class="text-xs font-medium">{{ color }}</span>
                </button>
              </div>
            </div>

            <!-- Size Selection (Only visible if color is selected) -->
            <div v-if="selectedColor">
              <div class="mb-3 flex items-center justify-between">
                <h2 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Size{{ selectedSize ? ` — ${selectedSize}` : '' }}</h2>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="v in availableSizesForSelectedColor"
                  :key="v.id"
                  type="button"
                  class="flex flex-col items-center justify-center border p-2.5 text-center transition-colors"
                  :class="[
                    selectedSize === v.size
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300',
                    v.stock <= 0 ? 'cursor-not-allowed opacity-40' : ''
                  ]"
                  :disabled="v.stock <= 0"
                  @click="selectedSize = v.size"
                >
                  <span class="text-xs font-medium">{{ v.size }}</span>
                  <span class="mt-0.5 text-[11px] text-neutral-400">
                    {{ v.stock > 0 ? `${v.stock}` : 'Out' }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Purchase</h2>

          <div class="mt-5 space-y-6">
            <!-- Price Tier Selection -->
            <div class="space-y-2">
              <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Price tier</p>
              <div class="grid gap-2">
                <button
                  @click="selectedPriceType = 'student'"
                  class="flex items-center justify-between gap-4 border p-3 transition-colors"
                  :class="selectedPriceType === 'student'
                    ? 'border-neutral-900 dark:border-white'
                    : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-700'"
                >
                  <div class="text-left">
                    <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Student</p>
                    <p class="mt-0.5 text-base font-medium text-neutral-900 dark:text-white">{{ formatCurrency(product.studentPrice) }}</p>
                  </div>
                  <div v-if="selectedPriceType === 'student'" class="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                    <Check :size="12" stroke-width="3" />
                  </div>
                </button>

                <button
                  @click="selectedPriceType = 'regular'"
                  class="flex items-center justify-between gap-4 border p-3 transition-colors"
                  :class="selectedPriceType === 'regular'
                    ? 'border-neutral-900 dark:border-white'
                    : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-700'"
                >
                  <div class="text-left">
                    <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Regular</p>
                    <p class="mt-0.5 text-base font-medium text-neutral-900 dark:text-white">{{ formatCurrency(product.nonStudentPrice) }}</p>
                  </div>
                  <div v-if="selectedPriceType === 'regular'" class="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                    <Check :size="12" stroke-width="3" />
                  </div>
                </button>
              </div>

              <div v-if="isStudent && selectedPriceType !== 'student'" class="mt-2 px-1">
                <p class="text-xs text-neutral-500">
                  You are eligible for student pricing.
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between gap-4 border border-neutral-200 p-1.5 dark:border-neutral-700">
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-neutral-800"
                :disabled="quantity <= 1"
                @click="quantity = Math.max(1, quantity - 1)"
              >
                <Minus :size="14" />
              </button>
              <div class="flex-1 text-center">
                <p class="text-base font-medium tabular-nums text-neutral-900 dark:text-white">{{ quantity }}</p>
                <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Qty</p>
              </div>
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                @click="quantity = quantity + 1"
              >
                <Plus :size="14" />
              </button>
            </div>

            <div v-if="message"
              class="flex items-start gap-2.5 border p-3.5 text-sm"
              :class="isSuccess ? 'border-neutral-300 text-neutral-800 dark:border-neutral-600 dark:text-neutral-200' : 'border-neutral-300 text-neutral-800 dark:border-neutral-600 dark:text-neutral-200'"
            >
              <p class="leading-relaxed">{{ message }}</p>
            </div>

            <div class="grid gap-2 pt-2">
              <button
                type="button"
                class="flex w-full items-center justify-center gap-2 bg-neutral-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                :disabled="adding"
                @click="handleAddToCart"
              >
                <ShoppingCart v-if="!adding" :size="16" />
                <span v-else class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
                <span>{{ adding ? 'Adding…' : 'Add to selection' }}</span>
              </button>

              <router-link
                to="/cart"
                class="flex w-full items-center justify-center gap-1.5 border border-neutral-200 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300"
              >
                <span>View cart</span>
                <ArrowRight :size="16" />
              </router-link>
            </div>
          </div>
        </div>
      </aside>
    </section>

    <div v-else class="mx-auto w-full max-w-3xl border border-neutral-200 bg-white p-12 text-center sm:p-16 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 class="text-xl font-medium tracking-tight text-neutral-900 dark:text-white">Product not found</h2>
      <div class="mx-auto mt-5 h-px w-12 bg-neutral-300 dark:bg-neutral-700"></div>
      <p class="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">The item you are looking for might have been moved or removed.</p>

      <router-link
        to="/shop"
        class="mt-8 inline-flex items-center gap-1.5 border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700 transition-colors hover:border-neutral-900 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300"
      >
        <ArrowLeft :size="14" />
        Return to shop
      </router-link>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '../../components/AppShell.vue'
import { useCatalogStore } from '../../stores/catalogStore'
import { useCartStore } from '../../stores/cartStore'
import { formatCurrency, sortSizes } from '../../utils/format'
import { useSession } from '../../composables/useSession'
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Image
} from 'lucide-vue-next'

const route = useRoute()
const { profile } = useSession()
const { fetchProduct } = useCatalogStore()
const { addItem } = useCartStore()
const isStudent = computed(() => profile.value?.isStudent || false)

const loading = ref(true)
const product = ref(null)
const selectedVariantId = ref('')
const quantity = ref(1)
const message = ref('')
const isSuccess = ref(false)
const adding = ref(false)

const selectedColor = ref('')
const selectedSize = ref('')
const selectedPriceType = ref('regular')

// Update selectedPriceType when profile is loaded
watch(isStudent, (val) => {
  selectedPriceType.value = val ? 'student' : 'regular'
}, { immediate: true })

const availableColors = computed(() => {
  if (!product.value?.variants) return []
  const colors = product.value.variants.map(v => v.color || 'Standard')
  return [...new Set(colors)]
})

const availableSizesForSelectedColor = computed(() => {
  if (!product.value?.variants || !selectedColor.value) return []
  const sizes = product.value.variants
    .filter(v => (v.color || 'Standard') === selectedColor.value)
    .map(v => ({ 
      id: v.id, 
      size: v.size || 'Free size', 
      stock: v.stock 
    }))
    
  return sortSizes(sizes)
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
  product.value = await fetchProduct(route.params.productId)
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
    await addItem({
      productId: product.value.id,
      variantId: selectedVariantId.value,
      quantity: quantity.value,
      useStudentPrice: selectedPriceType.value === 'student'
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
