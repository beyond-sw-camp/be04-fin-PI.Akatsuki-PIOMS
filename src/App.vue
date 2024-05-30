<template>
  <header>
    <!-- <RootAdmin/> -->
  </header>

  <main>
    <router-view />
  </main>

  <aside>
    <!-- <Sidebar/> -->
  </aside>

  <footer>
    <Footer />
  </footer>

</template>

<script setup>
import Footer from "@/components/config/footer/Footer.vue";
import RootAdmin from "@/components/config/header/RootAdmin.vue";
import Sidebar from "@/components/config/sidebar/sidebar.vue";

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
