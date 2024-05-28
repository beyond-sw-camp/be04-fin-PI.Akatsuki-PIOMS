<template>
  <div class="modal" @click.self="closePopup">
    <div class="modal-content">
      <h3>대분류 카테고리 수정</h3>
      <p>카테고리 코드: {{ currentThirdCode }}</p>
      <p>카테고리 이름: {{ currentThirdName}}</p>
      <input type="text" v-bind:value="currentThirdName" v-on:input="updateThirdName= $event.target.value">
      <button @click="closePopup" class="close-button">X</button>
      <button @click="saveCategoryThird">수정</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  currentThirdCode: String,
  currentThirdName: String,
});
const updateThirdName = ref('');
const emits = defineEmits(['close', 'update:currentSecondName']);

const saveCategoryThird = async () => {
  const requestData = {
    categoryThirdName: updateThirdName.value
  };

  console.log('Request Data:', requestData);

  try {
    const response = await fetch(`/api/admin/category/third/update/${props.currentThirdCode}?requesterAdminCode=1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if(!response.ok) {
      const errorText = await response.text();
      throw new Error(`카테고리 소분류 수정에 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorText}`);
    }

    console.log('카테고리 소분류가 성공적으로 수정되었습니다.');
    emits('close');
  } catch (error) {
    console.error('오류:', error);
  }
};

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
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 500px;
  min-height: 300px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>
