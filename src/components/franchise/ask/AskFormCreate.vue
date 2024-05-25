<template>
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
        <button @click="closeForm" class="cancel-btn">취소</button>
        <button @click="submitAsk" class="submit-btn">등록</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'AskFormCreate',
  setup() {
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
        window.close();
      } catch (error) {
        console.error('Failed to submit ask:', error);
      }
    };
    const closeForm = () => {
      window.close();
    };

    onMounted(() => {
      fetchFranchiseOwnerData();
    });

    return {
      franchiseOwnerData,
      askTitle,
      askContent,
      closeForm,
      submitAsk
    };
  }
};
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
  width:800px;
  height:40px;
  border: 1px solid #ddd;
  font-size: large;
  font-weight: bold;
}

.detail-table .content-td {
  height: 490px;
  vertical-align: top;
}

.label {
  background-color: #D9D9D9;
  font-weight: bold;
  width: 150px;
}

textarea {
  width: 98%;
  height: 440px;
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
  background-color: rgba(217, 217, 233, 0.56);
}

.submit-btn:hover {
  background-color: rgba(255, 205, 75, 0.69);
}
</style>
