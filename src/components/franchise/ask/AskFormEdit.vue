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
            <button @click="props.closeEdit" class="cancel-btn">취소</button>
            <button @click="submitUpdate" class="submit-btn">수정</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';

const store = useStore();
const accessToken = store.state.accessToken;
const askData = ref(null);
const props = defineProps(['askCode', 'closeEdit']);
const emit = defineEmits(['refreshData']);

const fetchAskData = async () => {
  if (!props.askCode) {
    console.error('askCode is not defined');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/franchise/ask/${props.askCode}`, {
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
  } catch (error) {
    console.error('Failed to fetch ask data:', error);
  }
};

const formatDate = (dateArray) => {
  if (!dateArray) return '-';
  const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
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

const submitUpdate = async () => {
  const askCode = props.askCode;
  if (!askCode) {
    console.error('askCode is not defined');
    return;
  }
  if (!askData.value.askTitle.trim() || !askData.value.askContent.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '등록 실패',
      text: '제목과 내용은 필수 작성요소입니다.',
    });
    return;
  }
  try {
    const response = await fetch(`http://localhost:5000/franchise/update/${askCode}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
    await Swal.fire({
      icon: 'success',
      title: '수정 성공',
      text: '수정이 완료되었습니다.',
    });
    emit('refreshData');
    props.closeEdit();
    window.location.reload(); // 페이지 새로고침
  } catch (error) {
    console.error('Failed to submit update:', error);
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
  font-size: 16px;
}

.detail-table input {
  width: 98%;
  height: 40px;
  border: 1px solid #ddd;
  font-size: 16px;
}

.detail-table .content-td {
  vertical-align: top;
}

.label {
  background-color: #D9D9D9;
  font-weight: bold;
  width: 150px;
}

textarea {
  width: 98%;
  height: 270px !important;
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
  background-color: orangered;
}

.submit-btn:hover {
  background-color: limegreen;
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
