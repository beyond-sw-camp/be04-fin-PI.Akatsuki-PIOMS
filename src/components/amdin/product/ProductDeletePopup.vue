<template>
  <div>
    <div class="modal">
      <div class="modal-content">
        <h3>상품 노출 상태 변경</h3>
        <p>상품 코드: {{ currentProductCode }}</p>
        <p>상품명: {{ currentProductName }}</p>
        <p>현재 상품 노출 상태: {{ currentProductExposureStatus ? '노출' : '미노출' }}</p>
        <button @click="deleteProduct" class="action-button">수정</button>
        <button @click="closeDeletePopup" class="close-button">닫기</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
import { useStore } from 'vuex';
import Swal from "sweetalert2";

const store = useStore();
const accessToken = store.state.accessToken;

const props = defineProps({
  currentProductCode: String,
  currentProductName: String,
  currentProductExposureStatus: Boolean,
  closeDeletePopup: Function
});

const deleteProduct = async () => {
  try {
    const newStatus = !props.currentProductExposureStatus;
    const response = await fetch(`http://localhost:5000/admin/product/delete/${props.currentProductCode}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({productExposureStatus: newStatus})
    });

    if (response.ok) {
      await Swal.fire({
        icon: 'success',
        title: '변경 성공!',
        text: '상품 노출 상태가 변경되었습니다.',
      });
      props.closeDeletePopup();
      location.reload();
    } else {
      await Swal.fire({
        icon: 'error',
        title: '변경 실패!',
        text: '상품 노출 상태 변경에 실패하였습니다.',
      });
    }
  } catch (error) {
    console.error('Error updating product exposure status:', error);
  }
};
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close-button {
  background: #e0e0e0;
  color: #333333;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 10px;
}

.close-button:hover {
  background: #cccccc;
}

.action-button {
  background: #4caf50;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

.action-button:hover {
  background: #45a049;
}

button {
  margin-top: 10px;
}
</style>
