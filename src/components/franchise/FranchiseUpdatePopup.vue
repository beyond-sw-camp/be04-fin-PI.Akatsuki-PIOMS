<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <div class="container">
        <div v-if="franchiseData" class="form-wrapper">
          <table class="detail-table">
            <tr>
              <td class="label">가맹점명</td>
              <td><input type="text" v-model="franchiseData.franchiseName" /></td>
              <td class="label">가맹점 주소</td>
              <td><input type="text" v-model="franchiseData.franchiseAddress" /></td>
            </tr>
            <tr>
              <td class="label">전화번호</td>
              <td><input type="text" v-model="franchiseData.franchiseCall" /></td>
              <td class="label">사업자등록번호</td>
              <td><input type="text" v-model="franchiseData.franchiseBusinessNum" /></td>
            </tr>
            <tr>
              <td class="label">배송 요일</td>
              <td><input type="text" v-model="franchiseData.franchiseDeliveryDate" /></td>
              <td class="label">관리자 코드</td>
              <td><input type="number" value="1" readonly /></td>
            </tr>
            <tr>
              <td class="label">등록일</td>
              <td>{{ formatDate(franchiseData.franchiseEnrollDate) }}</td>
              <td class="label">수정일</td>
              <td>{{ formatDate(franchiseData.franchiseUpdateDate) }}</td>
            </tr>
            <tr>
              <td class="label">점주코드</td>
              <td><input type="number" v-model="franchiseData.franchiseOwnerCode" /></td>
              <td class="label">배송기사 코드</td>
              <td><input type="number" v-model="franchiseData.driverCode" /></td>
            </tr>
          </table>
          <div class="answer-section">
            <div class="action-buttons">
              <button @click="updateFranchise" class="delete-btn">수정</button>
              <button @click="deleteFranchise" class="delete-btn">삭제</button>
              <button @click="closeUpdate" class="cancel-btn">취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { defineEmits } from 'vue';
import { useStore } from 'vuex';
import Swal from "sweetalert2";

const store = useStore();
const accessToken = store.state.accessToken;
const franchiseData = ref(null);
const emit = defineEmits(['refreshData']);
const props = defineProps({
  franchiseCode: Number,
  closeUpdate: Function
})

const fetchFranchiseData = async () => {
  const franchiseCode = props.franchiseCode;
  if (!franchiseCode) {
    console.error('franchiseCode is not defined');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/admin/franchise/detail/${franchiseCode}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch franchise data: ${response.statusText}`);
    }
    const data = await response.json();
    franchiseData.value = data;
  } catch (error) {
    console.error('Failed to fetch franchise data:', error);
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date';
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const updateFranchise = async () => {
  const franchiseCode = props.franchiseCode;
  if (!franchiseCode) {
    console.error('그런거 없다.')
    return;
  }
  try {
    const response = await fetch(`http://localhost:5000/admin/franchise/update/${franchiseCode}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        franchiseName: franchiseData.value.franchiseName,
        franchiseAddress: franchiseData.value.franchiseAddress,
        franchiseCall: franchiseData.value.franchiseCall,
        franchiseBusinessNum: franchiseData.value.franchiseBusinessNum,
        franchiseDeliveryDate: franchiseData.value.franchiseDeliveryDate,
        franchiseOwner: {
          franchiseOwnerCode: franchiseData.value.franchiseOwnerCode,
        },
        deliveryDriver: {
          driverCode: franchiseData.value.deliveryManCode, // 변경된 부분
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit edit: ${response.statusText}`);
    }

    await Swal.fire({
      icon: 'success',
      title: '수정 성공',
      text: '수정이 완료되었습니다.',
    });
    emit('refreshData');
    props.closeUpdate();
  } catch (error) {
    console.error('Failed to submit edit:', error);
  }
}

const deleteFranchise = async () => {
  const franchiseCode = props.franchiseCode;
  if(!franchiseCode) {
    console.error('그런거 없다');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/admin/franchise/delete/${franchiseCode}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if(!response.ok) {
      throw new Error(`Failed to delete franchise: ${response.statusText}`);
    }

    await Swal.fire({
      icon: 'success',
      title: '삭제 성공',
      text: '삭제가 완료되었습니다.',
    });
    emit('refreshData');
    props.closeUpdate();
  } catch (error) {
    console.error('Failed to delete franchise:', error);
  }
}
onMounted(fetchFranchiseData);
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
