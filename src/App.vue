<template>
  <header>
    <RootAdmin/>
<!--    <AdminHeader/>-->
<!--    <FranchiseHeader/>-->
<!--    <DriverHeader/>-->
  </header>

  <main>
  <router-view/>
  </main>

<!--  <aside>-->
<!--    <Sidebar/>-->
<!--  </aside>-->

  <footer>
  </footer>

</template>

<script setup>
import Footer from "@/components/layouts/footer/Footer.vue";
import RootAdmin from "@/components/layouts/header/RootAdmin.vue";
import Sidebar from "@/components/layouts/sidebar/sidebar.vue";
import DriverHeader from "@/components/layouts/header/DriverHeader.vue";
import FranchiseHeader from "@/components/layouts/header/FranchiseHeader.vue";
import AdminHeader from "@/components/layouts/header/AdminHeader.vue";
</script>
