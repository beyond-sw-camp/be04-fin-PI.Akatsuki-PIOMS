<template>
  <div class="container">
    <div v-if="askData" class="form-wrapper">
      <table class="detail-table">
        <tr>
          <td class="label">점주명:</td>
          <td>{{ askData.franchiseOwnerName }}</td>
          <td class="label">가맹점:</td>
          <td>{{ askData.franchiseName }}</td>
        </tr>
        <tr>
          <td class="label">제목:</td>
          <td colspan="3">
            <input v-model="askData.askTitle" placeholder="제목을 입력하세요" />
          </td>
        </tr>
        <tr>
          <td class="label">내용:</td>
          <td colspan="3" class="content-td">
            <textarea v-model="askData.askContent" placeholder="내용을 입력하세요"></textarea>
          </td>
        </tr>
        <tr>
          <td class="label">등록일:</td>
          <td>{{ formatDate(askData.askEnrollDate) }}</td>
          <td class="label">수정일:</td>
          <td>{{ formatDate(askData.askUpdateDate) }}</td>
        </tr>
      </table>
      <div class="action-buttons">
        <button @click="closeForm" class="cancel-btn">취소</button>
        <button @click="submitUpdate" class="submit-btn">수정</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
  name: 'AskFormEdit',
  setup() {
    const askData = ref(null);
    const route = useRoute();

    const fetchAskData = async () => {
      const askCode = route.query.askCode || route.params.askCode;
      if (!askCode) {
        console.error('askCode is not defined');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/franchise/ask/${askCode}`);
        askData.value = response.data;
      } catch (error) {
        console.error('Failed to fetch ask data:', error);
      }
    };

    const formatDate = (dateArray) => {
      if (!dateArray || dateArray.length === 0) return '날짜 없음';
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
      const date = new Date(year, month - 1, day, hour, minute, second);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    };

    const closeForm = () => {
      window.close();
    };

    const submitUpdate = async () => {
      const askCode = route.query.askCode || route.params.askCode;
      if (!askCode) {
        console.error('askCode is not defined');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/franchise/update/${askCode}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: askData.value.askTitle,
            content: askData.value.askContent,
          }),
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        window.close();
      } catch (error) {
        console.error('Failed to submit update:', error);
      }
    };

    onMounted(fetchAskData);

    return {
      askData,
      formatDate,
      closeForm,
      submitUpdate
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
  margin-bottom: 20px;
  border-radius: 8px;
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
  border-radius: 4px;
}

.detail-table .content-td {
  //height: 30px;
  vertical-align: top;
}

.label {
  background-color: #D9D9D9;
  font-weight: bold;
  width: 150px;
}

textarea {
  width: 98%;
  height: 460px;
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
