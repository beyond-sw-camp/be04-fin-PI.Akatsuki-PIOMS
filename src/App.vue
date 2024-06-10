<template>
  <section class="fb__wrap">
    <header class="fb__header">
      <AdminHeader v-if="userRole === 'ROLE_ROOT' || userRole === 'ROLE_ADMIN'" />
      <FranchiseHeader v-else-if="userRole === 'ROLE_OWNER'" />
      <DriverHeader v-else-if="userRole === 'ROLE_DRIVER'" />

    </header>
    <article class="fb__content">
      <router-view />

    <footer class="fb__footer">
      <Footer/>
    </footer>

    </article>

  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
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

    const url = new URL(window.location);
    url.searchParams.delete('token');
    window.history.replaceState({}, document.title, url.toString());
  }
});
</script>

<style scoped>
.fb__wrap {
  position: absolute;
  top: 106px;
  right: 0;
  bottom: 0;
  left: 0;
  width: auto;
  height: auto;
}

.fb__header {
  position: absolute;
  top: -106px;
  width: 100%;
}

.fb__content {
  position: relative;
  top: 0;
  padding-bottom: 100px; /* 나중에 지우고 대시보드 수정해야함 대시보드쪽 다 고정 px들어가있음*/
  right: 0;
  bottom: 0;
  left: 0;
  min-height: 100%;
}

.fb__footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  padding-right: 20px;
  color: #666666;
  background: #fff;
  font-size: 11px;
  text-align: right;
  line-height: 52px;
  border-top: 1px solid #d7d7d7;
  box-sizing: border-box;
}
</style>
