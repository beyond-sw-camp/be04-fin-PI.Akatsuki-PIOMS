<template>
    <ProductPostPopup v-if="openDetailPopup" @close="openDetailPopup = false" :item="selectedItem" />
</template>

<script setup>
// 기존 코드는 여기에 있음

import ProductPostPopup from "@/components/amdin/product/ProductPostPopup.vue";

const selectedItem = ref(null);

const openDetailPopup = (item) => {
  // 클릭한 아이템 정보 확인을 위한 예시
  console.log(item);

  // 팝업을 열기 위해 showPostPopup 변수를 true로 변경
  selectedItem.value = item;
  openDetailPopup.value = true;
};
</script>