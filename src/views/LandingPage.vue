<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Navbar -->
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800">
          Fashion Store
        </h1>

        <div class="space-x-4">
          <router-link
            to="/user/pre-order"
            class="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition"
          >
            Pre-Order
          </router-link>

          <router-link
            to="/login"
            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
          >
             Login
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="flex items-center justify-center min-h-[85vh] px-6">
      <div class="text-center max-w-3xl">

        <h2 class="text-5xl font-bold text-gray-800 leading-tight mb-6">
          Welcome to Our <span class="text-yellow-500">Clothing Ecommerce</span>
        </h2>

        <p class="text-gray-600 text-lg mb-8">
          Discover trendy outfits, stylish collections, and easy pre-order
          shopping made just for you.
        </p>

        <!-- <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/pre-order"
            class="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-semibold text-lg transition"
          >
            Shop Now
          </router-link>

          <router-link
            to="/login"
            class="px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl font-semibold text-lg transition"
          >
            Admin Login
          </router-link>
        </div> -->

      </div>
    </section>

  </div>
</template>

<script setup>
// No script needed for now
</script>