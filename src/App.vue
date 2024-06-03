<template>
  <div class="wrapper24">
    <header>
      <RootAdminHeader v-if="userRole === 'ROLE_ROOT' || userRole === 'ROLE_ADMIN'" />
      <FranchiseHeader v-else-if="userRole === 'ROLE_OWNER'" />
      <DriverHeader v-else-if="userRole === 'ROLE_DRIVER'" />
    </header>

    <main class="content24">
      <router-view />
    </main>

    <footer class="footer24">
      <Footer />
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Footer from "@/components/layouts/footer/Footer.vue";
import RootAdminHeader from "@/components/layouts/header/AdminHeader.vue";
import DriverHeader from "@/components/layouts/header/DriverHeader.vue";
import FranchiseHeader from "@/components/layouts/header/FranchiseHeader.vue";

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
.wrapper24 {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 90vh;
  max-height: 100vh;
}

.content24 {
  flex: 1;
}

.footer24 {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
}
</style>
