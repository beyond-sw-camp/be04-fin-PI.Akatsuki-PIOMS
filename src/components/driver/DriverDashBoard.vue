<template>
<main class="main">

 <div class = "delivery-list-box">
     <div class="delivery-count">
       <img class = "list" src="@/assets/icon/List.png"/>
        배송 현황
     </div>
     <p class="week">(단위: 금일)</p>
   <hr class="hr1"/>
    <div class="delivery-status">
       <div class="before">
         배송전
       </div>
       <div class="ing">
         배송중
       </div>
       <div class="after">
         배송완료
       </div>
    </div>
 </div>


  <div class = "notice-list">
    <div>
        <img class = "notice" src="@/assets/icon/speaker.png"/>
        공지사항 리스트
        <hr class="hr1-1"/>
      <ul class="data-table">
          <li v-for="(notice, index) in sortedNotices" :key="index" class="notice-item" @click="openPopup(notice)">
            <span class="title">{{ notice.noticeTitle }}</span>
            <span class="date">{{ notice.noticeEnrollDate }}</span>
            <hr class ="hr3"/>
          </li>
      </ul>
    </div>
  </div>

  <!-- 공지사항 항목 팝업 -->
  <div v-if="showPopup" class="popup">
    <div class="popup-content">
      <span class="close-btn" @click="closePopup">x</span>
      <h2>{{ selectedNotice.noticeTitle }}</h2>
      <p>{{ selectedNotice.noticeContent }}</p>
    </div>
  </div>

  <div class="my-delivery-list">
    <div>
      <img class = "delivery" src="@/assets/icon/Delivery.png"/>
      내 배송 조회
      <hr class ="hr2"/>
    </div>
  </div>

</main>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";

  const headers = ref([
    { key: 'noticeTitle', label: '공지사항 제목'},
    { key: 'noticeEnrollDate', label: '등록일'},
  ]);

  const notices = ref([]);
  const showPopup = ref(false);
  const selectedNotice = ref({});

  const getNotice = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/notice/list');
      const data = await response.json();
      notices.value = data;
    } catch (error) {
      console.error('공지사항 목록을 가져오는 중 에러가 발생했습니다:', error);
    }
  };

  const openPopup = (notice) => {
    selectedNotice.value = notice;
    showPopup.value = true;
  };

  const closePopup = () => {
    showPopup.value = false;
  };

  const sortedNotices = computed(() => {
    return notices.value.slice().sort((a, b) => {
      return new Date(b.noticeEnrollDate) - new Date(a.noticeEnrollDate);
    });
  });

  onMounted(() => {
    getNotice();
  });
</script>

<style scoped>

 /* 큰 박스 단위들 */
.delivery-list-box {
  margin-top: 42px !important;
  width: 500px;
  height: 300px;
}
.notice-list {
  margin-top: 28px !important;
  width: 500px;
  height: 530px;
  max-height: 500px;
  overflow-y: auto;
}

.my-delivery-list {
  border: 1px solid #d9d9d9;
  margin-top: 0 !important;
  width: 900px;
  height: 870px;
  display: flex;
  position: absolute;
  top: 1px;
  right: 50px;
}

.delivery-list-box,
.notice-list {
  margin-left: 250px !important;
}

 .delivery-list-box,
 .notice-list,
 .my-delivery-list {
   border: 1px solid #d9d9d9;
   border-radius: 8px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
   padding: 20px;
   margin: 10px;
   color: #444444;
 }

/* 그 홈 박스에 각각 들어가는 요소들 */
.delivery-status {
  display: flex;
  padding: 20px;
  position: relative;
  top: 10px;
  margin-left: 50px;
  color: #444444;
}
.week {
  display: flex;
  justify-content: flex-end;
  margin: 0;
  position: relative;
  bottom: 10px;
  color: #d9d9d9;
}

.delivery-count {
  display: flex;
  position: relative;
  top: 10px;
  left: 10px;
  width: 100px;
  color: #444444;
}

.before,
.ing,
.after {
  margin-right: 70px;
  color: #444444;
}

hr.hr1 {
  width: 500px;
  position: relative;
  bottom: 8px;
  margin-bottom: 30px;
}
hr.hr1-1 {
  width: 500px;
  position: relative;
  top:3px;
  margin-bottom: 30px;
}

hr.hr2 {
  width: 900px;
  top: 8px;
  position: relative;
}

 .notice-list img, .my-delivery-list img {
   width: 20px;
   height: 20px;
   margin-right: 8px;
   margin-left: 6px;
   position: relative;
   top: 3px;
 }
 .delivery-count img {
   position: relative;
   bottom: 3px;
   width: 18px;
   height: 20px;
   margin-right: 12px;
 }
 .my-delivery-list img {
   height: 18px;
 }

.date {
  display: flex;
  justify-content: flex-end;
  color: #444444;
}
.title {
  position: relative;
  bottom: 17px;
  left: 10px;
  color: #444444;
  cursor: pointer;
}

 /* 공지사항 항목 팝업 스타일 */
 .popup {
   display: flex;
   justify-content: center;
   align-items: center;
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.5);
   z-index: 9999;
 }
 .popup-content {
   background: #fff;
   padding: 20px;
   border-radius: 8px;
   width: 400px;
   text-align: center;
 }
 .close-btn {
   position: absolute;
   top: 10px;
   right: 10px;
   cursor: pointer;
 }
 .data-table {
   list-style-type: none;
   padding-left: 0;
 }
 hr.hr3 {
   width: 500px;
   position: relative;
   border: 1px solid;
   border-color: #e4e4e4 !important;
   margin-bottom: 30px;
 }
 h2 {
   margin-top: 0;
 }
</style>