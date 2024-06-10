<template>
  <div class="notice-form">

      <div class="title">
        공지사항 등록
      </div>
    <div style="padding: 20px">
      <form @submit.prevent="submitForm">
        <div >
          <label class="noticeTitle" for="noticeTitle">제목</label><br><br>
          <input class="input-title" type="text"  placeholder="공지사항 제목을 입력해주세요." v-model="noticeTitle" required/>
        </div>
        <br>
        <div>
          <label for="noticeContent">내용</label><br><br>
          <textarea class="text-area" v-model="noticeContent" placeholder="공지사항 내용을 입력해주세요." required></textarea>
        </div>
        <br>
        <div style="  float: right;" >
          <button class="regist-btn" type="submit">등록</button>
          <button class="close-btn" @click="closeForm">취소</button>
        </div>
      </form>
      <br><br>
    </div>
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
.input-title{
  width: 100%;
  border: 2px solid black;
}

.title {
  background-color: #d9d9d9;
  font-size: 20px;
  font-weight: 500;
  padding: 10px;
  padding-left: 20px;
  border-radius: 10px;
}
.register {
  margin: 0;
  margin-bottom: 10px;
  font-size: 20px;

}
.notice-form {
  background: #ffffff;
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
  background: #9a9a9a;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.regist-btn {
  background: #9a9a9a;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.text-area{
  width: 100%;
  height: 200px;
  border: 2px solid black;

}
</style>
