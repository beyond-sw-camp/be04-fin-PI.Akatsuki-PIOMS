<template>
<!--  <router-view></router-view>-->
  <header>
    <RootAdmin/>
  </header>
    <main>
<!--      <Breadcrumb :crumbs="breadcrumbs" />-->
<!--      <AskMain/>-->
<!--<CategoryList/>-->
  <ProductList/>
    </main>
  <footer>
    <Footer/>
  </footer>
</template>

<script setup>
// import AskMain from "@/components/amdin/ask/AskMain.vue";
// import Breadcrumb from "@/components/amdin/ask/Breadcrumb.vue";
// import CategoryList from "@/components/amdin/Category/CategoryList.vue";
import ProductList11 from "@/components/amdin/product/ProductList.vue";
import RootAdmin from "@/components/config/header/RootAdmin.vue";
import Footer from "@/components/config/footer/Footer.vue";
import ProductList from "@/components/amdin/product/ProductList.vue";

</script>

<style lang="scss" scoped>

</style>