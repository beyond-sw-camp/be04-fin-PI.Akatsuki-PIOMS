<template>
  <div class="notice-form">
    <h2>공지사항 수정</h2>
    <button class="close-btn" @click="closeForm">X</button>
    <form @submit.prevent="submitForm">
      <div>
        <label for="noticeTitle">제목</label>
        <input type="text" v-model="noticeTitle" required />
      </div>
      <div>
        <label for="noticeContent">내용</label>
        <textarea v-model="noticeContent" required></textarea>
      </div>
      <button type="submit">수정</button>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['close', 'submit']);

const noticeTitle = ref('');
const noticeContent = ref('');

const submitForm = () => {
  const notice = {
    noticeTitle: noticeTitle.value,
    noticeContent: noticeContent.value
  };
  emit('submit', notice);
};

const closeForm = () => {
  emit('close');
};
</script>

<style scoped>
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
}
</style>
