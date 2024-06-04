<template>
  <div class="popup-overlay">
    <div class="popup-content">
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
          <td colspan="3">{{ askData.askTitle }}</td>
        </tr>
        <tr>
          <td class="label">내용:</td>
          <td colspan="3" class="content-td">{{ askData.askContent }}</td>
        </tr>
        <tr>
          <td class="label">등록일:</td>
          <td>{{ formatDate(askData.askEnrollDate) }}</td>
          <td class="label">수정일:</td>
          <td>{{ formatDate(askData.askUpdateDate) }}</td>
        </tr>
      </table>
      <div class="answer-section">
        <label for="answer">관리자 답변</label>
        <textarea id="answer" v-model="answer" placeholder="문의에 대한 답변을 작성해주세요."></textarea>
        <div class="action-buttons">
          <button @click="closeEdit" class="cancel-btn">취소</button>
          <button @click="submitAnswer" class="submit-btn">수정</button>
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
const askData = ref(null);
const answer = ref('');
const emit = defineEmits(['refreshData']);
const props = defineProps({
  askCode: Object,
  closeEdit: Function
});

const fetchAskData = async () => {
  const askCode = props.askCode.askCode;
  if (!askCode) {
    console.error('askCode is not defined');
    return;
  }
  try {
    const response = await fetch(`http://localhost:5000/admin/ask/${askCode}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ask data: ${response.statusText}`);
    }

    const data = await response.json();
    askData.value = data;
    answer.value = data.askAnswer || ''; // 이미 작성된 답변을 불러옵니다.
  } catch (error) {
    console.error('Failed to fetch ask data:', error);
  }
};

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

const submitAnswer = async () => {
  const askCode = props.askCode.askCode;
  if (!askCode) {
    console.error('askCode is not defined');
    return;
  }
  try {
    const response = await fetch(`http://localhost:5000/admin/ask/answer/${askCode}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: answer.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit answer: ${response.statusText}`);
    }

    await Swal.fire({
      icon: 'success',
      title: '수정 성공',
      text: '수정이 완료되었습니다.',
    });
    emit('refreshData');
    props.closeEdit();
    window.location.reload(); // 페이지 새로고침
  } catch (error) {
    console.error('Failed to submit answer:', error);
  }
};

onMounted(fetchAskData);
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
  //border-radius: 8px;
  //box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.detail-table .content-td {
  height: 200px; /* 여기에서 원하는 높이를 설정합니다 */
  vertical-align: top;
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
  //padding: 5px;
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
  background-color: #FD6F87;
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
  background-color: limegreen; /* hover 시 녹색으로 변경 */
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
  width: 50%;
  max-width: 2000px;
  height: 65%;
  overflow-y: auto;
  max-height: 84vh;
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

</style>
