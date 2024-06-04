<template>
  <div>
    <div class="modal" @click.self="closeDeletePopup">
      <div class="modal-content">
        <h3>상품 노출 상태 변경</h3>
        <p>상품 코드: {{ currentProductCode }}</p>
        <p>상품명: {{ currentProductName }}</p>
        <p>현재 상품 노출 상태: {{ currentProductExposureStatus ? '노출' : '미노출' }}</p>
        <button @click="closeDeletePopup" class="close-button">x</button>
        <button @click="deleteProduct">수정</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
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
    const response = await fetch(`http://api.pioms.shop/admin/product/delete/${props.currentProductCode}`, {
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
      // 페이지를 새로 고쳐 변경된 내용을 반영합니다.
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
    await Swal.fire({
      icon: 'warning',
      title: '오류 발생!',
      text: '오류가 발생하였습니다.',
    });
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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  text-align: center;
}

.close-button {
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 10px;
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
