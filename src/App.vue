<template>
  <header>
    <RootAdmin/>
<!--    <AdminHeader/>-->
<!--    <FranchiseHeader/>-->
<!--    <DriverHeader/>-->
  </header>

  <main class="main">
  <router-view/>
  </main>

  <aside>
    <!-- <Sidebar/> -->
  </aside>

  <footer>
    <Footer/>
  </footer>

</template>

<script setup>
import Footer from "@/components/layouts/footer/Footer.vue";
import RootAdmin from "@/components/layouts/header/RootAdminHeader.vue";
import Sidebar from "@/components/layouts/sidebar/SideBar.vue";
import DriverHeader from "@/components/layouts/header/DriverHeader.vue";
import FranchiseHeader from "@/components/layouts/header/FranchiseHeader.vue";
import AdminHeader from "@/components/layouts/header/AdminHeader.vue";


import { onMounted } from 'vue';
import {useStore} from 'vuex';

const store = useStore();

onMounted(async () => {
  await store.dispatch('initializeAuth');

  // URL에서 토큰이 있는 경우 로그인 처리
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
