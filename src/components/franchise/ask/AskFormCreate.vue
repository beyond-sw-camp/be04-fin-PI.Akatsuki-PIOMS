<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <div class="container">
        <div v-if="franchiseOwnerData" class="form-wrapper">
          <table class="detail-table">
            <tr>
              <td class="label">점주명</td>
              <td>{{ franchiseOwnerData.franchiseOwnerName }}</td>
              <td class="label">가맹점</td>
              <td>{{ franchiseOwnerData.franchiseName }}</td>
            </tr>
            <tr>
              <td class="label">제목</td>
              <td colspan="10"><input type="text" v-model="askTitle" /></td>
            </tr>
            <tr>
              <td class="label">내용</td>
              <td colspan="3" class="content-td"><textarea v-model="askContent"></textarea></td>
            </tr>
          </table>
          <div class="action-buttons">
            <button @click="closeCreate" class="cancel-btn">취소</button>
            <button @click="submitAsk" class="submit-btn">등록</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  closeCreate: Function
});

const franchiseOwnerCode = 1; // 테스트를 위한 하드코딩된 코드
const franchiseOwnerData = ref(null);
const askTitle = ref('');
const askContent = ref('');

const fetchFranchiseOwnerData = async () => {
  try {
    const response = await fetch(`http://localhost:5000/franchise/owner/${franchiseOwnerCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    franchiseOwnerData.value = await response.json();
  } catch (error) {
    console.error('Failed to fetch franchise owner data:', error);
  }
};

const submitAsk = async () => {
  try {
    const response = await fetch(`http://localhost:5000/franchise/ask/create/${franchiseOwnerCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: askTitle.value,
        content: askContent.value,
        franchiseOwnerCode: franchiseOwnerData.value.franchiseOwnerCode,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    props.closeCreate();
  } catch (error) {
    console.error('Failed to submit ask:', error);
  }
};

onMounted(fetchFranchiseOwnerData);
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
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
}

.detail-table input {
  width: 800px;
  height: 40px;
  border: 1px solid #ddd;
  font-size: large;
  font-weight: bold;
}

.detail-table .content-td {
  height: 450px;
  vertical-align: top;
}

.label {
  background-color: #D9D9D9;
  font-weight: bold;
  width: 150px;
}

textarea {
  width: 98%;
  height: 430px !important; /* 높이를 늘렸습니다 */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: large;
}

.action-buttons {
  width: 98%;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  background-color: white;
  padding: 5px;
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

.cancel-btn:hover {
  background-color: red; /* hover 시 빨간색으로 변경 */
}

.submit-btn:hover {
  background-color: green; /* hover 시 녹색으로 변경 */
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
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 50%;
  max-width: 2000px;
  height: 100%;
  overflow-y: auto;
  max-height: 80vh;
}

.popup-content h2 {
  margin-bottom: 20px;
}

.popup-content .form-group {
  margin-bottom: 20px;
}

.popup-content label {
  font-weight: bold;
}

.popup-content input[type="text"],
.popup-content textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  resize: none;
  height: auto;
}

.popup-content button {
  padding: 10px 20px;
  background-color: #9d9d9d;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.popup-content.cancel-btn:hover {
  background-color: orangered;
}

.popup-content.submit-btn:hover {
  background-color: #45a049;
}
</style>
