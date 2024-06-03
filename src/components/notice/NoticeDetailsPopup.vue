<template>
  <!-- 공지사항 상세 정보 팝업 -->
  <div class="overlay">
    <div class="notice-form">

      <div style="display: flex; justify-content: space-between;">
        <h2>공지사항 상세 정보</h2>
        <button class="close-btn" @click="$emit('close')">X</button>
      </div>
      
      <table>
        <tr>
          <td class="detailTitle">제목</td>
          <td>{{ notice.noticeTitle }}</td>
        </tr>
        <tr>
          <td class="detailContent">내용</td>
          <td>{{ notice.noticeContent }}</td>
        </tr>
        <tr>
          <td class="label">등록일</td>
          <td>{{ notice.noticeEnrollDate }}</td>
        </tr>
        <tr>
          <td class="label">수정일</td>
          <td>{{ notice.noticeUpdateDate }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  notice: {
    type: Object,
    required: true,
    default: () => ({
      noticeTitle: '',
      noticeContent: '',
      noticeEnrollDate: [],
      noticeUpdateDate: []
    })
  }
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.notice-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.close-btn {
  background: red;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 50px;
  height: 50px;
}

.back {
  margin-top: 10px;
  padding: 10px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
