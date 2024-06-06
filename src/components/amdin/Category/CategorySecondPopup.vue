<template>
  <div class="modal">
    <div class="modal-content">
      <h3>중분류 카테고리 수정</h3>
      <p>카테고리 코드: {{ currentSecondCode }}</p>
      <p>카테고리 이름: {{ currentSecondName}}</p>
      <input type="text" v-bind:value="currentSecondName" v-on:input="updateSecondName= $event.target.value">
      <button @click="closePopup" class="close-button">X</button>
      <button @click="saveCategorySecond">수정</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useStore } from 'vuex';
import CategoryList from "@/components/amdin/Category/CategoryList.vue";
import Swal from "sweetalert2";

const store = useStore();
const accessToken = store.state.accessToken;

const props = defineProps({
  currentSecondCode: String,
  currentSecondName: String,
});

const updateSecondName = ref('');
const emits = defineEmits(['close', 'update:currentSecondName']);

const saveCategorySecond = async () => {
  if (!updateSecondName.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '카테고리명 누락',
      text: '카테고리명을 입력해주세요.',
    });
    return;
  }
  const requestData = {
    categorySecondName: updateSecondName.value
  };

  console.log('Request Data:', requestData);

  try {
    const response = await fetch(`http://api.pioms.shop/admin/category/second/update/${props.currentSecondCode}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if(!response.ok) {
      const errorText = await response.text();
      throw new Error(`카테고리 중분류 수정에 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorText}`);
    }

    await Swal.fire({
      icon: 'success',
      title: '카테고리 수정 성공!',
      text: '카테고리 중분류가 성공적으로 수정되었습니다.',
    });
    location.reload(CategoryList);
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
