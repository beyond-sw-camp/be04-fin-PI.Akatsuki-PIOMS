<template>
  <div class="dashboard-container">
    <div class="main-content">
      <div class="top-row">
        <div class="section order-status">
          <router-link to="/franchise/order/list" class="orderStatus-link">내 발주 현황</router-link>
          <hr class="section-divider" />
          <div class="status-boxes">
            <div class="status-box">
              <div class="status-count">{{ orderStat.acceptCnt }}</div>
              <div class="status-label">승인 완료</div>
            </div>
            <div class="status-box">
              <div class="status-count">{{ orderStat.inspectionWaitCnt }}</div>
              <div class="status-label">검수 대기</div>
            </div>
            <div class="status-box">
              <div class="status-count">{{ orderStat.inspectionFinishCnt }}</div>
              <div class="status-label">검수 완료</div>
            </div>
          </div>
        </div>
        <div class="section inventory-alert">
          <div>
          <h2>재고 알림</h2>
          <hr class="section-divider" />
          <ul class="list">
            <li v-for="item in paginatedLowStockItems" :key="item.franchiseWarehouseCode" class="list-item">
              <div>
                상품명: {{ item.product.productName }}
              </div>
              <div>
                재고: {{ item.franchiseWarehouseEnable }}
              </div>
            </li>
          </ul>
          <div v-if="!lowStockItems.length">
            <div>재고가 부족한 상품이 없습니다.</div>
          </div>
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
            공지사항 리스트
          </router-link>
          <ul class="list">
            <li v-for="item in paginatedNotices" :key="item.noticeCode" class="list-item">
              <div class="notice-title">{{ truncateTitle(item.noticeTitle) }}</div>
              <div>{{ formatNoticeDate(item.noticeEnrollDate) }}</div>
            </li>
          </ul>
          <div class="pagination">
            <button @click="prevNoticePage" :disabled="noticeCurrentPage === 1">이전</button>
            <button @click="nextNoticePage" :disabled="noticeCurrentPage === noticeTotalPages">다음</button>
          </div>
        </div>
        <div class="section inquiry-list">
          <router-link to="/franchise/ask" class="inquiry-link">문의사항 리스트</router-link>
          <ul class="list">
            <li v-for="item in paginatedAsks" :key="item.askCode" class="list-item">
              <div class="title">{{ truncateTitle(item.askTitle) }}</div>
              <div class="status-container">
                <div class="status"
                     :class="{ 'status-pending': item.askStatus === '답변대기', 'status-complete': item.askStatus === '답변완료' }">
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
          <router-link to="/franchise/favorite/list" class="favorite-link">즐겨찾기 상품 목록</router-link>
          <ul class="list">
            <li v-for="item in paginatedFavorites" :key="item.franchiseWarehouseCode" class="list-item">
              <div>
                {{ item.product.productName }}
                <span class="category">
                </span>
              </div>
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


const fetchDashboardData = async () => {
  try {
    const response = await fetch(`http://localhost:5000/franchise/franchiseDashboard`, {
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
    notices.value = data.noticeList;
    asks.value = data.askList.asks;
    favorites.value = data.favoriteList;
    orderStat.value = data.orderStat;
    lowStockItems.value = data.filter(item => item.franchiseWarehouseEnable < 10);
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
body{
  overflow-x:hidden;
}

.dashboard-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding:20px;
  box-sizing: border-box;
}

.main-content {
  width: 100%;
  max-width: 1200px;
  margin:0 auto;
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
  //height: 350px; /* 높이 고정 */
  overflow: hidden; /* 내용이 넘칠 경우 숨기기 */
}

.notice-list,
.inquiry-list {
  flex: 1;
  max-width: 20%;
}

.status-boxes {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
}

.status-box {
  text-align: center;
}

.status-count {
  font-size: 24px;
  font-weight: bold;
}

.status-label {
  margin-top: 10px;
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
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notice-list .list-item {
  margin-bottom: 30px;
}

.notice-title {
  flex: 1;
  font-size: 15px;
  color: #333;
  font-weight: bold;
  white-space: nowrap; /* 텍스트 줄 바꿈 금지 */
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
  text-overflow: ellipsis; /* 넘치는 텍스트 생략표(...) 추가 */
}

.notice-link,
.inquiry-link,
.favorite-link,
.orderStatus-link{
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 15px;
}

.order-status {
  flex: 1;
  height: 230px;
}

.inventory-alert {
  flex: 1;
  height: 230px;
}

.favorite-products {
  flex: 1;
}

.notice-link:hover,
.inquiry-link:hover,
.favorite-link:hover {
  color: #000;
}

.title {
  flex: 1;
  margin-right: 10px;
  white-space: nowrap; /* 텍스트 줄 바꿈 금지 */
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
  text-overflow: ellipsis; /* 넘치는 텍스트 생략표(...) 추가 */
}

.status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status {
  background-color: #f8d7da;
  color: #721c24;
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 12px;
  margin-bottom: 5px;
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

.section h2 {
  font-size: 18px; /* 폰트 크기 키우기 */
  font-weight: bold; /* 폰트 굵게 */
  color: #333;
}

.section-divider {
  margin: 10px 0;
  border: none;
  border-top: 1px solid #ddd;
}
</style>
