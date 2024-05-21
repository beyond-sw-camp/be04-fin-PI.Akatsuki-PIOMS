<template>

    <main>
      <Breadcrumb :crumbs="breadcrumbs" />
      <AskMain/>
    </main>

</template>

<script setup>
import AskMain from "@/components/franchise/ask/AskMain.vue";
import Breadcrumb from "@/components/franchise/ask/Breadcrumb.vue";

const breadcrumbs = [
  { label: '공지 및 문의 관리', link: '/notice' },
  { label: '문의사항 관리', link: '/notice/inquiry' },
  { label: '문의사항 조회 및 관리', link: null },
];
</script>

<style lang="scss" scoped>

</style>