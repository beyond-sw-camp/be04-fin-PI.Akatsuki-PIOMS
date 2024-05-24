<template>
  <header>
    <!-- <RootAdmin/> -->
   <AdminHeader/>
<!--    <FranchiseHeader/>-->
<!--    <DriverHeader/>-->
  </header>
  
  <main>
  <router-view></router-view>
  <!-- <ProductList/> -->
  </main>

  <footer>
    <!-- <Footer/> -->
  </footer>
</template>

<script setup>
// import AskMain from "@/components/amdin/ask/AskMain.vue";
// import Breadcrumb from "@/components/amdin/ask/Breadcrumb.vue";
// import CategoryList from "@/components/amdin/Category/CategoryList.vue";
import RootAdmin from "@/components/config/header/RootAdmin.vue";
import Footer from "@/components/config/footer/Footer.vue";
import ProductList from "@/components/amdin/product/ProductList.vue";
// import AdminHeader from "@/components/config/header/AdminHeader.vue";
// import DriverHeader from "@/components/config/header/DriverHeader.vue";
// import FranchiseHeader from "@/components/config/header/FranchiseHeader.vue";
</script>

<style lang="scss" scoped>

</style>