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
     <Footer/>
  </footer>

</template>

<script setup>
import Footer from "@/components/config/footer/Footer.vue";
import RootAdmin from "@/components/config/header/RootAdmin.vue";
import Sidebar from "@/components/config/sidebar/sidebar.vue";
import DriverHeader from "@/components/config/header/DriverHeader.vue";
import FranchiseHeader from "@/components/config/header/FranchiseHeader.vue";
import AdminHeader from "@/components/config/header/AdminHeader.vue";
</script>
