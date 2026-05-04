<template>
  <AppShell>
    <div class="space-y-10 pb-16 sm:space-y-16">
      <!-- Hero Section -->
      <section class="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-center text-white shadow-2xl sm:px-10 sm:py-20">
        <div class="relative z-10 mx-auto max-w-4xl">
          <h1 class="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            <span class="block text-white">{{ settings.hero.title.split(' ')[0] }}</span>
            <span class="block text-amber-400">{{ settings.hero.title.split(' ').slice(1).join(' ') }}</span>
          </h1>
          <p class="mt-6 text-sm leading-relaxed text-slate-400 max-w-xl mx-auto sm:text-lg">
            {{ settings.hero.description }}
          </p>
          <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <router-link
              to="/shop"
              class="group w-full rounded-xl bg-amber-400 px-8 py-3.5 text-center text-xs font-black uppercase tracking-widest text-slate-900 transition-all hover:scale-105 hover:bg-amber-300 sm:w-auto flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20"
            >
              <ShoppingBag :size="18" />
              Shop Now
            </router-link>
          </div>
        </div>
        
        <!-- Animated Background Accents -->
        <div class="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-400/10 blur-[100px]"></div>
        <div class="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]"></div>
      </section>

      <!-- Latest Arrivals -->
      <section class="space-y-6">
        <div class="flex flex-col items-end justify-between gap-3 sm:flex-row">
          <div class="w-full text-left">
             <p class="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500 mb-0.5">Newest Releases</p>
             <h2 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Latest Arrivals</h2>
          </div>
          <router-link to="/shop" class="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-900">
            View All Collection
            <ArrowRight :size="14" class="transition-transform group-hover:translate-x-1" />
          </router-link>
        </div>
        
        <!-- Product Grid -->
        <div v-if="loading" class="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <div v-for="i in 5" :key="i" class="animate-pulse space-y-3">
            <div class="aspect-4/5 rounded-2xl bg-slate-100"></div>
            <div class="h-3 w-3/4 rounded bg-slate-100"></div>
            <div class="h-3 w-1/2 rounded bg-slate-100"></div>
          </div>
        </div>

        <div v-else-if="latestProducts.length > 0" class="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <router-link 
            v-for="product in latestProducts" 
            :key="product.id" 
            :to="`/shop/product/${product.id}`"
            class="group block"
          >
            <div class="aspect-4/5 overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-100 transition-all duration-500">
              <div class="relative h-full w-full overflow-hidden rounded-xl bg-slate-50 shadow-inner">
                <img
                  v-if="product.base64Image"
                  :src="product.base64Image"
                  :alt="product.name"
                  class="h-full w-full object-cover transition-transform duration-700"
                />
                <div v-else class="flex h-full w-full items-center justify-center text-slate-300">
                  <Image :size="24" />
                </div>
              </div>
            </div>
            <div class="mt-3 text-center sm:text-left">
              <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-900 line-clamp-1 group-hover:text-amber-500 transition-colors">{{ product.name }}</h3>
              <p class="mt-0.5 text-xs font-bold text-slate-400">{{ formatCurrency(product.basePrice) }}</p>
            </div>
          </router-link>
        </div>
      </section>

      <!-- Mission & Vision -->
      <section class="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div class="space-y-4">
          <div class="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-8">
            <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Target :size="20" />
            </div>
            <h2 class="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              {{ settings.mission.title }}
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
              {{ settings.mission.description }}
            </p>
          </div>
          <div class="rounded-2xl bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-400">
              <Eye :size="20" />
            </div>
            <h2 class="text-xl font-black tracking-tight text-white sm:text-2xl">
              {{ settings.vision.title }}
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
              {{ settings.vision.description }}
            </p>
          </div>
        </div>
        <div class="relative rounded-3xl bg-slate-200 aspect-square overflow-hidden shadow-md flex items-center justify-center">
            <!-- Background Image -->
            <img 
                src="/scfphoto.jpg" 
                alt="SCF Photo" 
                class="absolute inset-0 w-full h-full object-cover"
            />
            <!-- Slate Gradient Overlay -->
            <div class="absolute inset-0 bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-700/50"></div>            
            <p class="absolute bottom-6 z-10 text-[8px] font-black uppercase tracking-[0.5em] text-white/90">
                Faith in Action
            </p>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="rounded-3xl bg-amber-400 px-6 py-12 text-slate-900 shadow-2xl shadow-amber-400/20 sm:px-12 sm:py-16">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="text-2xl font-black tracking-tight sm:text-4xl uppercase">{{ settings.about.title }}</h2>
          <div class="mt-6 h-1 w-16 mx-auto rounded-full bg-slate-900"></div>
          <p class="mt-8 text-sm font-bold leading-relaxed opacity-80 sm:text-lg">
            {{ settings.about.description }}
          </p>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-12">
        <div class="grid gap-10 md:grid-cols-2">
          <div class="space-y-6">
            <div>
              <p class="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500 mb-1.5">Connect</p>
              <h2 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Get in Touch</h2>
              <p class="mt-3 text-xs leading-relaxed text-slate-500 sm:text-sm">
                Have questions about your order, sizing, or how to get involved with SCF? We'd love to hear from you.
              </p>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors hover:bg-slate-900 hover:text-white">
                  <Mail :size="18" />
                </div>
                <div>
                   <p class="text-[7px] font-black uppercase tracking-widest text-slate-400">Email Us</p>
                   <span class="text-slate-900 font-black text-xs sm:text-sm">{{ settings.contact.email }}</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors hover:bg-slate-900 hover:text-white">
                  <MapPin :size="18" />
                </div>
                <div>
                   <p class="text-[7px] font-black uppercase tracking-widest text-slate-400">Visit Us</p>
                   <span class="text-slate-900 font-black text-xs sm:text-sm">{{ settings.contact.address }}</span>
                </div>
              </div>
            </div>
          </div>

          <form @submit.prevent class="flex flex-col gap-3 rounded-2xl bg-slate-50 p-5 sm:p-6">
            <input type="text" placeholder="Full Name" class="rounded-xl border-none bg-white p-4 text-xs font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-amber-400 transition-all" />
            <input type="email" placeholder="Email Address" class="rounded-xl border-none bg-white p-4 text-xs font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-amber-400 transition-all" />
            <textarea placeholder="Your Message" rows="3" class="rounded-xl border-none bg-white p-4 text-xs font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-amber-400 transition-all"></textarea>
            <button class="mt-3 rounded-xl bg-slate-900 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95 shadow-lg shadow-slate-900/20">
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