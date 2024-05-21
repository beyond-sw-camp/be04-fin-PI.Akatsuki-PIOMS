<!-- Breadcrumb.vue -->
<template>
  <div class="breadcrumbs">
    <img src="@/assets/icon/List.png" alt="List Icon" class="breadcrumb-icon" />
    <span v-for="(crumb, index) in crumbs" :key="index">
      <router-link v-if="crumb.link" :to="crumb.link">{{ crumb.label }}</router-link>
      <span v-else>{{ crumb.label }}</span>
      <span v-if="index < crumbs.length - 1"> &gt; </span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    crumbs: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.breadcrumbs {
  font-size: 16px;
  margin-bottom: 15px;
  display: flex;
  justify-content: left;
  font-weight: bold;
}
.breadcrumbs span {
  margin: 0 5px;
}
.breadcrumbs a {
  color: #000;
  text-decoration: none;
  font-weight: bolder;
}
.breadcrumbs a:hover {
  text-decoration: underline;
}
</style>