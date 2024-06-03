<template>
  <div class="breadcrumbs" style="margin-top: 50px;">
    <img src="../../assets/icon/List.png" alt="List Icon" class="breadcrumb-icon" />
    <span>교환 조회 및 관리</span>
  </div>
  <div>
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">반품상태</td>
          <td class="filter-input">
            <div class="radio-group">
              <label> 반송신청 <input type="radio" value="반송신청" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
              <label> 반송중 <input type="radio" value="반송중" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
              <label> 처리대기 <input type="radio" value="처리대기" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
              <label> 처리완료 <input type="radio" value="처리완료" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
              <label> 반환대기 <input type="radio" value="반환대기" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
              <label> 반환중 <input type="radio" value="반환중" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
              <label> 반환완료 <input type="radio" value="반환완료" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
            </div>
          </td>

          <td class="filter-label">반품/교환 코드</td>
          <td class="filter-input">
            <input type="text" v-model="filterExchangeCode" />
          </td>
        </tr>
        <tr>
          <td class="filter-label">가맹점명</td>
          <td class="filter-input">
            <input type="text" v-model="filterFranchiseName" />
          </td>
          <td class="filter-label">점주명</td>
          <td class="filter-input">
            <input type="text" v-model="filterFranchiseOwnerName" />
          </td>
        </tr>
        
        <tr>
          <td class="filter-label">반품/교환 신청일</td>
          <td class="filter-input">
            <input type="date" v-model="filterExchangeDate" />
          </td>
        </tr>
        
      </table>
    </div>
    <div class="action-buttons">
      <button @click="resetFilters" class="reset-btn">
        <img src="@/assets/icon/reset.png" alt="Reset" />
      </button>
      <button @click="applyFilter" class="search-btn">
        <img src="@/assets/icon/search.png" alt="Search" />
      </button>
    </div>
    <ExchangeDetail v-if="createDetailPopup" :showDetailPopup="showDetailPopup" :popupVisible="createDetailPopup" :detailItem="detailItem"/>

    <div class="table-container">

      <table class="table">
      <thead >
        <tr class="header1">
          <th v-for="(header, index) in headers" :key="index" > <div align="center">{{ header.label }}</div></th>
          <th>반품상태</th>
        </tr>
        
      </thead>
      <tbody>
        <tr v-for="(item, rowIndex) in paginatedLists" :key="rowIndex"
            :id="'row-' + rowIndex"
            @dblclick="showDetailPopup(item)"
            @mouseenter="highlightRow(rowIndex)"
            @mouseleave="resetRowColor(rowIndex)"
            class="allpost"
        >
          <td v-for="(header, colIndex) in headers" :key="colIndex" align="center">
            {{ item[header.key] }}
          </td>
          <td v-if="item.exchangeStatus=='반송신청'" style="width: 10%">
            <div class="condition-button pending">반송신청</div>
          </td>
          <td v-else-if="item.exchangeStatus=='반송중'" style="width: 10%">
            <div class="condition-button approved">반송중</div>
          </td>
          <td v-else-if="item.exchangeStatus=='처리대기'" style="width: 10%">
            <div class="condition-button rejected">처리대기</div>
          </td>
          <td v-else-if="item.exchangeStatus=='처리완료'" style="width: 10%">
            <div class="condition-button inspection-pending">처리완료</div>
          </td>
          <td v-else-if="item.exchangeStatus=='반환대기'" style="width: 10%">
            <div class="condition-button inspection-completed">반환대기</div>
          </td>
          <td v-else-if="item.exchangeStatus=='반환중'" >
            <div class="condition-button inspection-completed">반환중</div>
          </td>
          <td v-else-if="item.exchangeStatus=='반환완료'" >
            <div class="condition-button inspection-completed">반환완료</div>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>



<script setup>
import { ref, computed } from 'vue';
import exchangePopup from './exchangePopup.vue';
import ExchangeDetail from './exchangeDetail.vue';
import { useStore } from 'vuex'; // Vuex store 임포트
const store = useStore(); // Vuex store 사용


const lists = ref([]);

// 추후 토큰으로 받을 예정
const franchiseCode = ref(1);
const adminCode = ref(2);

const headers = ref([
  { key: 'exchangeCode', label: '반품코드' },
  { key: 'exchangeDate', label: '교환신청일' },
  { key: 'franchiseName', label: '가맹점' },
  { key: 'franchiseOwnerName', label: '점주' },
]);

const filter = ref('');
const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;
const dateFilter = ref('');
const conditionFilter = ref('');

const filterExchangeCode = ref('');
const filterFranchiseName = ref('');
const filterFranchiseOwnerName = ref('');
const filterInvoiceCode = ref('');
const filterExchangeDate = ref('');

const getExchangeList = async () => {
  try {
    const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
    // const response = await fetch(`/api/admin/exchanges`, {
    const response = await fetch(`http://localhost:5000/admin/exchanges`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('네트워크 오류 발생');
    }
    const data = await response.json();
    if (data.length > 0) {
      lists.value = data.map(({ ...rest }) => rest);
      filteredLists.value = lists.value;
      console.log(lists);
    } else {
      lists.value = [];
      filteredLists.value = [];
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
};

const resetFilters = () => {
  conditionFilter.value = "";
  filterExchangeCode.value = "";
  filterFranchiseName.value = "";
  filterFranchiseOwnerName.value = "";
  filterInvoiceCode.value = "";
  filterExchangeDate.value = "";
  filteredLists.value = lists.value;
};

const applyFilter = () => {
  currentPage.value = 1; // 필터 적용 시 페이지를 초기화합니다.
  filteredLists.value = lists.value.filter(item =>
    (conditionFilter.value ? item.exchangeStatus === conditionFilter.value : true) &&
    (filterExchangeCode.value ? String(item.exchangeCode).includes(filterExchangeCode.value) : true) &&
    (filterFranchiseName.value ? String(item.franchiseName).includes(filterFranchiseName.value) : true) &&
    (filterFranchiseOwnerName.value ? String(item.franchiseOwnerName).includes(filterFranchiseOwnerName.value) : true) &&
    (filterExchangeDate.value ? String(item.exchangeDate).includes(filterExchangeDate.value) : true)
  );

  // 날짜를 오래된 순으로 정렬합니다.
  if (dateFilter.value === 'old') {
    filteredLists.value.sort((a, b) => compareDate(a.orderDate, b.orderDate));
  } else if (dateFilter.value === 'recent') {
    // 최근 순으로 정렬합니다.
    filteredLists.value.sort((a, b) => compareDate(b.orderDate, a.orderDate));
  }

  console.log("Filtered Lists:", filteredLists.value);
};

const compareDate = (orderDateA, orderDateB) => {
  const dateA = new Date(orderDateA);
  const dateB = new Date(orderDateB);
  return dateA - dateB; // 오래된 순으로 정렬
};

const paginatedLists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredLists.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredLists.value.length / itemsPerPage);
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

getExchangeList();

const createPopup = ref(false);
const createDetailPopup = ref(false);

const showPopup = () => {
  createPopup.value = !createPopup.value;
};

const detailItem = ref(null);

const showDetailPopup = (item) => {
  detailItem.value = item;
  createDetailPopup.value = !createDetailPopup.value;
};

const highlightRow = (index) => {
  document.querySelector(`#row-${index}`).classList.add('highlighted');
};

const resetRowColor = (index) => {
  document.querySelector(`#row-${index}`).classList.remove('highlighted');
};
</script>



<style scoped>
  @import "../../assets/css/order.css" ;
</style>