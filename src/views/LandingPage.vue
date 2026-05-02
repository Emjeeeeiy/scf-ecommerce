<template>
  <AppShell>
    <div class="space-y-16 pb-20">
      <section class="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-16 text-center text-white shadow-2xl sm:px-12 sm:py-24">
        <div class="relative z-10 mx-auto max-w-4xl">
          <div class="mb-6 flex justify-center">
          </div>
          <h1 class="flex items-center justify-center gap-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            <img :src="settings.hero.logoUrl" :alt="`${settings.hero.title} Logo`" class="h-12 w-12 rounded-xl object-contain sm:h-20 sm:w-20" />
            <span class="text-white">{{ settings.hero.title }}</span>
          </h1>
          <p class="mt-6 text-base leading-relaxed text-slate-300 max-w-2xl mx-auto sm:text-lg">
            {{ settings.hero.description }}
          </p>
          <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <router-link
              to="/shop"
              class="group w-full rounded-xl bg-amber-400 px-8 py-4 text-center text-sm font-bold text-slate-900 transition-all hover:scale-105 hover:bg-amber-300 sm:w-auto flex items-center justify-center gap-2"
            >
              <ShoppingBag :size="18" />
              Shop Now
            </router-link>
            
          </div>
        </div>
        <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px]"></div>
        <div class="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]"></div>
      </section>

      <section class="space-y-6">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">Latest Arrivals</h2>
            <p class="text-slate-500">Check out our newest designs</p>
          </div>
          <router-link to="/shop" class="text-sm font-semibold text-amber-600 hover:text-amber-700">
            View all products →
          </router-link>
        </div>
        
        <div v-if="loading" class="grid gap-6 grid-cols-2 md:grid-cols-5">
          <div v-for="i in 5" :key="i" class="animate-pulse space-y-4">
            <div class="aspect-[3/4] rounded-2xl bg-slate-100"></div>
            <div class="h-4 w-3/4 rounded bg-slate-100"></div>
            <div class="h-4 w-1/2 rounded bg-slate-100"></div>
          </div>
        </div>

        <div v-else-if="latestProducts.length > 0" class="grid gap-6 grid-cols-2 md:grid-cols-5">
          <router-link 
            v-for="product in latestProducts" 
            :key="product.id" 
            :to="`/shop/product/${product.id}`"
            class="group block"
          >
            <div class="aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition-hover hover:shadow-md">
              <img 
                v-if="product.base64Image"
                :src="product.base64Image" 
                :alt="product.name" 
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-slate-200">
                <Image class="text-slate-400" :size="32" />
              </div>
            </div>
            <div class="mt-4">
              <h3 class="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">{{ product.name }}</h3>
              <p class="mt-1 text-sm font-medium text-slate-500">{{ formatCurrency(product.basePrice) }}</p>
            </div>
          </router-link>
        </div>

        <div v-else class="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center">
          <p class="text-slate-500">No products available yet.</p>
        </div>
      </section>

      <section class="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div class="space-y-6">
          <div class="rounded-2xl bg-slate-50 p-6 border-l-4 border-amber-400 sm:p-8">
            <h2 class="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
              <Target class="text-amber-500" /> {{ settings.mission.title }}
            </h2>
            <p class="mt-4 text-slate-600 text-base leading-relaxed sm:text-lg">
              {{ settings.mission.description }}
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6 border-l-4 border-blue-400 sm:p-8">
            <h2 class="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
              <Eye class="text-blue-500" /> {{ settings.vision.title }}
            </h2>
            <p class="mt-4 text-slate-600 text-base leading-relaxed sm:text-lg">
              {{ settings.vision.description }}
            </p>
          </div>
        </div>
        <div class="relative rounded-2xl bg-slate-200 aspect-square overflow-hidden shadow-inner flex items-center justify-center">
           <Image :size="64" class="text-slate-400" />
           <p class="absolute bottom-6 text-slate-500 font-medium italic text-sm">"Faith in Action"</p>
        </div>
      </section>

      <section id="about" class="rounded-2xl bg-amber-400 px-6 py-12 text-slate-900 sm:px-16 sm:py-16">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="text-2xl font-black uppercase tracking-tight sm:text-3xl">{{ settings.about.title }}</h2>
          <p class="mt-6 text-base font-medium leading-relaxed opacity-90 sm:text-lg">
            {{ settings.about.description }}
          </p>
        </div>
      </section>

      <section class="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-12">
        <div class="grid gap-12 md:grid-cols-2">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 sm:text-3xl">Get in Touch</h2>
            <p class="mt-4 text-sm text-slate-600 sm:text-base">
              Have questions about your order, sizing, or how to get involved with SCF? We'd love to hear from you.
            </p>
            
            <div class="mt-8 space-y-6">
              <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Mail :size="20" />
                </div>
                <span class="text-slate-700 font-medium text-sm sm:text-base">{{ settings.contact.email }}</span>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <MapPin :size="20" />
                </div>
                <span class="text-slate-700 font-medium text-sm sm:text-base">{{ settings.contact.address }}</span>
              </div>
            </div>
          </div>

          <form @submit.prevent class="grid gap-4">
            <input type="text" placeholder="Your Name" class="rounded-xl border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400" />
            <input type="email" placeholder="Email Address" class="rounded-xl border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400" />
            <textarea placeholder="Your Message" rows="4" class="rounded-xl border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400"></textarea>
            <button class="rounded-xl bg-slate-900 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  </AppShell>
</template>

<script setup>
import AppShell from '../components/AppShell.vue'
import { ref, onMounted } from 'vue'
import { useSession } from '../composables/useSession'
import { listProducts } from '../services/catalogService'
import { getLandingPageSettings, DEFAULT_LANDING_PAGE_SETTINGS } from '../services/settingsService'
import { formatCurrency } from '../utils/format'
import { 
  ShoppingBag, 
  Heart, 
  Target, 
  Eye, 
  Mail, 
  MapPin, 
  CheckCircle, 
  Truck, 
  Palette,
  Image
} from 'lucide-vue-next'

const { isAuthenticated } = useSession()

const latestProducts = ref([])
const loading = ref(true)
const settings = ref(DEFAULT_LANDING_PAGE_SETTINGS)

onMounted(async () => {
  try {
    const [products, landingSettings] = await Promise.all([
      listProducts(),
      getLandingPageSettings()
    ])
    // Get top 5 latest products
    latestProducts.value = products.slice(0, 5)
    settings.value = landingSettings
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
})
</script>