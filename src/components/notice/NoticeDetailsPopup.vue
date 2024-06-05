<template>
  <!-- 공지사항 상세 정보 팝업 -->
  <div class="overlay">
    <div class="notice-form">

      <div class="title" style="display: flex; justify-content: space-between;">
        <h2>공지사항 상세 정보</h2>
        <button class="close-btn" @click="$emit('close')">X</button>
      </div>

      <div class="form-group">
          <div class="noticeTitle">제목</div>
          <div class="input-title">{{ notice.noticeTitle }}</div>
      </div>
      <br>
        <div>
          <div class="noticeContent">내용</div>
          <div class="text-area">{{ notice.noticeContent }}</div>
        </div>
        <div>
          <div class="label">등록일</div>
          <div>{{ notice.noticeEnrollDate }}</div>
        </div>
        <div>
          <div class="label">수정일</div>
          <div>{{ notice.noticeUpdateDate }}</div>
        </div>


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
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.notice-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border-color: #d9d9d9;
  border: 5px;
  max-width: 500px;
  width: 100%;
  min-height: 500px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001; /* 팝업 창이 가장 위에 오도록 z-index 조정 */

}

.close-btn {
  background: #444444;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 40px;
  height: 40px;
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

.close-btn {
  background: #d9d9d9;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

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
  //padding: 0px 10px 10px 10px;
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
