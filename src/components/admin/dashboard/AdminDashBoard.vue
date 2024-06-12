<template>
  <div class="dashboard-container" v-if="isLoading">
    <div class="dashboard-content">
      <div class="dashboard-column">
        <div class="card">
          <div class="card-content">
            <div class="card-header">
              <router-link to="/admin/order/list" class="link-page">
                <img src="@/assets/icon/List.png" class="icon" /> &nbsp;발주 현황
              </router-link>
              <div class="card-header-info">(단위: 주)</div>
            </div>
            <hr>
            <div class="status-icons" style="height: 30px; margin: 10px">
              <div class="order-status order-status1">승인대기</div>
              <div class="order-status order-status2">승인완료</div>
              <div class="order-status order-status3">승인반려</div>
            </div>
            <div class="order-counts">
              <div class="order-count">{{ orderStat.waitCnt }}</div>
              <div class="order-count">{{ orderStat.acceptCnt }}</div>
              <div class="order-count">{{ orderStat.denyCnt }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <div class="card-header">
              <router-link to="/admin/exchange/list" class="link-page">
                <img src="@/assets/icon/반품및교환.png" class="icon" /> &nbsp;반품 및 교환 현황
              </router-link>
              <div class="card-header-info">(단위: 주)</div>
            </div>
            <hr>
            <div class="exchange-list">
              <div v-for="(exchange, rowIndex) in paginatedLists" :key="rowIndex" class="exchange-info">
                <div class="exchange-row">
                  <div>{{ exchange.franchise.franchiseName }} (신청일: {{ exchange.exchangeDate }})</div>
                  <div :class="statusClass(exchange.exchangeStatus)">{{ exchange.exchangeStatus }}</div>
                </div>
                <hr>
              </div>
              <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">이전</button>
                <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <div class="card-header">
              <router-link to="/admin/product/list" class="link-page">
                <img src="@/assets/icon/부족한재고.png" class="icon" /> &nbsp;부족한 상품 재고
              </router-link>
            </div>
            <hr>
            <div class="product-list">
              <div v-for="(product, rowIndex) in paginatedLists5" :key="rowIndex" class="product-info">
                <div class="product-row">
                  <div>{{ product.productName }}</div>
                  <div>수량: {{ product.productCount }} 개</div>
                </div>
                <hr>
              </div>
              <div class="pagination">
                <button @click="prevPage5" :disabled="currentPage5 === 1">이전</button>
                <button @click="nextPage5" :disabled="currentPage5 === totalPages5">다음</button>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <div class="card-header">
              <div class="card-header-title">
                <router-link to="/admin/notice/list" class="link-page">
                <img src="@/assets/icon/공지사항.png" class="icon" /> &nbsp;공지사항
                </router-link>
              </div>
              <div class="card-header-info">(단위: 주)</div>
            </div>
            <hr>
            <div class="notice-list">
              <div v-for="(notice, rowIndex) in paginatedLists3" :key="rowIndex" class="notice-info">
                <div class="notice-row">
                  <div>{{ notice.noticeTitle }}</div>
                  <div>{{ notice.noticeEnrollDate }}</div>
                </div>
                <hr>
              </div>
              <div class="pagination">
                <button @click="prevPage3" :disabled="currentPage3 === 1">이전</button>
                <button @click="nextPage3" :disabled="currentPage3 === totalPages3">다음</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-column">
        <div class="card">
          <div class="card-content">
            <div class="card-header">
              <div class="card-header-title">
                <img src="@/assets/icon/회사.png" class="icon" /> &nbsp;본사 정보
              </div>
            </div>
            <table class="info-table">
              <tr>
                <td>회사명</td>
                <td>{{ company.companyName }}</td>
                <td>대표명</td>
                <td>{{ company.companyCeo }}</td>
              </tr>
              <tr>
                <td>주소명</td>
                <td colspan="3">{{ company.companyAddress }}</td>
              </tr>
              <tr>
                <td>전화번호</td>
                <td>{{ company.companyCall }}</td>
                <td>사업자번호</td>
                <td>{{ company.companyBusinessNum }}</td>
              </tr>
              <tr>
                <td>Fax</td>
                <td>{{ company.companyFax }}</td>
                <td>Email</td>
                <td>{{ company.companyEmail }}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <div class="card-header">
              <router-link to="/admin/franchise/list" class="link-page">
                <img src="@/assets/icon/가맹점.png" class="icon" /> &nbsp;가맹점 정보
              </router-link>
            </div>
            <hr>
            <div class="franchise-list">
              <div v-for="(franchise, rowIndex) in paginatedLists2" :key="rowIndex" class="franchise-info">
                <div class="franchise-row">
                  <div>{{ franchise.franchiseName }}</div>
                  <div>{{ franchise.franchiseOwner.franchiseOwnerName }} 관리자님</div>
                </div>
                <hr>
              </div>
              <div class="pagination">
                <button @click="prevPage2" :disabled="currentPage2 === 1">이전</button>
                <button @click="nextPage2" :disabled="currentPage2 === totalPages2">다음</button>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <div class="card-header">
              <div class="card-header-title">
                <router-link to="/admin/ask/list" class="link-page">
                  <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/d594943691f3735f640773a83fa9edefab6c26a4713004ba1b081a62d929f681?apiKey=79a2b7eb54dd4ed5b8fcf22467729821&" /> &nbsp;문의사항 리스트
                </router-link>
              </div>
              <div class="card-header-info">(단위: 주)</div>
            </div>
            <hr>
            <div class="ask-list">
              <div v-for="(ask, rowIndex) in paginatedLists4" :key="rowIndex" class="ask-info">
                <div class="ask-row">
                  <div>{{ truncateText(ask.askContent, 40) }}</div>
                  <div :class="statusClass(ask.askStatus)">{{ ask.askStatus }}</div>
                </div>
                <div class="ask-details">
                  <div>{{ ask.franchiseName }}</div>
                  <div>{{ ask.askEnrollDate }}</div>
                </div>
                <hr>
              </div>
              <div class="pagination">
                <button @click="prevPage4" :disabled="currentPage4 === 1">이전</button>
                <button @click="nextPage4" :disabled="currentPage4 === totalPages4">다음</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Swal from "sweetalert2";

const store = useStore();
const router = useRouter();
const asks = ref([]);
const company = ref({});
const exchanges = ref([]);
const franchises = ref([]);
const notices = ref([]);
const orderStat = ref();
const products = ref([]);
const isLoading = ref(false);

const userRole = computed(() => store.getters.userRole);

const getDash = async () => {
  let timerInterval;
  let url= 'http://api.pioms.shop/admin/adminDashboard';


  Swal.fire({
    title: "대시보드를 불러오는 중입니다...",
    timer: 1000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
  });

  try {
    const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (response.status === 403) {
      Swal.fire({
        icon: 'error',
        title: '접근 불가',
        text: '접근 권한이 없습니다.',
        confirmButtonText: '확인'
      }).then(() => {
        router.push('/');
      });
      return;
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    asks.value = data.askList;
    company.value = data.companyVO;
    exchanges.value = data.exchangeList;
    franchises.value = data.franchiseList;
    notices.value = data.noticeList.sort((a, b) => new Date(b.noticeEnrollDate) - new Date(a.noticeEnrollDate));
    orderStat.value = data.orderStat;
    products.value = data.products;
    isLoading.value = true;
  } catch (error) {
    console.error('오류 발생:', error);
    Swal.fire({
      icon: 'error',
      title: '오류 발생',
      text: '대시보드를 불러오는 중 오류가 발생했습니다.',
      confirmButtonText: '확인'
    }).then(() => {
      router.push('/');
    });
  }
};
getDash();

const itemsPerPage = 5; // 페이지당 5개 항목
const currentPage = ref(1);
const paginatedLists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return exchanges.value.slice(start, end);
});
const totalPages = computed(() => {
  return Math.ceil(exchanges.value.length / itemsPerPage);
});
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const currentPage2 = ref(1);
const paginatedLists2 = computed(() => {
  const start = (currentPage2.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return franchises.value.slice(start, end);
});
const totalPages2 = computed(() => {
  return Math.ceil(franchises.value.length / itemsPerPage);
});
const nextPage2 = () => {
  if (currentPage2.value < totalPages2.value) {
    currentPage2.value++;
  }
};
const prevPage2 = () => {
  if (currentPage2.value > 1) {
    currentPage2.value--;
  }
};

const currentPage3 = ref(1);
const paginatedLists3 = computed(() => {
  const start = (currentPage3.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return notices.value.slice(start, end);
});
const totalPages3 = computed(() => {
  return Math.ceil(notices.value.length / itemsPerPage);
});
const nextPage3 = () => {
  if (currentPage3.value < totalPages3.value) {
    currentPage3.value++;
  }
};
const prevPage3 = () => {
  if (currentPage3.value > 1) {
    currentPage3.value--;
  }
};

const currentPage4 = ref(1);
const paginatedLists4 = computed(() => {
  const start = (currentPage4.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return asks.value.slice(start, end);
});
const totalPages4 = computed(() => {
  return Math.ceil(asks.value.length / itemsPerPage);
});
const nextPage4 = () => {
  if (currentPage4.value < totalPages4.value) {
    currentPage4.value++;
  }
};
const prevPage4 = () => {
  if (currentPage4.value > 1) {
    currentPage4.value--;
  }
};

const currentPage5 = ref(1);
const paginatedLists5 = computed(() => {
  const start = (currentPage5.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return products.value.slice(start, end);
});
const totalPages5 = computed(() => {
  return Math.ceil(products.value.length / itemsPerPage);
});
const nextPage5 = () => {
  if (currentPage5.value < totalPages5.value) {
    currentPage5.value++;
  }
};
const prevPage5 = () => {
  if (currentPage5.value > 1) {
    currentPage5.value--;
  }
};

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

function statusClass(status) {
  return {
    'status-pending': status === '반송신청' || status === '반송중' || status === '처리대기',
    'status-completed': status === '처리완료' || status === '반환대기' || status === '반환중' || status === '반환완료',
    'status-answer-waiting': status === '답변대기',
    'status-answer-completed': status === '답변완료',
  };
}
</script>

<style scoped>
body {
  overflow-x: hidden;
}

.dashboard-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.dashboard-content {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  gap: 3%;
}

.dashboard-column {
  flex: 1;
  margin-bottom: 100px;
}

.card {
  border: 1px solid #9d9d9d;
  border-radius: 5px;
  margin-bottom: 4%;
  display: flex;
  flex-direction: column;
}

.card-content {
  padding: 1%;
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-header-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.card-header-info {
  font-size: 10px;
  padding-top: 18px;
}

.icon {
  width: 16px;
  height: 16px; /* 모든 아이콘 크기를 동일하게 설정 */
}

.status-icons {
  display: flex;
  gap: 10px;
}

.order-status {
  flex: 1;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
}

.order-status1 {
  background-color: #FC6F86;
}

.order-status2 {
  background-color: #394CA9;
}

.order-status3 {
  background-color: #B9B9B9;
}

.order-counts {
  display: flex;
  flex-grow: 1;
  height: 120px;
  margin: 10px;
  gap: 10px;
}

.order-count {
  flex: 1;
  border-radius: 10px;
  background-color: #F3F3F3;
  border: 1px solid #9d9d9d;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: bold;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid black;
}

.info-table td {
  padding: 10px;
  border-bottom: 1px solid #9d9d9d;
}

.exchange-list,
.product-list,
.franchise-list,
.notice-list,
.ask-list {
  display: flex;
  flex-direction: column;
}

.exchange-row,
.product-row,
.franchise-row,
.notice-row,
.ask-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.ask-details {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
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

.status-pending {
  background-color: #FF6285;
  color: white;
  border-radius: 5px;
  padding: 5px;
}

.status-completed {
  background-color: #394CA9;
  color: white;
  border-radius: 5px;
  padding: 5px;
}

.status-answer-waiting {
  background-color: #ec4343;
  color: white;
  border-radius: 5px;
  padding: 5px;
}

.status-answer-completed {
  background-color: #47d447;
  color: white;
  border-radius: 5px;
  padding: 5px;
}

.link-page {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}
</style>
