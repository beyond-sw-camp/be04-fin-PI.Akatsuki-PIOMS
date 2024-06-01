<template>
  <div class="notice-form">
    <div class="title">
      <h2 class="register">공지사항 등록</h2>
    </div>
    <form @submit.prevent="submitForm">
      <div>
        <label class="noticeTitle" for="noticeTitle">제목</label>
        <input type="text"  placeholder="공지사항 제목을 입력해주세요." v-model="noticeTitle" required/>
      </div>
      <div>
        <label for="noticeContent">내용</label>
        <textarea v-model="noticeContent" placeholder="공지사항 내용을 입력해주세요." required></textarea>
      </div>
      <button type="submit">등록</button>
      <button class="close-btn" @click="closeForm">취소</button>
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
.title {
  background-color: #9a9a9a;
}
.register {
  margin: 0;
  margin-bottom: 10px;
  font-size: 20px;

}
.notice-form {
  background: #ffffff;
  padding: 0px 10px 10px 10px;
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
