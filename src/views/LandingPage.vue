<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Navbar -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800">
          Fashion Store
        </h1>

        <div class="hidden md:flex items-center gap-4">
          <a href="#hero" class="text-gray-700 hover:text-yellow-500">Home</a>
          <a href="#shirts" class="text-gray-700 hover:text-yellow-500">Shirts</a>
          <a href="#mission" class="text-gray-700 hover:text-yellow-500">Mission & Vision</a>
          <a href="#about" class="text-gray-700 hover:text-yellow-500">About</a>
          <a href="#contact" class="text-gray-700 hover:text-yellow-500">Contact</a>

          <router-link
            to="/login"
            class="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition"
          >
            Shop Login
          </router-link>

          <router-link
            to="/register"
            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
          >
            Register
          </router-link>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section
      id="hero"
      class="min-h-[90vh] flex items-center justify-center px-6"
    >
      <div class="text-center max-w-4xl">
        <h2 class="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Welcome to Our
          <span class="text-yellow-500"> Clothing Ecommerce</span>
        </h2>

        <p class="text-lg text-gray-600 mb-8">
          Discover trendy outfits, stylish collections, and premium quality
          fashion made for your everyday lifestyle.
        </p>

        <router-link
          to="/login"
          class="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl font-semibold text-lg transition"
        >
          Shop Now
        </router-link>
      </div>
    </section>

    <!-- FEATURED SHIRTS -->
    <section id="shirts" class="py-20 bg-white px-6">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-12">
          Featured Products
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="bg-gray-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <div class="p-6 text-center">
              <h3 class="text-xl font-semibold mb-2">
                {{ product.productName }}
              </h3>
              <p class="text-gray-600 mb-3">
                {{ product.category }}
              </p>
              <p class="text-blue-600 font-bold">
                ₱{{ Number(product.price || 0).toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MISSION VISION -->
    <section id="mission" class="py-20 px-6 bg-gray-100">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        <div class="bg-white rounded-2xl shadow-md p-8">
          <Target class="w-10 h-10 text-yellow-500 mb-4" />
          <h2 class="text-2xl font-bold mb-4">
            Our Mission
          </h2>
          <p class="text-gray-600">
            To provide affordable, stylish, and high-quality clothing while
            delivering the best customer shopping experience.
          </p>
        </div>

        <div class="bg-white rounded-2xl shadow-md p-8">
          <Eye class="w-10 h-10 text-yellow-500 mb-4" />
          <h2 class="text-2xl font-bold mb-4">
            Our Vision
          </h2>
          <p class="text-gray-600">
            To become one of the leading fashion ecommerce brands trusted by
            customers for quality and style.
          </p>
        </div>

      </div>
    </section>

    <!-- ABOUT -->
    <section id="about" class="py-20 px-6 bg-white">
      <div class="max-w-5xl mx-auto text-center">
        <Users class="mx-auto w-12 h-12 text-yellow-500 mb-4" />

        <h2 class="text-4xl font-bold text-gray-800 mb-6">
          About Us
        </h2>

        <p class="text-gray-600 text-lg leading-relaxed">
          We are passionate about helping people express themselves through
          fashion. Our store focuses on premium quality clothing that combines
          comfort, confidence, and modern trends for every generation.
        </p>
      </div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="py-20 px-6 bg-gray-100">
      <div class="max-w-4xl mx-auto text-center">
        <Phone class="mx-auto w-12 h-12 text-yellow-500 mb-4" />

        <h2 class="text-4xl font-bold text-gray-800 mb-6">
          Contact Us
        </h2>

        <div class="space-y-3 text-gray-600 text-lg">
          <p>Email: fashionstore@gmail.com</p>
          <p>Phone: +63 912 345 6789</p>
          <p>Address: San Pablo City, Laguna, Laguna</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  Target,
  Eye,
  Users,
  Phone
} from 'lucide-vue-next'
import { watchActiveProducts } from '../services/store'

const products = ref([])

const featuredProducts = computed(() => products.value.slice(0, 3))

let stopProducts = null

onMounted(() => {
  stopProducts = watchActiveProducts((items) => {
    products.value = items
  })
})

onUnmounted(() => {
  stopProducts?.()
})
</script>