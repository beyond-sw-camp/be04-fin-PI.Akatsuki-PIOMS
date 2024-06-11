<template>
  <div class="popup-overlay" @click.self="showPostPopup">
    <div class="popup-content">
      <div class="container">
        <div class="form-wrapper">
          <table class="detail-table">
            <tr>
              <td class="label">가맹점명</td>
              <td><input type="text" v-model="insertName" /></td>
              <td class="label">가맹점 주소</td>
              <td><input type="text" v-model="insertAddress" /></td>
            </tr>
            <tr>
              <td class="label">전화번호</td>
              <td><input type="text" v-model="insertCall" /></td>
              <td class="label">사업자등록번호</td>
              <td><input type="text" v-model="insertBusinessNum" /></td>
            </tr>
            <tr>
              <td class="label">배송 요일</td>
              <td><input type="text" v-model="insertDeliveryDate" /></td>
              <td class="label">점주코드</td>
              <td><input type="number" v-model="insertFrOwnerCode" /></td>
            </tr>
            <tr>
              <td class="label">관리자 코드</td>
              <td><input type="number" v-model="insertAdmin" value="1" readonly /></td>
              <td class="label">배송기사 코드</td>
              <td><input type="number" v-model="insertDeliveryMan" /></td>
            </tr>
          </table>
          <div class="answer-section">
            <div class="action-buttons">
              <button @click="saveFranchise" class="delete-btn">등록</button>
              <button @click="closePopup" class="cancel-btn">취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import { useStore } from 'vuex';
import Swal from "sweetalert2";

const store = useStore();
const accessToken = store.state.accessToken;

const emit = defineEmits(['close']);
const insertName = ref('');
const insertAddress = ref('');
const insertCall = ref('');
const insertBusinessNum = ref('');
const insertDeliveryDate = ref('');
const insertFrOwnerCode = ref('');
const insertAdmin = ref(1);
const insertDeliveryMan = ref('');

const showPostPopup = () => {
  emit('close');
}
const closePopup = () => {
  emit('close');
}
const saveFranchise = async () => {
  const requestData = {
    franchiseName: insertName.value,
    franchiseAddress: insertAddress.value,
    franchiseCall: insertCall.value,
    franchiseBusinessNum: insertBusinessNum.value,
    franchiseDeliveryDate: insertDeliveryDate.value,
    franchiseOwner: {
      franchiseOwnerCode: insertFrOwnerCode.value
    },
    adminCode: insertAdmin.value,
    deliveryDriver: { // 수정된 부분
      driverCode: insertDeliveryMan.value,
    }
  }

  console.log("Request Data:", requestData);

  try {
    const response = await fetch("http://localhost:5000/admin/franchise/register", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if(!response.ok) {
      const errorText = await response.text();
      throw new Error(`가맹점 등록에 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorText}`);
    }

    await Swal.fire({
      icon: 'success',
      title: '가맹점 등록 성공!',
      text: '가맹점 등록에 성공하였습니다.',
    });
    emit('close');
  } catch (error) {
    console.error('error:', error);
  }
}
</script>


<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}

.form-wrapper {
  width: 100%;
  max-width: 1200px;
  background-color: #fff;
  box-sizing: border-box;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  align-content: center;
  justify-content: center;
  margin-bottom: 40px;
}

.detail-table td {
  border: 1px solid #ddd;
  padding: 15px;
  font-size: 16px;
}

.password-field {
  display: flex;
  align-items: center;
}

.password-field input {
  margin-right: 10px;
}

.reset-password-btn {
  background-color: #d9d9d9;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 6px;
  font-size: 14px;
  font-weight: bold;
}

.reset-password-btn:hover {
  background-color: #6d6d6d;
  color: white;
}

.label {
  background-color: #D9D9D9;
  font-weight: bold;
  width: 150px;
}

.answer-section {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  background-color: #D9D9D9;
}

textarea {
  width: 98%;
  height: 210px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: medium;
}

.action-buttons {
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  background-color: white;
}

.cancel-btn {
  background-color: #D9D9D9;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
}

.submit-btn {
  background-color: #FFCD4B;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
}

.delete-btn {
  background-color: #FF6285;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
}

.cancel-btn:hover,
.submit-btn:hover,
.delete-btn:hover {
  background-color: #6d6d6d;
}

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
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 55%;
  max-width: 2000px;
  height: 42%;
  overflow-y: auto;
  max-height: 84vh;
}
</style>
