<template>
  <div id="app">
    <header>
      <RootAdminHeader v-if="userRole === 'ROLE_ROOT'" />
      <AdminHeader v-else-if="userRole === 'ROLE_ADMIN'" />
      <FranchiseHeader v-else-if="userRole === 'ROLE_OWNER'" />
      <DriverHeader v-else-if="userRole === 'ROLE_DRIVER'" />
    </header>

    <main class="main">
      <router-view />
    </main>

    <aside>
      <!-- <Sidebar /> -->
    </aside>

    <footer>
      <Footer />
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Footer from "@/components/layouts/footer/Footer.vue";
import RootAdminHeader from "@/components/layouts/header/RootAdminHeader.vue";
import DriverHeader from "@/components/layouts/header/DriverHeader.vue";
import FranchiseHeader from "@/components/layouts/header/FranchiseHeader.vue";
import AdminHeader from "@/components/layouts/header/AdminHeader.vue";

const store = useStore();
const userRole = computed(() => store.getters.userRole);

onMounted(async () => {
  await store.dispatch('initializeAuth');

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    localStorage.setItem('accessToken', token);
    await store.dispatch('initializeAuth');
  }
});
</script>

<style scoped>
.main {
  margin-top: 2%;
}
</style>
