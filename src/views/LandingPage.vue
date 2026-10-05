<template>
  <AppShell transparent-header>
    <div class="space-y-10 pb-16 sm:space-y-16">
      <!-- Hero Section: full-screen photo background extending under transparent header -->
      <section
        id="hero"
        class="hero-fullscreen-transparent relative -mx-4 grid place-items-center overflow-hidden text-left text-white sm:-mx-6 lg:-mx-12"
      >
        <!-- Background photo -->
        <img
          src="/images/scfphoto.jpg"
          alt="SCF Photo"
          class="absolute inset-0 h-full w-full object-cover"
        />
        <!-- Black overlay to darken image -->
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="absolute inset-0 bg-linear-to-t from-black/50 via-black/15 to-black/25"></div>
        <!-- Black fade under the text: from bottom-center on mobile, from left on desktop -->
        <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent sm:bg-linear-to-r"></div>

        <div class="relative z-10 flex w-full flex-col items-center px-6 py-12 pt-28 text-center sm:items-start sm:px-10 sm:py-16 sm:pt-32 sm:text-left lg:px-16">
          <h1 class="space-y-2 wrap-break-word text-center font-display uppercase leading-[1.02] tracking-wide text-[clamp(2rem,5.5vw,6rem)] sm:space-y-3 sm:text-left">
            <span
              v-for="(word, i) in heroWords"
              :key="i"
              class="block"
              :class="i === heroWords.length - 1 ? 'text-amber-400' : 'text-white'"
            >{{ word }}</span>
          </h1>
          <p class="mt-6 max-w-xl text-center text-sm leading-relaxed text-neutral-200 sm:text-left sm:text-lg">
            {{ settings.hero.description }}
          </p>
          <router-link
            to="/shop"
            class="group relative mt-8 flex w-fit items-center justify-center gap-2 overflow-hidden rounded-none border border-white px-5 py-3 text-center text-[10px] font-black uppercase tracking-widest text-white transition-colors duration-300 hover:text-neutral-900 sm:px-8 sm:py-3.5 sm:text-xs"
          >
            <span class="absolute inset-0 -translate-x-full bg-amber-400 transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
            <ShoppingBag :size="18" class="relative z-10" />
            <span class="relative z-10">Shop Now</span>
          </router-link>
        </div>

      </section>

      <!-- Latest Arrivals -->
      <section class="space-y-6 lg:px-32 xl:px-48">
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
            <div class="aspect-4/5 overflow-hidden rounded-2xl ring-1 ring-neutral-100 transition-all duration-500 group-hover:-translate-y-1   group-hover:ring-amber-200 dark:ring-neutral-800 dark:group-hover:ring-amber-500/30">
              <div class="relative h-full w-full overflow-hidden rounded-xl bg-neutral-50  dark:bg-neutral-800">
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
      <section class="grid gap-8 lg:grid-cols-2 lg:items-center lg:px-32 xl:px-48">
        <div class="space-y-4">
          <div class="rounded-2xl border border-neutral-200 bg-white p-6  sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
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
          <div class="rounded-2xl border border-neutral-200 bg-neutral-900 p-6 text-white  sm:p-8 dark:border-neutral-700">
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
        <div class="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-start justify-between gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Users :size="19" />
              </div>
              <div class="text-right">
                <p class="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">Leadership</p>
                <h2 class="mt-1 text-lg font-black tracking-tight text-neutral-900 dark:text-white">
                  {{ officers.title }}
                </h2>
              </div>
            </div>
            <ul class="mt-6 divide-y divide-neutral-200 dark:divide-neutral-800">
              <li
                v-for="(member, i) in officers.members"
                :key="i"
                class="flex items-center gap-4 py-4"
              >
                <img
                  v-if="member.photoBase64"
                  :src="member.photoBase64"
                  :alt="member.name"
                  class="h-14 w-14 shrink-0 rounded-full object-cover"
                />
                <span v-else class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-black uppercase text-amber-400 dark:bg-amber-400 dark:text-neutral-950">
                  {{ (member.name || '?').trim().charAt(0) }}
                </span>
                <div class="min-w-0">
                  <p class="truncate text-xs font-black uppercase tracking-widest text-neutral-900 dark:text-white">{{ member.name }}</p>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{{ member.position }}</p>
                </div>
              </li>
            </ul>
        </div>
      </section>

      <!-- Basis of Faith Section -->
      <section class="rounded-3xl border border-neutral-300 bg-white p-6 ring-1 ring-neutral-100 sm:p-12 lg:mx-64 xl:mx-96 dark:border-neutral-800 dark:bg-neutral-900 dark:ring-neutral-800">
        <div class="mx-auto max-w-3xl">
          <!-- IVCF Philippines mark -->
          <div class="flex flex-col items-center">
            <div class="flex">
              <span class="flex h-10 w-10 items-center justify-center bg-yellow-400 text-xl font-black text-white">I</span>
              <span class="flex h-10 w-10 items-center justify-center bg-green-500 text-xl font-black text-white">V</span>
              <span class="flex h-10 w-10 items-center justify-center bg-blue-500 text-xl font-black text-white">C</span>
              <span class="flex h-10 w-10 items-center justify-center bg-red-500 text-xl font-black text-white">F</span>
            </div>
            <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.5em] text-neutral-900 dark:text-white">Philippines</p>
          </div>
          <p class="mt-6 text-center text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">What We Believe</p>
          <h2 class="mt-2 text-center text-2xl font-black uppercase tracking-tight text-neutral-900 sm:text-3xl dark:text-white">Basis of Faith</h2>
          <div class="mx-auto mt-6 h-1 w-16 rounded-full bg-amber-400/60"></div>
          <ol class="mt-8 space-y-4">
            <li
              v-for="(point, i) in basisOfFaith"
              :key="i"
              class="flex items-start gap-4"
            >
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-neutral-900">{{ i + 1 }}</span>
              <p class="text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">{{ point }}</p>
            </li>
          </ol>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-12 sm:px-12 sm:py-16 lg:mx-32 xl:mx-48 dark:ring-1 dark:ring-white/10">
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
      <section class="w-full rounded-3xl bg-white p-6 border border-neutral-300 ring-1 ring-neutral-100 sm:p-12 lg:mx-32 lg:w-auto xl:mx-48 dark:bg-neutral-900 dark:border-neutral-800 dark:ring-neutral-800">
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
            <input type="text" placeholder="Full Name" class="rounded-xl border-none bg-white p-4 text-xs font-bold text-neutral-900  outline-none ring-1 ring-neutral-100 focus:ring-2 focus:ring-amber-400 transition-all dark:bg-neutral-900 dark:text-white dark:ring-neutral-700" />
            <input type="email" placeholder="Email Address" class="rounded-xl border-none bg-white p-4 text-xs font-bold text-neutral-900  outline-none ring-1 ring-neutral-100 focus:ring-2 focus:ring-amber-400 transition-all dark:bg-neutral-900 dark:text-white dark:ring-neutral-700" />
            <textarea placeholder="Your Message" rows="3" class="rounded-xl border-none bg-white p-4 text-xs font-bold text-neutral-900  outline-none ring-1 ring-neutral-100 focus:ring-2 focus:ring-amber-400 transition-all dark:bg-neutral-900 dark:text-white dark:ring-neutral-700"></textarea>
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
import { getLenis } from '../utils/lenis'
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
  ArrowUp,
  Users
} from 'lucide-vue-next'

const { isAuthenticated } = useSession()
const { products, loadCatalog } = useCatalogStore()

const latestProducts = computed(() => products.value.slice(0, 6))
const loading = ref(true)
const settings = ref(DEFAULT_LANDING_PAGE_SETTINGS)
// Officers card falls back to defaults when older saved settings lack the key.
const officers = computed(() => settings.value.officers ?? DEFAULT_LANDING_PAGE_SETTINGS.officers)
const basisOfFaith = [
  'The unity of the Father, Son and Holy Spirit in the Godhead.',
  'The sovereignty of God in creation, revelation, redemption and final judgment.',
  'The divine inspiration and the entire trustworthiness of the Holy Scriptures, as originally given, and its supreme authority in all matters of faith and conduct.',
  'The universal sinfulness and guilt of all men since the fall, rendering them subject to God\u2019s wrath and condemnation.',
  'Redemption from the guilt, penalty, dominion and pollution of sin, solely through the sacrificial death (as our Representative and Substitute) of the Lord Jesus Christ, the Incarnate Son of God.',
  'The bodily resurrection of the Lord Jesus Christ from the dead and His ascension to the right hand of God the Father.',
  'The presence and power of the Holy Spirit in the work of regeneration.',
  'The justification of the sinner by the grace of God through faith alone.',
  'The indwelling and work of the Holy Spirit in the believer.',
  'The one Holy Universal Church which is the Body of Christ and to which all true believers belong.',
  'The expectation of the personal return of the Lord Jesus Christ.',
]
// Stacked hero title: one word per line like GOOD WORK / DESERVES TO / BE SEEN.
// Falls back to full name when the stored title is still the legacy "SCF".
const heroWords = computed(() => {
  const raw = (settings.value.hero?.title || '').trim()
  const source = raw === '' || raw.toUpperCase() === 'SCF' ? 'Silangan Christian Fellowship' : raw
  return source.split(/\s+/).filter(Boolean)
})
const showScrollToTopButton = ref(false)

const updateScrollState = () => {
  const scrollTop = window.scrollY || window.pageYOffset
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  showScrollToTopButton.value = scrollTop + windowHeight >= documentHeight - 8
}

const scrollToHero = () => {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo('#hero', { duration: 1.4 })
  } else {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
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

<style scoped>
/* Full-screen hero with photo background extending under the transparent header.
   Fallback chain: 100vh -> 100svh (mobile URL bar) -> 100dvh (dynamic).
   Full viewport height (header overlays via absolute positioning, so no offset).
   Grid place-items:center on the section keeps content centered at any zoom (25%-200%). */
.hero-fullscreen-transparent {
  min-height: 100vh;
  min-height: 100svh;
  min-height: 100dvh;
}
</style>