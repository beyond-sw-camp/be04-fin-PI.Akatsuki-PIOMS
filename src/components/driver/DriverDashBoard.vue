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
      <div class="delivery-status-box">
        <div class="before-div">{{ beforeDiv }}</div>
        <div class="ing-div">{{ ingDiv }}</div>
        <div class="after-div">{{afterDiv}}</div>
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

<!-- 여기서부터 배송 항목 조회 -->
  <div class="my-delivery-list">
    <div>
      <img class="delivery" src="@/assets/icon/Delivery.png"/>
      내 배송 조회
      <hr class="hr2"/>
      <table class="delivery-list">
        <tr class="paTable">
          <td class="filter-label">배송상태</td>
          <td class="filter1">
            <div class="radio-group">
              <div class="delivery-status-title">
                <label id="delivery-status"><input type="radio" value="전체" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"> 전체 </label>
                <label id="delivery-status"><input type="radio" value="배송전" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"> 배송전 </label>
                <label id="delivery-status"><input type="radio" value="배송중" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"> 배송중 </label>
                <label id="delivery-status"><input type="radio" value="배송완료" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"> 배송완료 </label>
              </div>
            </div>
          </td>
        </tr>
      </table>
      <!-- 리셋, 검색 버튼 -->
      <div class="button-container">
        <button class="btn-reset" @click="resetFilter">
          <img class="reset-icon" src="@/assets/icon/reset.png" />
        </button>
      </div>


      <br/>
      <div v-if="filteredOrders.length">
        <table class="delivery-table">
          <thead>
          <tr>
            <th class="no">No</th>
            <th class="order">주문 번호</th>
            <th class="invoiceCode">송장 번호</th>
            <th class="address">배송지</th>
            <th class="status">배송 상태</th>
            <th class="owner">점주명</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(order, index) in filteredOrders" :key="order.orderCode">
            <td>{{ index + 1 }}</td>
            <td>{{ order.orderCode }}</td>
            <td class="invoice" @click="openInvoicePopup(order)">{{ order.invoiceCode }}</td>
            <td>{{ order.franchiseAddress }}</td>
            <td style="cursor: pointer" @click="openStatusPopup(order)">{{ order.deliveryStatus }}</td>
            <td>{{ order.franchiseOwnerName }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 송장 팝업 -->
    <Invoice v-if="showInvoicePopup" :invoice="selectedInvoice" @close="closeInvoicePopup" />

    <div v-if="showInvoicePopup" class="popup">
      <div>
        <span class="invoice-close-btn" @click="closeInvoicePopup">x</span>
        <Invoice :invoice="selectedInvoice" />
      </div>
    </div>


    <!-- 배송 상태 수정 팝업 -->
    <DriverDashboardStatusPopup
        v-if="showStatusPopup"
        :invoice="selectedInvoice"
        :deliveryStatus="deliveryStatus"
        @close="closeStatusPopup"
    />

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from 'vuex';
import Invoice from "@/components/driver/Invoice.vue";
import DriverDashboardStatusPopup from "@/components/driver/DriverDashboardStatusPopup.vue";

const store = useStore();
const accessToken = store.state.accessToken;

const lists = ref([]);
const showStatusPopup = ref(false);
const showInvoicePopup = ref(false);
const selectedInvoice = ref('');
const deliveryStatus = ref('');

const beforeDiv = ref();
const driverCode = 8;

const openInvoicePopup = (order) => {
  selectedInvoice.value = order;
  showInvoicePopup.value = true;
};

const closeInvoicePopup = () => {
  showInvoicePopup.value = false;
};

const openStatusPopup = (order) => {
  selectedInvoice.value = order;
  deliveryStatus.value = order.deliveryStatus;
  showStatusPopup.value = true;
};

const closeStatusPopup = () => {
  showStatusPopup.value = false;
};

const getCountBeforeDelivery = async () => {
  try {
    const response = await fetch(`http://api.pioms.shop/driver/${driverCode}/before-delivery/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('응답 텍스트:', responseText);

    if (!responseText) {
      throw new Error('응답이 비어 있습니다.');
    }

    beforeDiv.value = responseText;

  } catch (error) {
    console.error('배송전 송장 수를 가져오는 중 에러가 발생했습니다:', error);
  }
};
const ingDiv = ref();
const getCountIngDelivery = async () => {
  try {
    const response = await fetch(`http://api.pioms.shop/driver/${driverCode}/ing-delivery/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('응답 텍스트:', responseText);

    if (!responseText) {
      throw new Error('응답이 비어 있습니다.');
    }

    ingDiv.value = responseText;

  } catch (error) {
    console.error('배송완료 송장 수를 가져오는 중 에러가 발생했습니다:', error);
  }
};
const afterDiv = ref();
const getCountAfterDelivery = async () => {
  try {
    const response = await fetch(`http://api.pioms.shop/driver/${driverCode}/complete-delivery/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('응답 텍스트:', responseText);

    if (!responseText) {
      throw new Error('응답이 비어 있습니다.');
    }

    afterDiv.value = responseText;

  } catch (error) {
    console.error('배송완료 송장 수를 가져오는 중 에러가 발생했습니다:', error);
  }
};

const list = ref([]);
const headers = ref([
  { key: 'noticeTitle', label: '공지사항 제목' },
  { key: 'noticeEnrollDate', label: '등록일' },
]);
const notices = ref([]);
const showPopup = ref(false);
const selectedNotice = ref({});
const getNotice = async () => {
  try {
    const response = await fetch('http://api.pioms.shop/driver/notice/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('응답 텍스트:', responseText);

    if (!responseText) {
      throw new Error('응답이 비어 있습니다.');
    }

    const data = JSON.parse(responseText);
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

// 검색필터
const conditionFilter = ref('');
const filteredOrders = ref([]);
const driverDashBoard = ref([]);
const applyFilter = () => {
  filteredOrders.value = driverDashBoard.value.filter(order =>
      conditionFilter.value === '전체' || conditionFilter.value === ''
          ? true
          : order.deliveryStatus === conditionFilter.value
  );
};
const resetFilter = () => {
  conditionFilter.value = '';
  applyFilter();
};
// 대쉬보드
const getDriverDashBoard = async () => {
  try {
    const response = await fetch('http://api.pioms.shop/driver/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('네트워크 오류 발생');
    }
    const data = await response.json();
    driverDashBoard.value = data.order || [];
    applyFilter();
  } catch (error) {
    console.error('오류 발생:', error);
  }
};

const currentPage = ref(1);
const totalPages = ref(1);

onMounted(() => {
  getNotice();
  getDriverDashBoard();
  getCountBeforeDelivery();
  getCountIngDelivery();
  getCountAfterDelivery();
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
  width: 750px;
  height: 870px;
  display: flex;
  position: absolute;
  top: 100px;
  right: 80px;
  overflow-y: auto;
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
  justify-content: space-between;
  position: relative;
  top: 50px;
  margin-left:  35px;
  margin-right: 35px;
  color: #444444;
}
 .delivery-status-box {
   display: flex;
   position: relative;
   align-items: center;
   justify-content: space-between;
   margin-left: 15px;
   margin-right: 15px;
   top: 30px;
   font-size: 30px;
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
  position: relative;
  top: -45px;
  color: #444444;
}
.before-div,
.ing-div,
.after-div {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 2px solid #d9d9d9;
  padding: 20px;
  width: 60px;
  height: 60px;
}

.before {
  border-radius: 8px;
  background-color: #FFCD4B;
  color: #ffffff;
  width: 70px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ing {
  border-radius: 8px;
  background-color: #344DAF;
  color: #ffffff;
  width: 70px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.after {
  border-radius: 8px;
  background-color: #B9B9B9;
  color: #ffffff;
  width: 80px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 750px;
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
   position: relative; /* 추가된 부분 */
 }

 .close-btn {
   position: absolute; /* 변경된 부분 */
   top: 8px; /* 변경된 부분 */
   right: 15px; /* 변경된 부분 */
   cursor: pointer;
   font-size: 20px;
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
 .paTable {
   font-weight: bold;
   text-align: center;
   width: 200px;
   height: 10px;
   border: 1px solid #ddd;
 }
 .filter1 {
   width: 660px;
   padding: 8px;
   border: 1px solid #d9d9d9;
   position: relative;
   left: -4px;
 }

 .delivery-status-title {
   display: flex;
   justify-content: flex-start;
   font-size: 14px;
 }
 .delivery-status-title input {
   position: relative;
   top: 1px;
 }
 .filter-label {
   font-size: 14px;
   width: 80px;
   background-color: #d9d9d9;
 }

 /* 리셋, 검색 버튼 */
 .btn-reset,
 .btn-search {
   border: none;
   background-color: #ffffff;
   cursor: pointer;
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

 /* 조회 표 */
.delivery-list {
  position: relative;
  top: 15px;

}

 .delivery-table {
  height: 50px;
 }

 .delivery-table th {
   width: 1000px;
   height: 40px;
   background-color: #d9d9d9;
 }
 .delivery-table td {
   text-align: center;
   height: 40px;
 }

 .no {
   width: 100px !important;
 }
 .order {
   width: 500px !important;
 }
 .invoiceCode {
   width: 500px !important;
 }
.address {
  width: 2500px !important;
}
.status{
  width: 500px !important;
}
.owner {
  width: 500px !important;
}

.invoice {
  cursor: pointer;
  text-decoration: underline #444444;
}

 .invoice-close-btn {
   position: absolute !important;
   top: 130px !important;
   right: 430px !important;
   cursor: pointer;
   font-size: 20px;
   color: #444444;
   z-index: 9999;
 }
</style>
