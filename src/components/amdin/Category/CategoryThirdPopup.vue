<template>
  <div class="modal" @click.self="closePopup">
    <div class="modal-content">
      <h3>대분류 카테고리 수정</h3>
      <p>카테고리 코드: {{ currentThirdCode }}</p>
      <button @click="closePopup">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentThirdCode: String,
});

const emits = defineEmits(['close']);

const closePopup = () => {
  emits('close');
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}
</style>
