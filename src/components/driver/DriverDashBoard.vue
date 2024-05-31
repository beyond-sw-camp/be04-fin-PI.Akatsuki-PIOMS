<template>
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

  <!-- 배송기사 배송 조회 -->
  <div class="my-delivery-list">
    <div>
      <img class = "delivery" src="@/assets/icon/Delivery.png"/>
      내 배송 조회
      <hr class ="hr2"/>

  <table class="read-filter">
    <tr class="paTable">
      <td class="filter-label">배송상태</td>
      <td class="filter1">
        <div class="radio-group">
          <div class="title">
          <label id="delivery-status"><input type="radio" value="" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter" checked> 전체 </label>
          <label id="delivery-status"><input type="radio" value="배송전" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"> 배송전 </label>
          <label id="delivery-status"><input type="radio" value="배송중" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"> 배송중 </label>
          <label id="delivery-status"><input type="radio" value="배송완료" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"> 배송완료 </label>
          </div>
        </div>
      </td>
      <td class="filter-label1">주문(발주)번호</td>
      <td class="filter1">
        <input type="text" class="filter-input" placeholder="주문(발주)번호를 입력해주세요." v-model="filterText" />
      </td>
    </tr>
    <tr class="paTable">
      <td class="filter-label">배송지</td>
      <td>
        <input type="text" class="filter-input" placeholder="배송지를 입력해주세요." v-model="filterText" />
      </td>
      <td class="filter-label1">배송(송장)번호</td>
      <td>
        <input type="text" class="filter-input" placeholder="배송지를 입력해주세요." v-model="filterText" />
      </td>
    </tr>
      </table>

      <!-- 리셋, 검색 버튼 -->
      <div class="button-container">
        <button type="button" class="btn-reset" @click="resetFilters">
          <img class="reset-icon" src="@/assets/icon/reset.png" />
        </button>
        <button type="button" class="btn-search" @click="applyFilters">
          <img class="search-icon" src="@/assets/icon/search.png" />
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import { useStore } from 'vuex';

const store = useStore();
const accessToken = store.state.accessToken;

  const headers = ref([
    { key: 'noticeTitle', label: '공지사항 제목'},
    { key: 'noticeEnrollDate', label: '등록일'},
  ]);

  const notices = ref([]);
  const showPopup = ref(false);
  const selectedNotice = ref({});

  const getNotice = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/notice/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

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
  width: 1000px;
  height: 870px;
  display: flex;
  position: absolute;
  top: 1px;
  right: 25px;
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
   font-size: 16px;
   font-weight: bold;
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
  width: 1000px;
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

 /* 배송기사 배송조회 CSS */
 .read-filter {
   position: relative;
   top: 15px;
   left: 10px;
   display: inline;
 }
 .paTable {
   font-weight: bold;
   text-align: center;
   width: 200px;
   height: 10px;
   border: 1px solid #ddd;
 }
 .filter1 {
   width: 360px;
   padding: 8px;
 }
 .title {
   display: flex;
   justify-content: center;
   font-size: 16px;
   position: relative;
   top: 5px;
 }
 .filter-label {
   font-size: 16px;
   width: 80px;
 }
 .filter-label1 {
   font-size: 16px;
   width: 110px;
   background-color: #d9d9d9;
   font-weight: bold;
 }
 .filter-input {
   font-size: 16px;
   width: 250px;
   display: flex;
   justify-content: flex-start;
   border-right: 1px solid #d9d9d9;
 }
 #delivery-status {
   display: flex;
   justify-content: flex-start;
   align-items: center;
   position: relative;
   right: 10px;
 }
 .filter-input {
   padding: 10px;
   height: 30px;
 }

 /* 리셋, 검색 버튼 */
 .btn-reset,
 .btn-search {
   border: none;
   background-color: #ffffff;

 }
 .button-container {
   display: flex;
   justify-content: center;
   padding-top: 40px;
 }
 .reset-icon,
 .search-icon {
   width: 30px !important;
   height: 30px !important;
 }

</style>