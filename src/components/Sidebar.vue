<template>
  <div class="flex min-h-screen bg-gray-100">
    
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg">
      <div class="p-6 border-b">
        <h1 class="text-2xl font-bold text-gray-800">
          Admin Panel
        </h1>
      </div>

      <nav class="mt-6 px-4">
        
        <!-- Dashboard -->
        <router-link
          to="/admin/dashboard"
          class="block py-3 px-4 mb-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
          active-class="bg-blue-500 text-white"
        >
          Dashboard
        </router-link>

        <router-link
          to="/admin/user-management"
          class="block py-3 px-4 mb-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
          active-class="bg-blue-500 text-white"
        >
          User Management
        </router-link>

        <!-- Pre-Order -->
        <router-link
          to="/admin/pre-order"
          class="block py-3 px-4 mb-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
          active-class="bg-blue-500 text-white"
        >
          Products & Orders
        </router-link>

        <!-- Settings -->
        <router-link
          to="/admin/settings"
          class="block py-3 px-4 mb-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
          active-class="bg-blue-500 text-white"
        >
          Settings
        </router-link>

      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <router-view />
    </main>

  </div>
</template>

<script>
export default {
  name: "SidebarLayout"
}
</script>