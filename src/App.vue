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

<!--  <aside>-->
<!--    <Sidebar/>-->
<!--  </aside>-->

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
</script>

<style scoped>
.main {
  width: 1900px;
  position: relative;
  left: 110px;
  height: 1200px;
}
</style>