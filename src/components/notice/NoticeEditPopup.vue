<template>
  <div class="edit-form" v-if="notice">
    <h2>공지사항 수정</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="noticeTitle">제목</label>
        <input type="text" id="noticeTitle" v-model="notice.noticeTitle" required>
      </div>
      <div class="form-group">
        <label for="noticeContent">내용</label>
        <textarea id="noticeContent" v-model="notice.noticeContent" required></textarea>
      </div>
      <button type="submit">저장</button>
      <button type="submit" @click="closeForm" class="close-btn">취소</button>
    </form>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

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

const emit = defineEmits(['close', 'submit']);

// v-model로 양방향 바인딩되는 noticeTitle과 noticeContent를 props.notice로 변경합니다.
// submitForm 함수도 변경하여 notice 객체를 이용합니다.
const submitForm = () => {
  emit('submit', props.notice);
};

// closeForm 함수는 변경하지 않습니다.
const closeForm = () => {
  emit('close');
};
</script>

<style scoped>
.edit-form {
  background: #444444;
  padding: 20px;
  border-radius: 10px;
  border-color: #d9d9d9;
  border: 5px;
  max-width: 500px;
  width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001; /* 팝업 창이 가장 위에 오도록 z-index 조정 */
}

.close-btn {
  background: #d9d9d9;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

</style>
