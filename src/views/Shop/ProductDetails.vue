<template>
  <AppShell subtitle="Premium fit, clean checkout">
    <div v-if="loading" class="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
      Loading product...
    </div>

    <section v-else-if="product" class="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div class="rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
        <div class="h-80 w-full overflow-hidden rounded-t-3xl bg-slate-200">
          <img
            v-if="product.base64Image"
            :src="product.base64Image"
            :alt="product.name"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
            No image
          </div>
        </div>

        <div class="p-8">
          <router-link
            to="/shop"
            class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          >
            ← Back to catalog
          </router-link>

          <h1 class="mt-6 text-4xl font-bold tracking-tight text-slate-900">{{ product.name }}</h1>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">
            {{ product.description }}
          </p>

          <div class="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p class="text-3xl font-bold text-slate-900">
              {{ formatCurrency(product.basePrice) }}
            </p>
            <div class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {{ product.variants?.length || 0 }} variants available
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Select variant</p>
          <h2 class="mt-3 text-2xl font-bold text-slate-900">Size & color</h2>
          <p class="mt-2 text-sm text-slate-500">
            Pick an in-stock option. You can adjust quantity before checkout.
          </p>

          <div class="mt-6 grid gap-3">
            <button
              v-for="variant in product.variants"
              :key="variant.id"
              type="button"
              class="flex items-start justify-between gap-4 rounded-2xl border p-4 text-left transition"
              :class="selectedVariantId === variant.id
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50'"
              @click="selectedVariantId = variant.id"
            >
              <div>
                <p class="font-semibold">
                  {{ variant.color || 'Standard' }} / {{ variant.size || 'Free size' }}
                </p>
                <p
                  class="mt-1 text-sm"
                  :class="selectedVariantId === variant.id ? 'text-slate-200' : 'text-slate-500'"
                >
                  {{ variant.stock }} in stock
                </p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
                :class="variant.stock > 0
                  ? (selectedVariantId === variant.id ? 'bg-white/15 text-white' : 'bg-emerald-100 text-emerald-700')
                  : (selectedVariantId === variant.id ? 'bg-white/15 text-white' : 'bg-rose-100 text-rose-700')"
              >
                {{ variant.stock > 0 ? 'Available' : 'Out' }}
              </span>
            </button>
          </div>
        </div>

        <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Quantity</p>
          <div class="mt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              class="h-12 w-12 rounded-2xl bg-slate-100 text-xl font-bold text-slate-700 transition hover:bg-slate-200"
              @click="quantity = Math.max(1, quantity - 1)"
            >
              -
            </button>
            <div class="text-center">
              <p class="text-3xl font-bold text-slate-900">{{ quantity }}</p>
              <p class="text-sm text-slate-500">items</p>
            </div>
            <button
              type="button"
              class="h-12 w-12 rounded-2xl bg-slate-100 text-xl font-bold text-slate-700 transition hover:bg-slate-200"
              @click="quantity = quantity + 1"
            >
              +
            </button>
          </div>

          <p v-if="message" class="mt-5 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            {{ message }}
          </p>

          <button
            type="button"
            class="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
            @click="handleAddToCart"
          >
            Add to cart
          </button>

          <router-link
            to="/cart"
            class="mt-3 inline-flex w-full justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View cart
          </router-link>
        </div>
      </div>
    </section>

    <div v-else class="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
      Product not found.
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppShell from '../../components/AppShell.vue'
import { useSession } from '../../composables/useSession'
import { getProduct } from '../../services/catalogService'
import { addToCart } from '../../services/cartService'
import { formatCurrency } from '../../utils/format'

const route = useRoute()
const router = useRouter()
const { authUser } = useSession()

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
  if (!authUser.value) {
    router.push('/login')
    return
  }

  if (!selectedVariantId.value) {
    message.value = 'Select a variant before adding to cart.'
    return
  }

  try {
    await addToCart({
      uid: authUser.value.uid,
      productId: product.value.id,
      variantId: selectedVariantId.value,
      quantity: quantity.value,
    })
    message.value = 'Item added to cart.'
  } catch (error) {
    message.value = error.message || 'Unable to add item to cart.'
  }
}

onMounted(loadProduct)
</script>
