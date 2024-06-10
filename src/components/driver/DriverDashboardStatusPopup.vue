<template>
  <div>
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <div class="popup-header">
          <img id="delivery" src="@/assets/icon/Delivery.png"/>
          <h2>배송 상태 수정</h2>
          <div class="action-buttons">
            <button class="cancel-btn" @click="closePopup">취소</button>
            <button class="submit-btn" @click="submitChanges">수정완료</button>
          </div>
        </div>
        <table class="detail-table">
          <tr>
            <td class="label">현재배송상태</td>
            <td>{{ props.deliveryStatus }}</td>
          </tr>
          <tr>
            <td class="label">상태 변경</td>
            <td>
              <div class="radio-buttons">
                <label>
                  <input type="radio" v-model="selectedStatus" value="배송중"> 배송중
                </label>
                <label>
                  <input type="radio" v-model="selectedStatus" value="배송완료"> 배송완료
                </label>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import DriverDashBoard from "@/components/driver/DriverDashBoard.vue";
import {useStore} from "vuex";
import invoice from "@/components/driver/Invoice.vue";

const store = useStore();
const accessToken = store.state.accessToken;

const props = defineProps({
  deliveryStatus: String,
  invoice: Object
});

console.log(props.invoice);
const invoiceCode = props.invoice.invoiceCode;
console.log(invoiceCode);


const emits = defineEmits(['close']);

const showPopup = ref(true);
const selectedStatus = ref(props.deliveryStatus); // 변경된 상태를 저장하는 변수

const closePopup = () => {
  showPopup.value = false;
  emits('close');
};

const submitChanges = async () => {
  try {
    // 배송 상태가 유효한지 확인
    if (!selectedStatus.value) {
      console.error('invoiceCode 또는 deliveryStatus 값이 유효하지 않습니다.');
      return;
    }

    console.log(props.invoiceCode, selectedStatus.value);

    const response = await fetch(`http://localhost:5000/driver/invoice/status/${invoiceCode}/delivery/${selectedStatus.value}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('수정 실패:', errorMessage);
      throw new Error(`수정 실패: ${errorMessage}`);
    }
    location.reload(DriverDashBoard);
    closePopup();
  } catch (error) {
    console.error('수정 실패:', error);
  }
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.popup-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 430px;
  max-width: 2000px;
  height: 150px;
  overflow-y: auto;
  max-height: 90vh;
}

.popup-header {
  display: flex;
  justify-content:flex-start;
  margin-left: 5px;
}

.popup-header h2 {
  margin: 0;
  margin-left: 10px;
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-left: 140px;
  margin-bottom: 10px;
}

.cancel-btn, .submit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.cancel-btn {
  background-color: #d9d9d9;
  color: black;
}

.submit-btn {
  background-color: #ffcd4b;
  color: black;
}

.cancel-btn:hover {
  background-color: #444;
}

.submit-btn:hover {
  background-color: #d9d9d9;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
}

.detail-table td {
  border: 1px solid #ddd;
  padding: 15px;
  font-size: 16px;
}

.label {
  background-color: #d9d9d9;
  font-weight: bold;
  width: 150px;
}

.radio-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.radio-buttons label {
  font-size: 16px;
  cursor: pointer;
}

.radio-buttons input[type="radio"] {
  margin-right: 5px;
}

#delivery {
  width: 22px;
  height: 20px;
}
</style>
