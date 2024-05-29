<template>
  <div class="modal" @click.self="closePopup">
    <div class="modal-content">
      <button @click="closePopup" class="close-button">x</button>
      <h3>대분류 카테고리 삭제</h3>
      <p>카테고리 코드: {{ currentThirdCode }}</p>
      <p>카테고리 이름: {{ currentThirdName}}</p>
      <button @click="showDeleteModal">삭제</button>
      <div v-if="DeleteModalVisible" class="confirmation-modal">
        <p>삭제하시겠습니까?</p>
        <button @click="deleteCategoryThird" class="confirm-button">예</button>
        <button @click="closeDeleteModal" class="cancel-button">아니오</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps, defineEmits, ref} from 'vue';

const props = defineProps({
  currentThirdCode: String,
  currentThirdName: String,
});
const emits = defineEmits(['close', 'update:currentThirdName']);

const DeleteModalVisible = ref(false);

const showDeleteModal = () => {
  DeleteModalVisible.value = true;
}

const closeDeleteModal = () => {
  DeleteModalVisible.value = false;
}

const deleteCategoryThird = async () => {
  try {
    const productResponse = await fetch(`http://localhost:5000/admin/product/category/${props.currentThirdCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const products = await productResponse.json();

    if(products.length > 0) {
      alert("카테고리를 삭제할 수 없습니다. 해당 카테고리를 사용하는 제품이 존재합니다.");
      return;
    }


    const response = await fetch(`http://localhost:5000/admin/category/third/delete/${props.currentThirdCode}?requesterAdminCode=1`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`카테고리 소분류 수정에 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorText}`);
    }

    console.log('카테고리 대분류가 성공적으로 수정되었습니다.');
    emits('close');
  } catch (error) {
    console.error('오류:', error);
  }
};

const closePopup = () => {
  emits('close');
  window.location.reload();
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
.confirmation-modal {
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
}

.confirmation-modal p {
  margin-bottom: 10px;
}

.confirm-button,
.cancel-button {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 3px;
  margin-right: 10px;
}

.confirm-button {
  background-color: #344DAF;
  color: white;
}

.cancel-button {
  background-color: #FF6285;
  color: white;
}
</style>
