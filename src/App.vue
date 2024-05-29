<template>
  <header>
    <RootAdmin/>
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
</script>
