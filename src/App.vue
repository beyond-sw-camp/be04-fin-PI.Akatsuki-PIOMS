<template>
  <header>
    <RootAdmin />
  </header>
  <div class="content">
    <aside>
      <Sidebar :currentLoc="currentLoc" />
    </aside>
    <main>
      <router-view />
    </main>
  </div>
  <footer>
    <Footer />
  </footer>
</template>

<script setup>
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import Footer from "@/components/config/footer/Footer.vue"
import RootAdmin from "@/components/config/header/RootAdmin.vue"
import Sidebar from "@/components/config/sidebar/sidebar.vue";
const currentLoc = ref('home')
const route = useRoute()

// Watch for route changes
watch(
  () => route.meta.sidebar,
  (newVal) => {
    currentLoc.value = newVal
  },
  { immediate: true }
)

onBeforeRouteUpdate((to, from, next) => {
  currentLoc.value = to.meta.sidebar
  next()
})

</script>

<style scoped>
header, footer {
  width: 100%;
}

.content {
  display: flex;
  box-sizing: border-box;
}

aside {
  width: 20%;
  box-sizing: border-box;
}

main {
  width: 80%;
  box-sizing: border-box;
}
</style>

<style scoped>
header, footer {
  width: 100%;
}

.content {
  display: flex;
  box-sizing: border-box;
}

aside {
  width: 20%;
  box-sizing: border-box;
}

main {
  width: 80%;
  box-sizing: border-box;
}
</style>
