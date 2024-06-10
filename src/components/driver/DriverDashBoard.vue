<template>
  <div class="container">
    <div class="content">
      <div class="delivery-list-box">
        <div class="delivery-count">
          <img class="list" src="@/assets/icon/List.png" />
          배송 현황
        </div>
        <p class="week">(단위: 금일)</p>
        <hr class="hr1" />
        <div class="delivery-status">
          <div class="status-item before">배송전</div>
          <div class="status-item ing">배송중</div>
          <div class="status-item after">배송완료</div>
        </div>
        <div class="delivery-status-box">
          <div class="status-value before-div">{{ beforeDiv }}</div>
          <div class="status-value ing-div">{{ ingDiv }}</div>
          <div class="status-value after-div">{{ afterDiv }}</div>
        </div>
      </div>

      <div class="notice-list">
        <div class="notice-header">
          <img class="notice-icon" src="@/assets/icon/speaker.png" />
          공지사항 리스트
        </div>
        <hr class="hr1-1" />
        <ul class="data-table">
          <li
            v-for="(notice, index) in sortedNotices"
            :key="index"
            class="notice-item"
            @click="openPopup(notice)"
          >
            <span class="title">{{ notice.noticeTitle }}</span>
            <span class="date">{{ notice.noticeEnrollDate }}</span>
            <hr class="hr3" />
          </li>
        </ul>
      </div>

      <!-- 공지사항 항목 팝업 -->
      <div v-if="showPopup" class="popup">
        <div class="popup-content">
          <span class="close-btn" @click="closePopup">x</span>
          <h2>{{ selectedNotice.noticeTitle }}</h2>
          <p>{{ selectedNotice.noticeContent }}</p>
        </div>
      </div>
    </div>

    <!-- 배송 항목 조회 -->
    <div class="my-delivery-list">
      <div>
        <img class="delivery-icon" src="@/assets/icon/Delivery.png" />
        내 배송 조회
        <hr class="hr2" />
        <table class="delivery-list">
          <tr class="paTable">
            <td class="filter-label">배송상태</td>
            <td class="filter1">
              <div class="radio-group">
                <div class="delivery-status-title">
                  <label id="delivery-status"
                    ><input
                      type="radio"
                      value="전체"
                      name="ConditionOrder"
                      v-model="conditionFilter"
                      @change="applyFilter"
                    />
                    전체</label
                  >
                  <label id="delivery-status"
                    ><input
                      type="radio"
                      value="배송전"
                      name="ConditionOrder"
                      v-model="conditionFilter"
                      @change="applyFilter"
                    />
                    배송전</label
                  >
                  <label id="delivery-status"
                    ><input
                      type="radio"
                      value="배송중"
                      name="ConditionOrder"
                      v-model="conditionFilter"
                      @change="applyFilter"
                    />
                    배송중</label
                  >
                  <label id="delivery-status"
                    ><input
                      type="radio"
                      value="배송완료"
                      name="ConditionOrder"
                      v-model="conditionFilter"
                      @change="applyFilter"
                    />
                    배송완료</label
                  >
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

        <br />
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
              <tr
                v-for="(order, index) in filteredOrders"
                :key="order.orderCode"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ order.orderCode }}</td>
                <td class="invoice" @click="openInvoicePopup(order)">
                  {{ order.invoiceCode }}
                </td>
                <td>{{ order.franchiseAddress }}</td>
                <td
                  style="cursor: pointer"
                  @click="openStatusPopup(order)"
                >
                  {{ order.deliveryStatus }}
                </td>
                <td>{{ order.franchiseOwnerName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 송장 팝업 -->
    <Invoice
      v-if="showInvoicePopup"
      :invoice="selectedInvoice"
      @close="closeInvoicePopup"
    />

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
import Swal from "sweetalert2";

const store = useStore();
const accessToken = store.state.accessToken;

const lists = ref([]);
const showStatusPopup = ref(false);
const showInvoicePopup = ref(false);
const selectedInvoice = ref('');
const deliveryStatus = ref('');

const beforeDiv = ref();
const driverCode = 1;

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
    const response = await fetch(`http://localhost:5000/driver/${driverCode}/before-delivery/count`, {
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
    const response = await fetch(`http://localhost:5000/driver/${driverCode}/ing-delivery/count`, {
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
    const response = await fetch(`http://localhost:5000/driver/${driverCode}/complete-delivery/count`, {
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

onMounted(() => {
  getCountBeforeDelivery();
  getCountIngDelivery();
  getCountAfterDelivery();
});

const conditionFilter = ref('전체');
const orders = ref([
  { orderCode: '12345', invoiceCode: 'INV12345', franchiseAddress: '서울시 강남구', deliveryStatus: '배송전', franchiseOwnerName: '홍길동' },
  { orderCode: '12346', invoiceCode: 'INV12346', franchiseAddress: '서울시 서초구', deliveryStatus: '배송중', franchiseOwnerName: '김철수' },
  { orderCode: '12347', invoiceCode: 'INV12347', franchiseAddress: '서울시 송파구', deliveryStatus: '배송완료', franchiseOwnerName: '이영희' },
]);

const filteredOrders = computed(() => {
  if (conditionFilter.value === '전체') {
    return orders.value;
  } else {
    return orders.value.filter(order => order.deliveryStatus === conditionFilter.value);
  }
});

const resetFilter = () => {
  conditionFilter.value = '전체';
};

const notices = ref([
  { noticeTitle: '공지사항 1', noticeEnrollDate: '2024-01-01', noticeContent: '내용 1' },
  { noticeTitle: '공지사항 2', noticeEnrollDate: '2024-01-02', noticeContent: '내용 2' },
  { noticeTitle: '공지사항 3', noticeEnrollDate: '2024-01-03', noticeContent: '내용 3' },
]);

const sortedNotices = computed(() => {
  return notices.value.sort((a, b) => new Date(b.noticeEnrollDate) - new Date(a.noticeEnrollDate));
});

const showPopup = ref(false);
const selectedNotice = ref(null);

const openPopup = (notice) => {
  selectedNotice.value = notice;
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
};

const applyFilter = () => {
  // 필터 적용 로직을 여기에 추가
};
</script>


<style scoped>

* {
  box-sizing: border-box;
  font-family: "Noto Sans KR", sans-serif;
}

body {
  font-family: "Noto Sans KR", sans-serif;
}

hr {
  border: none;
  height: 1px;
  background-color: #ddd;
}

.container {
  display: flex;
  /* flex-direction: row; */
  /* justify-content: space-between; */
  padding: 20px;
  margin: 0 auto;
}

.content {
  flex: 1;
  margin-right: 20px;
}

.delivery-list-box {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.delivery-count {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.week {
  color: #888;
  margin-top: 10px;
}

.delivery-status {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.status-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  color: white;
}

.before {
  background-color: #f8c471;
}

.ing {
  background-color: #5dade2;
}

.after {
  background-color: #58d68d;
}

.delivery-status-box {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.status-value {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.notice-list {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notice-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.data-table {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
}

.notice-item {
  cursor: pointer;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notice-item:hover {
  background-color: #f0f0f0;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.my-delivery-list {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 50%;
}

.delivery-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.delivery-table th,
.delivery-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.delivery-table th {
  background-color: #f0f0f0;
}

.no {
  width: 50px;
}

.invoice {
  cursor: pointer;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn-reset {
  background-color: white;
  border: none;
  cursor: pointer;
}

.reset-icon {
  width: 20px;
  height: 20px;
}

.radio-group {
  display: flex;
  justify-content: space-between;
}

.delivery-status-title {
  display: flex;
  justify-content: space-between;
}

.notice-icon, .delivery-icon {
  margin-right: 10px;
}
</style>
