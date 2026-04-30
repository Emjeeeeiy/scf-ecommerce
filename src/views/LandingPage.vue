<template>
  <AppShell>
    <div class="space-y-16 pb-20">
      <section class="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-16 text-center text-white shadow-2xl sm:px-12 sm:py-24">
        <div class="relative z-10 mx-auto max-w-4xl">
          <div class="mb-6 flex justify-center">
          </div>
          <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl">
            <span class="text-white">SCF</span>
          </h1>
          <p class="mt-6 text-base leading-relaxed text-slate-300 max-w-2xl mx-auto sm:text-lg">
            Silangan Christian Fellowship is a community of believers dedicated to sharing the love of Christ and serving our local community.
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

      <section class="grid gap-6 md:grid-cols-3">
        <div v-for="feature in features" :key="feature.title" class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-hover hover:shadow-md sm:p-8">
          <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <component :is="feature.icon" :size="24" />
          </div>
          <h3 class="mb-2 text-lg font-bold text-slate-900 sm:text-xl">{{ feature.title }}</h3>
          <p class="text-sm text-slate-600 leading-relaxed sm:text-base">{{ feature.description }}</p>
        </div>
      </section>

      <section class="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div class="space-y-6">
          <div class="rounded-2xl bg-slate-50 p-6 border-l-4 border-amber-400 sm:p-8">
            <h2 class="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
              <Target class="text-amber-500" /> Our Mission
            </h2>
            <p class="mt-4 text-slate-600 text-base leading-relaxed sm:text-lg">
              To create meaningful, high-quality apparel that sparks conversation about Christ while generating the resources necessary to serve our local community and expand our ministry.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6 border-l-4 border-blue-400 sm:p-8">
            <h2 class="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
              <Eye class="text-blue-500" /> Our Vision
            </h2>
            <p class="mt-4 text-slate-600 text-base leading-relaxed sm:text-lg">
              To see a community transformed by the Gospel, where every member is equipped to share their faith and every person in need is supported by the hands and feet of Silangan Christian Fellowship.
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
          <h2 class="text-2xl font-black uppercase tracking-tight sm:text-3xl">About SCF</h2>
          <p class="mt-6 text-base font-medium leading-relaxed opacity-90 sm:text-lg">
            Silangan Christian Fellowship started with a small group of believers committed to making a difference. Our fundraising shop isn't just about merchandise—it's a creative outlet for our members to design shirts that reflect our values. 100% of the proceeds go directly into our building fund and outreach projects.
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
                <span class="text-slate-700 font-medium text-sm sm:text-base">hello@silanganchristian.org</span>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <MapPin :size="20" />
                </div>
                <span class="text-slate-700 font-medium text-sm sm:text-base">Silangan, Philippines</span>
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
import { useSession } from '../composables/useSession'
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

const features = [
  {
    title: 'Original Designs',
    description: 'Every shirt features unique artwork created by members of our own fellowship.',
    icon: Palette
  },
  {
    title: 'Direct Impact',
    description: 'Every peso raised goes straight to supporting SCF missions and local outreach.',
    icon: CheckCircle
  },
  {
    title: 'Quality Focused',
    description: 'We use premium materials to ensure your apparel lasts as long as your faith.',
    icon: Truck
  }
]
</script>