<template>
  <AppShell transparent-header>
    <div class="space-y-10 sm:space-y-16">
      <!-- Hero + dot band share one wrapper so the band sits flush under the
           photo instead of after the sections' vertical gap. -->
      <div>
        <!-- Hero: full-screen photo under the transparent header. A flex column,
             so the copy centers in the free space while the scroll cue sits in
             normal flow at the bottom — nothing can overlap, whatever the screen
             height. The dark base shows until the photo loads. -->
        <section
          id="hero"
          class="hero-fullscreen-transparent relative -mx-4 flex flex-col overflow-hidden bg-neutral-950 text-white sm:-mx-6 lg:-mx-12"
          :class="{ 'hero-ready': heroReady }"
        >
          <!-- Background photo (decorative: the copy carries the meaning) -->
          <img
            ref="heroPhotoRef"
            src="/images/scfphoto.jpg"
            alt=""
            fetchpriority="high"
            class="hero-photo absolute inset-0 h-full w-full object-cover"
            :class="{ 'is-loaded': heroPhotoLoaded }"
            @load="heroPhotoLoaded = true"
          />
          <!-- Tint: an even base, a stronger fade behind the copy (from the bottom
               on mobile, from the left on desktop) that leaves the far side of the
               photo lively, and soft top/bottom fades for the header and scroll cue. -->
          <div class="absolute inset-0 bg-neutral-950/40"></div>
          <div class="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/55 to-neutral-950/20 sm:bg-linear-to-r sm:from-neutral-950/85 sm:via-neutral-950/45 sm:to-neutral-950/10"></div>
          <div class="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-neutral-950/60 to-transparent"></div>
          <div class="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-neutral-950/80 to-transparent"></div>

          <div class="relative z-10 flex flex-1 items-center px-6 pb-10 pt-28 sm:px-10 sm:pt-32 lg:px-16">
            <div class="mx-auto flex w-full max-w-2xl flex-col items-center text-center sm:mx-0 sm:items-start sm:text-left">
              <h1
                class="hero-reveal space-y-1 font-heading text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-wide sm:space-y-2"
                style="--reveal-delay: 0s"
              >
                <span
                  v-for="(word, i) in heroWords"
                  :key="i"
                  class="block"
                  :class="i === heroWords.length - 1 ? 'text-amber-400' : 'text-white'"
                >{{ word }}</span>
              </h1>
              <div class="hero-reveal mt-6 h-px w-12 bg-amber-400/80" style="--reveal-delay: 0.1s"></div>
              <p class="hero-reveal mt-6 max-w-xl text-pretty text-sm leading-relaxed text-neutral-200 sm:text-lg" style="--reveal-delay: 0.2s">
                {{ heroDescription }}
              </p>

              <div
                class="hero-reveal mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 sm:mt-10 sm:justify-start"
                style="--reveal-delay: 0.3s"
              >
                <router-link
                  to="/shop"
                  class="group relative flex w-fit items-center justify-center gap-2 overflow-hidden rounded-none border border-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors duration-300 hover:text-neutral-900 focus-visible:outline-white sm:px-8"
                >
                  <span class="absolute inset-0 -translate-x-full bg-amber-400 transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
                  <ShoppingBag :size="18" class="relative z-10" />
                  <span class="relative z-10">Shop Now</span>
                </router-link>
                <a
                  href="#about"
                  class="group inline-flex items-center gap-2 rounded-sm py-2 text-xs font-bold uppercase tracking-widest text-white/80 transition-colors hover:text-white focus-visible:outline-white"
                  @click.prevent="scrollToAbout"
                >
                  About us
                  <ArrowDown :size="15" class="transition-transform group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>

          <div class="relative z-10 px-6 pb-6 sm:px-10 sm:pb-8 lg:px-16">
            <!-- Scroll cue: tells visitors there is more below the fold -->
            <button
              type="button"
              class="mx-auto flex flex-col items-center gap-2 rounded-md px-3 py-1 text-white/70 transition-colors hover:text-white focus-visible:outline-white"
              @click="scrollPastHero"
            >
              <!-- pl matches the tracking so the label stays optically centered -->
              <span class="pl-[0.3em] text-[11px] font-semibold uppercase tracking-[0.3em]">Scroll down</span>
              <ChevronDown :size="20" stroke-width="1.5" class="scroll-cue-icon" />
            </button>
          </div>
        </section>

        <!-- Three rows of small dots under the hero: a quiet divider between
             the photo and the page. Full-bleed like the hero. -->
        <div class="-mx-4 bg-neutral-100 py-2.5 sm:-mx-6 lg:-mx-12 dark:bg-neutral-900" aria-hidden="true">
          <div class="dot-band"></div>
        </div>
      </div>

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

      <!-- Mission & Vision — minimalist -->
      <section class="mx-auto w-full max-w-5xl px-2 sm:px-6">
        <div class="max-w-2xl">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Our Purpose</p>
          <h2 class="mt-3 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">Mission &amp; Vision</h2>
          <div class="mt-5 h-px w-12 bg-neutral-900 dark:bg-white"></div>
        </div>

        <div class="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
          <div class="border-t border-neutral-200 pt-8 dark:border-neutral-800">
            <div class="flex items-center gap-2.5 text-neutral-900 dark:text-white">
              <Target :size="16" stroke-width="1.5" class="text-neutral-400" />
              <h3 class="text-sm font-semibold tracking-tight">{{ settings.mission.title }}</h3>
            </div>
            <p class="mt-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
              {{ settings.mission.description }}
            </p>
          </div>
          <div class="border-t border-neutral-200 pt-8 dark:border-neutral-800">
            <div class="flex items-center gap-2.5 text-neutral-900 dark:text-white">
              <Eye :size="16" stroke-width="1.5" class="text-neutral-400" />
              <h3 class="text-sm font-semibold tracking-tight">{{ settings.vision.title }}</h3>
            </div>
            <p class="mt-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
              {{ settings.vision.description }}
            </p>
          </div>
        </div>

        <!-- Leadership — clean list -->
        <div class="mt-16 sm:mt-20">
          <div class="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Leadership</p>
              <h3 class="mt-2 text-xl font-medium tracking-tight text-neutral-900 dark:text-white">{{ officers.title }}</h3>
            </div>
            <p class="shrink-0 text-xs text-neutral-400 tabular-nums dark:text-neutral-500">{{ officers.members.length }} members</p>
          </div>
          <ul class="grid gap-x-12 sm:grid-cols-2">
            <li
              v-for="(member, i) in officers.members"
              :key="i"
              class="flex items-center gap-4 border-b border-neutral-200 py-5 dark:border-neutral-800"
            >
              <img
                v-if="member.photoBase64"
                :src="member.photoBase64"
                :alt="member.name"
                class="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-amber-400/70 ring-offset-2 ring-offset-neutral-50 dark:ring-amber-400/60 dark:ring-offset-neutral-900"
              />
              <span v-else class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold uppercase text-neutral-900 ring-2 ring-amber-400/30 ring-offset-2 ring-offset-neutral-50 dark:bg-amber-400 dark:text-neutral-950 dark:ring-offset-neutral-900">
                {{ (member.name || '?').trim().charAt(0) }}
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-neutral-900 dark:text-white">{{ member.name }}</p>
                <p class="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{{ member.position }}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Basis of Faith — minimalist -->
      <section class="mx-auto w-full max-w-3xl px-2 sm:px-6">
        <div class="border-t border-neutral-200 pt-16 dark:border-neutral-800 sm:pt-20">
          <div class="mx-auto max-w-xl text-center">
            <div class="flex flex-col items-center">
              <div class="flex">
                <span class="flex h-10 w-10 items-center justify-center bg-yellow-400 text-xl font-black text-white">I</span>
                <span class="flex h-10 w-10 items-center justify-center bg-green-500 text-xl font-black text-white">V</span>
                <span class="flex h-10 w-10 items-center justify-center bg-blue-500 text-xl font-black text-white">C</span>
                <span class="flex h-10 w-10 items-center justify-center bg-red-500 text-xl font-black text-white">F</span>
              </div>
              <p class="mt-1.5 text-[10px] font-bold uppercase tracking-[0.5em] text-neutral-900 dark:text-white">Philippines</p>
            </div>
            <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">What We Believe</p>
            <h2 class="mt-3 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">{{ basisTitle }}</h2>
            <div class="mx-auto mt-6 h-px w-12 bg-neutral-300 dark:bg-neutral-700"></div>
          </div>
          <ol class="mt-10 divide-y divide-neutral-200 dark:divide-neutral-800">
            <li
              v-for="(point, i) in basisOfFaith"
              :key="i"
              class="flex gap-5 py-5 sm:gap-6"
            >
              <span class="w-7 shrink-0 pt-0.5 text-xs font-medium tabular-nums text-neutral-400 dark:text-neutral-500">{{ String(i + 1).padStart(2, '0') }}</span>
              <p class="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{{ point }}</p>
            </li>
          </ol>
        </div>
      </section>

      <!-- About — minimalist -->
      <section id="about" class="mx-auto w-full max-w-3xl px-2 sm:px-6">
        <div class="border-t border-neutral-200 pt-16 text-center dark:border-neutral-800 sm:pt-20">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">About</p>
          <h2 class="mx-auto mt-3 max-w-md text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
            {{ settings.about.title }}
          </h2>
          <div class="mx-auto mt-6 h-px w-12 bg-neutral-300 dark:bg-neutral-700"></div>
          <p class="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
            {{ settings.about.description }}
          </p>
        </div>
      </section>

      <!-- Contact — full-bleed black band, like the hero. It bleeds past
           <main>'s side gutters and cancels its bottom padding so it sits
           flush with the end of the page. `dark` makes it a dark island: the
           storefront kit and the focus ring use their dark variants in here
           regardless of the page theme. -->
      <section
        id="contact"
        class="dark -mx-4 -mb-24 mt-16 bg-neutral-950 scheme-dark sm:-mx-6 sm:mt-20 md:-mb-8 lg:-mx-12"
      >
        <div class="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-28 pt-20 sm:px-10 sm:pt-24 md:grid-cols-2 md:gap-16 md:pb-24 lg:gap-24 lg:px-16">
          <div>
            <p class="store-eyebrow">Contact</p>
            <h2 class="store-title mt-3">{{ contactTitle }}</h2>
            <div class="mt-5 h-px w-12 bg-amber-400/80"></div>
            <p class="mt-5 max-w-sm text-[15px] leading-relaxed text-neutral-300">
              {{ contactIntro }}
            </p>

            <ul class="mt-10 space-y-7">
              <li class="flex items-start gap-4">
                <Mail :size="16" stroke-width="1.5" class="mt-0.5 shrink-0 text-neutral-500" />
                <div>
                  <p class="store-label">Email</p>
                  <p class="mt-1 text-sm text-white">{{ settings.contact.email }}</p>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <MapPin :size="16" stroke-width="1.5" class="mt-0.5 shrink-0 text-neutral-500" />
                <div>
                  <p class="store-label">Location</p>
                  <p class="mt-1 text-sm text-white">{{ settings.contact.address }}</p>
                </div>
              </li>
              <li>
                <a :href="settings.contact.facebook" target="_blank" rel="noopener" class="group flex w-fit items-start gap-4 rounded-sm">
                  <Facebook :size="16" stroke-width="1.5" class="mt-0.5 shrink-0 text-neutral-500 transition-colors group-hover:text-white" />
                  <div>
                    <p class="store-label">Social</p>
                    <p class="mt-1 text-sm text-white underline decoration-neutral-600 underline-offset-4 transition-colors group-hover:decoration-white">Facebook Page</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <form class="store-card h-fit p-6 sm:p-8" @submit.prevent="handleContactSubmit">
            <div class="space-y-6">
              <div>
                <label for="contact-name" class="store-label">Name</label>
                <input
                  id="contact-name"
                  v-model="contactForm.name"
                  type="text"
                  autocomplete="name"
                  placeholder="Full name"
                  required
                  maxlength="100"
                  class="store-field mt-2"
                />
              </div>
              <div>
                <label for="contact-email" class="store-label">Email</label>
                <input
                  id="contact-email"
                  v-model="contactForm.email"
                  type="email"
                  autocomplete="email"
                  placeholder="Email address"
                  required
                  maxlength="150"
                  class="store-field mt-2"
                />
              </div>
              <div>
                <label for="contact-message" class="store-label">Message</label>
                <textarea
                  id="contact-message"
                  v-model="contactForm.message"
                  rows="4"
                  placeholder="How can we help?"
                  required
                  maxlength="2000"
                  class="store-field mt-2 resize-none"
                ></textarea>
              </div>
              <!-- Honeypot: invisible to people, but form-filling bots tend to fill it. -->
              <div class="hidden" aria-hidden="true">
                <input v-model="contactForm.website" type="text" name="website" tabindex="-1" autocomplete="off" />
              </div>
              <button
                type="submit"
                :disabled="contactSending"
                class="store-btn w-full bg-amber-400 text-neutral-950 hover:bg-amber-300"
              >
                <Loader2 v-if="contactSending" :size="16" class="animate-spin" />
                {{ contactSending ? 'Sending…' : 'Send message' }}
              </button>
              <p
                v-if="contactStatus"
                role="status"
                class="text-center text-[13px] leading-relaxed"
                :class="contactStatus.type === 'success' ? 'text-emerald-400' : 'text-rose-400'"
              >
                {{ contactStatus.text }}
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>

    <!-- Kept outside the sections wrapper: if it were the wrapper's last child,
         `space-y` would give the contact band a bottom margin and leave a light
         strip under it. -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-3 opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="translate-y-3 opacity-0"
    >
      <button
        v-show="showScrollToTopButton"
        type="button"
        aria-label="Return to hero section"
        class="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-amber-300 focus-visible:outline-white sm:right-6 sm:h-14 sm:w-14 md:bottom-6"
        @click="scrollToHero"
      >
        <ArrowUp :size="20" class="sm:h-6 sm:w-6" />
      </button>
    </Transition>
  </AppShell>
</template>

<script setup>
import AppShell from '../components/AppShell.vue'
import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useSession } from '../composables/useSession'
import { useCatalogStore } from '../stores/catalogStore'
import { getLandingPageSettings, DEFAULT_LANDING_PAGE_SETTINGS } from '../services/settingsService'
import { submitContactMessage } from '../services/contactService'
import { formatCurrency } from '../utils/format'
import { getLenis } from '../utils/lenis'
import {
  ShoppingBag,
  Target,
  Eye,
  Mail,
  MapPin,
  Facebook,
  Image,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Loader2
} from 'lucide-vue-next'

const { isAuthenticated } = useSession()
const { products, loadCatalog } = useCatalogStore()

const latestProducts = computed(() => products.value.slice(0, 6))
const loading = ref(true)

// Hero copy is cached from the last visit so a customized title renders right
// away instead of showing the default first and then swapping.
const HERO_CACHE_KEY = 'scf_landing_hero'
const readCachedHero = () => {
  try {
    const raw = localStorage.getItem(HERO_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
const cachedHero = readCachedHero()

const settings = ref(
  cachedHero ? { ...DEFAULT_LANDING_PAGE_SETTINGS, hero: cachedHero } : DEFAULT_LANDING_PAGE_SETTINGS
)
// The hero copy animates in once the real text is known (cache, fetch, or a
// short fallback so a slow connection never hides it).
const heroReady = ref(Boolean(cachedHero))
const HERO_READY_FALLBACK_MS = 800
let heroReadyTimer = null

const heroPhotoRef = ref(null)
const heroPhotoLoaded = ref(false)

const heroDescription = computed(() =>
  settings.value.hero?.description || DEFAULT_LANDING_PAGE_SETTINGS.hero.description
)

// Contact form: emailed via Web3Forms (see contactService). `website` is the honeypot.
const contactForm = reactive({ name: '', email: '', message: '', website: '' })
const contactSending = ref(false)
const contactStatus = ref(null) // { type: 'success' | 'error', text }
const CONTACT_SENT_TEXT = 'Thanks! Your message was sent. We’ll reply to the email you gave.'

const handleContactSubmit = async () => {
  if (contactSending.value) return
  contactStatus.value = null

  // A filled honeypot is almost certainly a bot: act as if it worked, send nothing.
  if (contactForm.website) {
    contactStatus.value = { type: 'success', text: CONTACT_SENT_TEXT }
    return
  }

  contactSending.value = true
  try {
    await submitContactMessage(contactForm)
    contactForm.name = ''
    contactForm.email = ''
    contactForm.message = ''
    contactStatus.value = { type: 'success', text: CONTACT_SENT_TEXT }
  } catch (error) {
    contactStatus.value = {
      type: 'error',
      text: error.message || 'We couldn’t send your message. Please try again.',
    }
  } finally {
    contactSending.value = false
  }
}
// Officers card falls back to defaults when older saved settings lack the key.
const officers = computed(() => settings.value.officers ?? DEFAULT_LANDING_PAGE_SETTINGS.officers)
// Basis of Faith + contact heading/intro fall back the same way so older
// saved settings documents keep rendering until they are re-saved.
const basisTitle = computed(() => settings.value.basisOfFaith?.title || DEFAULT_LANDING_PAGE_SETTINGS.basisOfFaith.title)
const basisOfFaith = computed(() => settings.value.basisOfFaith?.points ?? DEFAULT_LANDING_PAGE_SETTINGS.basisOfFaith.points)
const contactTitle = computed(() => settings.value.contact?.title || DEFAULT_LANDING_PAGE_SETTINGS.contact.title)
const contactIntro = computed(() => settings.value.contact?.intro || DEFAULT_LANDING_PAGE_SETTINGS.contact.intro)
// Stacked hero title: one word per line like GOOD WORK / DESERVES TO / BE SEEN.
// Falls back to full name when the stored title is still the legacy "SCF".
const heroWords = computed(() => {
  const raw = (settings.value.hero?.title || '').trim()
  const source = raw === '' || raw.toUpperCase() === 'SCF' ? 'Silangan Christian Fellowship' : raw
  return source.split(/\s+/).filter(Boolean)
})
const showScrollToTopButton = ref(false)
// The back-to-top button waits a beat at the bottom of the page instead of
// popping in the moment the last section comes into view.
const SCROLL_TOP_DELAY_MS = 1500
let scrollTopTimer = null

const updateScrollState = () => {
  const scrollTop = window.scrollY || window.pageYOffset
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const atBottom = scrollTop + windowHeight >= documentHeight - 8

  if (!atBottom) {
    clearTimeout(scrollTopTimer)
    scrollTopTimer = null
    showScrollToTopButton.value = false
    return
  }

  if (!showScrollToTopButton.value && !scrollTopTimer) {
    scrollTopTimer = setTimeout(() => {
      scrollTopTimer = null
      showScrollToTopButton.value = true
    }, SCROLL_TOP_DELAY_MS)
  }
}

const scrollToHero = () => {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo('#hero', { duration: 1.4 })
  } else {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Lenis is only absent under "reduce motion", so the fallback jumps instead of animating.
const scrollToY = (top, duration) => {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(top, { duration })
  } else {
    window.scrollTo({ top })
  }
}

// Once scrolled, the solid header covers the top of the viewport; land below it.
const headerOffset = () => document.querySelector('header')?.offsetHeight || 68

// Scroll cue target: just below the hero.
const scrollPastHero = () => {
  const hero = document.getElementById('hero')
  if (!hero) return
  scrollToY(window.scrollY + hero.getBoundingClientRect().bottom - headerOffset(), 1.2)
}

const scrollToAbout = () => {
  const about = document.getElementById('about')
  if (!about) return
  scrollToY(window.scrollY + about.getBoundingClientRect().top - headerOffset(), 1.4)
}

const loadHeroCopy = async () => {
  try {
    const landingSettings = await getLandingPageSettings()
    settings.value = landingSettings
    try {
      localStorage.setItem(HERO_CACHE_KEY, JSON.stringify(landingSettings.hero ?? DEFAULT_LANDING_PAGE_SETTINGS.hero))
    } catch {
      // Storage can be unavailable (private mode); the cache is only a nicety.
    }
  } catch (error) {
    console.error('Error fetching landing settings:', error)
  } finally {
    clearTimeout(heroReadyTimer)
    heroReady.value = true
  }
}

onMounted(async () => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', updateScrollState)

  // A cached photo can finish loading before the @load listener matters.
  if (heroPhotoRef.value?.complete) heroPhotoLoaded.value = true

  if (!heroReady.value) {
    heroReadyTimer = setTimeout(() => {
      heroReady.value = true
    }, HERO_READY_FALLBACK_MS)
  }

  // Settings are one small document; don't make the hero wait for the whole
  // catalog (every product plus its variants) before showing the real copy.
  loadHeroCopy()

  try {
    await loadCatalog()
  } catch (error) {
    console.error('Error fetching catalog:', error)
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  clearTimeout(scrollTopTimer)
  clearTimeout(heroReadyTimer)
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', updateScrollState)
})
</script>

<style scoped>
/* Full-screen hero with photo background extending under the transparent header.
   Fallback chain: 100vh -> 100svh (mobile URL bar) -> 100dvh (dynamic).
   Full viewport height (header overlays via absolute positioning, so no offset).
   It is a min-height, so on short screens the hero grows instead of overlapping. */
.hero-fullscreen-transparent {
  min-height: 100vh;
  min-height: 100svh;
  min-height: 100dvh;
}

/* Photo fades in over the dark base and settles from a slight zoom. */
.hero-photo {
  opacity: 0;
  transform: scale(1.06);
  transition:
    opacity 0.8s ease,
    transform 1.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.hero-photo.is-loaded {
  opacity: 1;
  transform: scale(1);
}

/* Hero copy rises in sequence once the real text is known (--reveal-delay per element). */
.hero-reveal {
  opacity: 0;
}

.hero-ready .hero-reveal {
  animation: hero-reveal 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) var(--reveal-delay, 0s) both;
}

@keyframes hero-reveal {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* The global reduced-motion rule shortens animations but keeps their delays,
   so show the copy outright here. */
@media (prefers-reduced-motion: reduce) {
  .hero-reveal,
  .hero-ready .hero-reveal {
    opacity: 1;
    animation: none;
  }
}

/* Dot band under the hero: 3px dots on a 10px × 8px grid, exactly three rows tall. */
.dot-band {
  height: 24px;
  background-image: radial-gradient(circle, rgb(163 163 163) 1.5px, transparent 1.5px);
  background-size: 10px 8px;
}

:where(.dark) .dot-band {
  background-image: radial-gradient(circle, rgb(82 82 82) 1.5px, transparent 1.5px);
}

/* Gentle bob on the scroll cue chevron (stilled by the global reduced-motion rule). */
.scroll-cue-icon {
  animation: scroll-cue 1.8s ease-in-out infinite;
}

@keyframes scroll-cue {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(6px);
    opacity: 1;
  }
}
</style>