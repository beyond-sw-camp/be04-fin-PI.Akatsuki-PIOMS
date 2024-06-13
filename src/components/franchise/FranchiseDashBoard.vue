<template>
  <div class="dashboard-container">
    <div class="main-content">
      <div class="top-row">
        <div class="section order-status">
          <router-link to="/franchise/order/list" class="order-link">
            <img src="@/assets/icon/List.png" class="icon" alt="Order Icon">내 발주 현황
          </router-link>
          <hr class="section-divider" />
          <div class="status-boxes">
            <div class="status-box">
              <div class="labelbox">
                <div class="status-label1 status-label-pending">승인 완료</div>
              </div>
              <div class="status-count-box">
                <div class="status-count">{{ orderStat.acceptCnt || '-' }}</div>
              </div>
            </div>
            <div class="status-box">
              <div class="labelbox">
                <div class="status-label2 status-label-accepted">검수 대기</div>
              </div>
              <div class="status-count-box">
                <div class="status-count">{{ orderStat.inspectionWaitCnt || '-' }}</div>
              </div>
            </div>
            <div class="status-box">
              <div class="labelbox">
                <div class="status-label3 status-label-denied">검수 완료</div>
              </div>
              <div class="status-count-box">
                <div class="status-count">{{ orderStat.inspectionFinishCnt || '-' }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="section inventory-alert">
          <router-link to="/franchise/warehouse/list" class="warehouse-link">
            <img src="@/assets/icon/부족한재고.png" class="icon" alt="Warehouse Icon">재고 알림
          </router-link>
          <hr class="section-divider" />
          <ul class="list">
            <li v-for="item in paginatedLowStockItems" :key="item.franchiseWarehouseCode" class="list-item">
              <div>상품명: {{ item.product.productName }}</div>
              <div>재고: {{ item.franchiseWarehouseEnable }}</div>
            </li>
          </ul>
          <div v-if="!lowStockItems.length">
            <div>재고가 부족한 상품이 없습니다.</div>
          </div>
          <div class="pagination">
            <button @click="prevLowStockPage" :disabled="lowStockCurrentPage === 1">이전</button>
            <button @click="nextLowStockPage" :disabled="lowStockCurrentPage === lowStockTotalPages">다음</button>
          </div>
        </div>
      </div>
      <div class="bottom-row">
        <div class="section notice-list">
          <router-link to="/franchise/notice/list" class="notice-link">
            <img src="@/assets/icon/공지사항.png" class="icon" alt="Notice Icon">공지사항 리스트
          </router-link>
          <ul class="list">
            <li v-for="item in paginatedNotices" :key="item.noticeCode" class="list-item">
              <div class="notice-title">{{ truncateTitle(item.noticeTitle) }}</div>
              <div class="notice-date">{{ formatNoticeDate(item.noticeEnrollDate) }}</div>
            </li>
          </ul>
          <div class="pagination">
            <button @click="prevNoticePage" :disabled="noticeCurrentPage === 1">이전</button>
            <button @click="nextNoticePage" :disabled="noticeCurrentPage === noticeTotalPages">다음</button>
          </div>
        </div>
        <div class="section inquiry-list">
          <router-link to="/franchise/ask/list" class="inquiry-link">
            <img src="@/assets/icon/문의사항.png" class="ask-icon" alt="Ask Icon">문의사항 리스트
          </router-link>
          <ul class="list">
            <li v-for="item in paginatedAsks" :key="item.askCode" class="list-item">
              <div class="title">{{ truncateTitle(item.askTitle) }}</div>
              <div class="status-container">
                <div class="status" :class="{ 'status-pending': item.askStatus === '답변대기', 'status-complete': item.askStatus === '답변완료' }">
                  {{ item.askStatus }}
                </div>
                <div class="date">{{ formatAskDate(item.askEnrollDate) }}</div>
              </div>
            </li>
          </ul>
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">이전</button>
            <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
          </div>
        </div>
        <div class="section favorite-products">
          <router-link to="/franchise/favorite/list" class="favorite-link">
            <img src="@/assets/icon/즐겨찾기.png" class="icon" alt="Favorite Icon">즐겨찾기 상품 목록
          </router-link>
          <ul class="list">
            <li v-for="item in paginatedFavorites" :key="item.franchiseWarehouseCode" class="list-item">
              <div>{{ item.product.productName }}</div>
              <div>{{ item.product.productStatus }}</div>
            </li>
          </ul>
          <div class="pagination">
            <button @click="prevFavoritesPage" :disabled="favoritesCurrentPage === 1">이전</button>
            <button @click="nextFavoritesPage" :disabled="favoritesCurrentPage === favoritesTotalPages">다음</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Swal from "sweetalert2";

const store = useStore();
const accessToken = store.state.accessToken;

const notices = ref([]);
const asks = ref([]);
const favorites = ref([]);
const lowStockItems = ref([]);
const orderStat = ref({});

const currentPage = ref(1);
const noticeCurrentPage = ref(1);
const favoritesCurrentPage = ref(1);
const lowStockCurrentPage = ref(1);
const itemsPerPage = 6;
const lowStockItemsPerPage = 3;
let timerInterval;

Swal.fire({
  title: "대시보드를 불러오는 중입니다...",
  timer: 1000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading();
    const timer = Swal.getPopup().querySelector("b");
    timerInterval = setInterval(() => {
    }, 100);
  },
  willClose: () => {
    clearInterval(timerInterval);
  }
}).then((result) => {
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log("I was closed by the timer");
  }
});

const fetchDashboardData = async () => {
  try {
    const response = await fetch(`http://api.pioms.shop/franchise/franchiseDashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    notices.value = data.noticeList.sort((a, b) => new Date(b.noticeEnrollDate) - new Date(a.noticeEnrollDate));
    asks.value = data.askList.asks;
    favorites.value = data.favoriteList;
    orderStat.value = data.orderStat;
    // lowStockItems.value = data.filter(item => item.franchiseWarehouseEnable < 10);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
};

const fetchProducts = async () => {
  try {
    const response = await fetch(`http://api.pioms.shop/franchise/warehouse/list/product`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    lowStockItems.value = data.filter(item => item.franchiseWarehouseEnable <= 5);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

const paginatedAsks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return asks.value.slice(start, end);
});

const paginatedNotices = computed(() => {
  const start = (noticeCurrentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return notices.value.slice(start, end);
});

const paginatedFavorites = computed(() => {
  const start = (favoritesCurrentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return favorites.value.slice(start, end);
});

const paginatedLowStockItems = computed(() => {
  const start = (lowStockCurrentPage.value - 1) * lowStockItemsPerPage;
  const end = start + lowStockItemsPerPage;
  return lowStockItems.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(asks.value.length / itemsPerPage);
});

const noticeTotalPages = computed(() => {
  return Math.ceil(notices.value.length / itemsPerPage);
});

const favoritesTotalPages = computed(() => {
  return Math.ceil(favorites.value.length / itemsPerPage);
});

const lowStockTotalPages = computed(() => {
  return Math.ceil(lowStockItems.value.length / lowStockItemsPerPage);
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevNoticePage = () => {
  if (noticeCurrentPage.value > 1) {
    noticeCurrentPage.value--;
  }
};

const nextNoticePage = () => {
  if (noticeCurrentPage.value < noticeTotalPages.value) {
    noticeCurrentPage.value++;
  }
};

const prevFavoritesPage = () => {
  if (favoritesCurrentPage.value > 1) {
    favoritesCurrentPage.value--;
  }
};

const nextFavoritesPage = () => {
  if (favoritesCurrentPage.value < favoritesTotalPages.value) {
    favoritesCurrentPage.value++;
  }
};

const prevLowStockPage = () => {
  if (lowStockCurrentPage.value > 1) {
    lowStockCurrentPage.value--;
  }
};

const nextLowStockPage = () => {
  if (lowStockCurrentPage.value < lowStockTotalPages.value) {
    lowStockCurrentPage.value++;
  }
};

const truncateTitle = (title, maxLength = 20) => {
  return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
};

const formatAskDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const formatNoticeDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};


onMounted(() => {
  fetchProducts();
  fetchDashboardData();
});
</script>

<style scoped>
.ask-icon {
  position: relative;
  top: 2px;
  width: 28px;
  height: 23px;
}

body {
  overflow-x: hidden;
}

.dashboard-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  padding-bottom: 150px;
}

.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.top-row {
  display: flex;
  gap: 20px;
  padding-bottom: 30px;
  height: 60%;
}

.bottom-row {
  display: flex;
  gap: 27px;
}

.section {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  flex: 1;
  overflow: hidden;
}

.notice-list,
.inquiry-list {
  flex: 1;
  max-width: 20%;
}
.notice-date {
  position: relative;
  top: 20px;
  padding-top: 5px;
}

.status-boxes {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.status-box {
  text-align: center;
  flex: 1;
  border: 11px solid white;
  border-radius: 10px;
  position: relative;
  bottom: 10px;
}

.status-count-box {
  text-align: center;
  flex: 1;
  border: 11px solid white;
}

.status-count {
  display: flex;
  font-size: 24px;
  font-weight: bold;
  background-color: #F3F3F3;
  height: 120px;
  width: 140px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.status-label1,
.status-label2,
.status-label3 {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  color: white;
}

.labelbox {
  display: flex;
  border: 11px solid white;
  align-items: baseline;
  justify-content: center;
}

.status-label1 {
  height: 32px;
  width: 100px;
  background-color: #394CA9;
  align-content: center;
  align-items: center;
}

.status-label2 {
  height: 32px;
  width: 100px;
  background-color: #FC6F86;
  align-content: center;
  align-items: center;
}

.status-label3 {
  height: 32px;
  width: 100px;
  background-color: #FFCD4B;
  align-content: center;
  align-items: center;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notice-list .list-item {
  margin-bottom: 16px;
  padding-bottom: 23px;
}

.notice-title {
  flex: 1;
  font-size: 15px;
  color: #333;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notice-link,
.favorite-link,
.order-link,
.warehouse-link {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 15px;
}

.inquiry-link {
  display: flex;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 11px;
}

.notice-link{
  margin-bottom: 20px;
  //padding:10px;
}

.notice-link:hover,
.inquiry-link:hover,
.favorite-link:hover,
.order-link:hover,
.warehouse-link:hover {
  color: #000;
}

.title {
  color: #444444;
  font-weight: bold;
  font-size: 15px;
  flex: 1;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  top: -5px;
}

.status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status {
  position: relative;
  right: -30px;
  background-color: #f8d7da;
  color: #FFFFFF;
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 12px;
  margin-bottom: 5px;
  font-weight: bold;
}

.status-pending {
  background-color: #ff6285;
}

.status-complete {
  background-color: #FFCD4B;
}

.date {
  font-size: 12px;
  color: #666;
  position: relative;
  top: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination button {
  background-color: #fff;
  color: black;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  margin: 0 5px;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.category {
  font-size: 12px;
  color: #666;
  margin-left: 5px;
}

.section-divider {
  margin: 10px 0;
  border: none;
  border-top: 1px solid #ddd;
}

.orderStatus-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.icon {
  width: 18px;
  margin-right: 5px;
  position: relative;
  top: 2px;
  height: 18px;
}

.unit {
  font-size: 10px;
}
</style>
