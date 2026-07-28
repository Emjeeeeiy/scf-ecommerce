<template>
  <AppShell>
    <div class="space-y-10 pb-16 sm:space-y-16">
      <!-- Hero Section -->
     <section
        id="hero"
        class="relative -mx-4 overflow-hidden bg-neutral-900 px-6 py-14 text-center text-white sm:mx-0 sm:rounded-3xl sm:px-10 sm:py-20 dark:ring-1 dark:ring-white/10"
        style="background-image: linear-gradient(to bottom, rgba(23, 23, 23, 0.9), rgba(23, 23, 23, 0.8)), url('/scfphoto2.jpg'); background-size: cover; background-position: center;"
      >
        <div class="relative z-10 mx-auto max-w-4xl">
          <h1 class="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            <span class="block text-white">{{ settings.hero.title.split(' ')[0] }}</span>
            <span class="block text-amber-400">{{ settings.hero.title.split(' ').slice(1).join(' ') }}</span>
          </h1>
          <p class="mt-6 text-sm leading-relaxed text-neutral-400 max-w-xl mx-auto sm:text-lg">
            {{ settings.hero.description }}
          </p>
          <div class="mt-8 flex flex-col items-start justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
            <router-link
              to="/shop"
              class="group w-fit rounded-xl bg-amber-400 px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-neutral-900 transition-all hover:scale-105 hover:bg-amber-300 sm:w-auto sm:px-8 sm:py-3.5 sm:text-xs sm:text-center flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20"
            >
              <ShoppingBag :size="18" />
              Shop Now
            </router-link>
          </div>
        </div>
        
        <!-- Animated Background Accents (Optional: Pwedeng alisin kung masyadong magulo na sa background image) -->
        <div class="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-400/10 blur-[100px]"></div>
        <div class="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]"></div>
      </section>

      <!-- Latest Arrivals -->
      <section class="space-y-6">
        <div class="flex flex-col items-end justify-between gap-3 sm:flex-row sm:items-center">
          <div class="w-full text-left">
             <p class="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500 mb-0.5">Newest Releases</p>
             <h2 class="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl dark:text-white">Latest Arrivals</h2>
          </div>
          <router-link
            to="/shop"
            class="group flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-neutral-500 transition-all hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-amber-400 dark:hover:bg-amber-400 dark:hover:text-neutral-950"
          >
            View All Collection
            <ArrowRight :size="14" class="transition-transform group-hover:translate-x-1" />
          </router-link>
        </div>

        <!-- Product Grid -->
        <div v-if="loading" class="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0 scrollbar-hide">
          <div v-for="i in 6" :key="i" class="min-w-40 flex-1 animate-pulse space-y-3 lg:min-w-0">
            <div class="aspect-4/5 rounded-2xl bg-neutral-100 dark:bg-neutral-800"></div>
            <div class="h-3 w-3/4 rounded bg-neutral-100 dark:bg-neutral-800"></div>
            <div class="h-3 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800"></div>
          </div>
        </div>

        <div v-else-if="latestProducts.length > 0" class="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0 scrollbar-hide">
          <router-link
            v-for="product in latestProducts"
            :key="product.id"
            :to="`/shop/product/${product.id}`"
            class="group block min-w-40  flex-1 lg:min-w-0"
          >
            <div class="aspect-4/5 overflow-hidden rounded-2xl bg-white p-1.5 ring-1 ring-neutral-100 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-neutral-900/10 group-hover:ring-amber-200 dark:bg-neutral-900 dark:ring-neutral-800 dark:group-hover:ring-amber-500/30">
              <div class="relative h-full w-full overflow-hidden rounded-xl bg-neutral-50 shadow-inner dark:bg-neutral-800">
                <img
                  v-if="product.base64Image"
                  :src="product.base64Image"
                  :alt="product.name"
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div v-else class="flex h-full w-full items-center justify-center text-neutral-300 dark:text-neutral-600">
                   <Image :size="24" />
                </div>
              </div>
            </div>
            <div class="mt-3 text-center sm:text-left">
              <h3 class="text-[10px] font-black uppercase tracking-widest text-neutral-900 line-clamp-1 group-hover:text-amber-500 transition-colors dark:text-white">{{ product.name }}</h3>
              <p class="mt-1 text-xs font-bold text-neutral-400 dark:text-neutral-500">{{ formatCurrency(product.studentPrice) }}</p>
            </div>
          </router-link>
        </div>
      </section>

      <!-- Mission & Vision -->
      <section class="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div class="space-y-4">
          <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Target :size="19" />
              </div>
              <div class="text-right">
                <h2 class="mt-1 text-lg font-black tracking-tight text-neutral-900 dark:text-white">
                  {{ settings.mission.title }}
                </h2>
              </div>
            </div>
            <p class="mt-5 text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
              {{ settings.mission.description }}
            </p>
          </div>
          <div class="rounded-2xl border border-neutral-200 bg-neutral-900 p-6 text-white shadow-sm sm:p-8 dark:border-neutral-700">
            <div class="flex items-start justify-between gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-amber-400">
                <Eye :size="19" />
              </div>
              <div class="text-right">
                <h2 class="mt-1 text-lg font-black tracking-tight text-white">
                  {{ settings.vision.title }}
                </h2>
              </div>
            </div>
            <p class="mt-5 text-sm leading-relaxed text-neutral-300 sm:text-base">
              {{ settings.vision.description }}
            </p>
          </div>
        </div>
        <div class="relative rounded-3xl bg-neutral-200 aspect-square overflow-hidden flex items-center justify-center dark:bg-neutral-800">
            <!-- Background Image -->
            <img 
                src="/scfphoto.jpg" 
                alt="SCF Photo" 
                class="absolute inset-0 w-full h-full object-cover"
            />
            <!-- Neutral Gradient Overlay -->
            <div class="absolute inset-0 bg-linear-to-br from-neutral-900/80 via-neutral-800/60 to-neutral-700/50"></div>            
            <p class="absolute bottom-6 z-10 text-[8px] font-black uppercase tracking-[0.5em] text-white/90">
                Faith in Action
            </p>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-12 sm:px-12 sm:py-16 dark:ring-1 dark:ring-white/10">
        <!-- Dot Pattern Background Overlay -->
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px] opacity-10"></div>

        <!-- Content Container (z-10 ensures text renders above dots) -->
        <div class="relative z-10 mx-auto max-w-3xl text-center">
          <h2 class="text-2xl font-black uppercase tracking-tight text-amber-300 sm:text-4xl">
            {{ settings.about.title }}
          </h2>
          
          <div class="mx-auto mt-6 h-1 w-16 rounded-full bg-amber-300/40"></div>
          
          <p class="mt-6 text-sm leading-relaxed text-neutral-300 opacity-90 sm:text-lg">
            {{ settings.about.description }}
          </p>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="mx-auto max-w-5xl rounded-3xl bg-white p-6 border border-neutral-300 ring-1 ring-neutral-100 sm:p-12 dark:bg-neutral-900 dark:border-neutral-800 dark:ring-neutral-800">
        <div class="grid gap-10 md:grid-cols-2">
          <div class="space-y-6">
            <div>
              <p class="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500 mb-1.5">Connect</p>
              <h2 class="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl dark:text-white">Get in Touch</h2>
              <p class="mt-3 text-xs leading-relaxed text-neutral-500 sm:text-sm dark:text-neutral-400">
                Have questions about your order, sizing, or how to get involved with SCF? We'd love to hear from you.
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white dark:bg-neutral-800 dark:hover:bg-amber-400 dark:hover:text-neutral-950">
                  <Mail :size="18" />
                </div>
                <div>
                   <p class="text-[7px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Email Us</p>
                   <span class="text-neutral-900 font-black text-xs sm:text-sm dark:text-white">{{ settings.contact.email }}</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white dark:bg-neutral-800 dark:hover:bg-amber-400 dark:hover:text-neutral-950">
                  <MapPin :size="18" />
                </div>
                <div>
                   <p class="text-[7px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Visit Us</p>
                   <span class="text-neutral-900 font-black text-xs sm:text-sm dark:text-white">{{ settings.contact.address }}</span>
                </div>
              </div>
              <a
                :href="settings.contact.facebook"
                target="_blank"
                class="flex items-center gap-4 group"
              >
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-neutral-800">
                  <Facebook :size="18" />
                </div>
                <div>
                   <p class="text-[7px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-blue-600 transition-colors dark:text-neutral-500">Follow Us</p>
                   <span class="text-neutral-900 font-black text-xs sm:text-sm group-hover:text-blue-700 transition-colors dark:text-white">Facebook Page</span>
                </div>
              </a>
            </div>
          </div>

          <form @submit.prevent class="flex flex-col gap-3 rounded-2xl bg-neutral-50 p-5 sm:p-6 dark:bg-neutral-800/50">
            <input type="text" placeholder="Full Name" class="rounded-xl border-none bg-white p-4 text-xs font-bold text-neutral-900 shadow-sm outline-none ring-1 ring-neutral-100 focus:ring-2 focus:ring-amber-400 transition-all dark:bg-neutral-900 dark:text-white dark:ring-neutral-700" />
            <input type="email" placeholder="Email Address" class="rounded-xl border-none bg-white p-4 text-xs font-bold text-neutral-900 shadow-sm outline-none ring-1 ring-neutral-100 focus:ring-2 focus:ring-amber-400 transition-all dark:bg-neutral-900 dark:text-white dark:ring-neutral-700" />
            <textarea placeholder="Your Message" rows="3" class="rounded-xl border-none bg-white p-4 text-xs font-bold text-neutral-900 shadow-sm outline-none ring-1 ring-neutral-100 focus:ring-2 focus:ring-amber-400 transition-all dark:bg-neutral-900 dark:text-white dark:ring-neutral-700"></textarea>
            <button class="mt-3 rounded-xl bg-neutral-900 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <button
        v-show="showScrollToTopButton"
        type="button"
        aria-label="Return to hero section"
        class="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-amber-300 sm:right-6 sm:h-14 sm:w-14 md:bottom-6"
        :class="showScrollToTopButton ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'"
        @click="scrollToHero"
      >
        <ArrowUp :size="20" class="sm:h-6 sm:w-6" />
      </button>
    </div>
  </AppShell>
</template>

<script setup>
import AppShell from '../components/AppShell.vue'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useSession } from '../composables/useSession'
import { useCatalogStore } from '../stores/catalogStore'
import { getLandingPageSettings, DEFAULT_LANDING_PAGE_SETTINGS } from '../services/settingsService'
import { formatCurrency } from '../utils/format'
import { 
  ShoppingBag, 
  Heart, 
  Target, 
  Eye, 
  Mail, 
  MapPin, 
  Facebook,
  CheckCircle, 
  Truck, 
  Palette,
  Image,
  ArrowRight,
  ArrowUp
} from 'lucide-vue-next'

const { isAuthenticated } = useSession()
const { products, loadCatalog } = useCatalogStore()

const latestProducts = computed(() => products.value.slice(0, 6))
const loading = ref(true)
const settings = ref(DEFAULT_LANDING_PAGE_SETTINGS)
const showScrollToTopButton = ref(false)

const updateScrollState = () => {
  const scrollTop = window.scrollY || window.pageYOffset
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  showScrollToTopButton.value = scrollTop + windowHeight >= documentHeight - 8
}

const scrollToHero = () => {
  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', updateScrollState)

  try {
    const [, landingSettings] = await Promise.all([
      loadCatalog(),
      getLandingPageSettings()
    ])
    settings.value = landingSettings
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', updateScrollState)
})
</script>