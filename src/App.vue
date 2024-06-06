<template>
  <section class="fb__wrap">
    <header class="fb__header">
      <AdminHeader v-if="userRole === 'ROLE_ROOT' || userRole === 'ROLE_ADMIN'" />
      <FranchiseHeader v-else-if="userRole === 'ROLE_OWNER'" />
      <DriverHeader v-else-if="userRole === 'ROLE_DRIVER'" />
    </header>
    <article>
      <router-view />
    </article>
  </section>


<!--    <footer class="footer24">-->
<!--      <Footer />-->
<!--    </footer>-->
</template>

<script setup>
import {computed, onMounted} from 'vue';
import {useStore} from 'vuex';
import Footer from "@/components/layouts/footer/Footer.vue";
import AdminHeader from "@/components/layouts/header/AdminHeader.vue";
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

.fb__wrap{
  position: absolute;
  top: 106px;
  right: 0;
  bottom: 0;
  left: 0;
  width: auto;
  height: auto;
}

.fb__header{
  position: absolute;
  top: -106px;
  width: 100%;
}





</style>
