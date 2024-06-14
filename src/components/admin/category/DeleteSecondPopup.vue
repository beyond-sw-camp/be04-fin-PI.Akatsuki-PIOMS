<template>
  <div class="modal" @click.self="closePopup">
    <div class="modal-content">
      <h3>중분류 카테고리 삭제</h3>
      <p>카테고리 코드: {{ currentSecondCode }}</p>
      <p>카테고리 이름: {{ currentSecondName}}</p>
      <div class="button-container">
        <button @click="deleteCategorySecond" class="confirm-button">삭제</button>
        <button @click="closePopup" class="cancel-button">취소</button>
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
  currentSecondCode: String,
  currentSecondName: String,
});
const emits = defineEmits(['close', 'update:currentSecondName']);

const DeleteModalVisible = ref(false);

const showDeleteModal = () => {
  DeleteModalVisible.value = true;
}

const closeDeleteModal = () => {
  DeleteModalVisible.value = false;
}
const deleteCategorySecond = async () => {

  try {
    const categoryThirdResponse = await fetch(`http://api.pioms.shop/admin/category/third/list/detail/categorysecond/${props.currentSecondCode}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    const categoryThirds = await categoryThirdResponse.json();

    if(categoryThirds.length > 0) {
      await Swal.fire({
        icon: 'warning',
        title: '중분류 카테고리 삭제 실패',
        text: '카테고리를 삭제할 수 없습니다. 하위 카테고리가 존재합니다.',
      });
      return;
    }

    const response = await fetch(`http://api.pioms.shop/admin/category/second/delete/${props.currentSecondCode}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    await Swal.fire({
      icon: 'success',
      title: '카테고리 삭제 성공!',
      text: '중분류 카테고리를 삭제하였습니다.',
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
  border: none;
  color: white;
}

.cancel-button {
  background-color: #FF6285;
  border: none;
  color: white;
}
</style>
