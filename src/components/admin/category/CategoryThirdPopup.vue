<template>
  <div class="modal">
    <div class="modal-content">
      <h3>소분류 카테고리 수정</h3>
      <p>카테고리 코드: {{ currentThirdCode }}</p>
      <p>카테고리 이름: {{ currentThirdName}}</p>
      <input type="text" v-bind:value="currentThirdName" v-on:input="updateThirdName= $event.target.value">
      <div class="button-container">
        <button @click="saveCategoryThird" class="update-button">수정</button>
        <button @click="closePopup" class="close-button">취소</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useStore } from 'vuex';
import CategoryList from "@/components/admin/category/CategoryList.vue";
import Swal from "sweetalert2";

const store = useStore();
const accessToken = store.state.accessToken;

const props = defineProps({
  currentThirdCode: String,
  currentThirdName: String,
});
const updateThirdName = ref('');
const emits = defineEmits(['close', 'update:currentSecondName']);

const saveCategoryThird = async () => {
  if (!updateThirdName.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '카테고리명 누락',
      text: '카테고리명을 입력해주세요.',
    });
    return;
  }
  const requestData = {
    categoryThirdName: updateThirdName.value
  };

  console.log('Request Data:', requestData);

  try {
    const response = await fetch(`http://api.pioms.shop/admin/category/third/update/${props.currentThirdCode}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if(!response.ok) {
      const errorText = await response.text();
      throw new Error(`카테고리 소분류 수정에 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorText}`);
    }

    await Swal.fire({
      icon: 'success',
      title: '카테고리 수정 성공!',
      text: '카테고리 소분류가 성공적으로 수정되었습니다.',
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
  min-width: 300px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.confirmation-modal p {
  margin-bottom: 10px;
}

.button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 4%;
}

.update-button,
.close-button {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 3px;
  margin-right: 10px;
}

.update-button {
  background-color: #344DAF;
  border: none;
  color: white;
}

.close-button {
  background-color: #FF6285;
  border: none;
  color: white;
}
</style>

