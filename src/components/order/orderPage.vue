<template>
  <div>
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">승인상태</td>
          <td class="filter-input">
            <div class="radio-group">
              <label> 승인대기 <input type="radio" value="승인대기" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
              <label> 발주승인 <input type="radio" value="승인완료" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
              <label> 발주반려 <input type="radio" value="승인거부" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
              <label> 검수대기 <input type="radio" value="검수대기" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
              <label> 검수완료 <input type="radio" value="검수완료" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
            </div>
          </td>

          <td class="filter-label">주문(발주)번호</td>
          <td class="filter-input">
            <input type="text" v-model="filterOrderCode" />
          </td>
        </tr>
        <tr>
          <td class="filter-label">가맹점명</td>
          <td class="filter-input">
            <input type="text" v-model="filterFranchiseName" />
          </td>
          <td class="filter-label">배송(송장)번호</td>
          <td class="filter-input">
            <input type="text" v-model="filterInvoiceCode" />
          </td>
        </tr>
        
        <tr>
          <td class="filter-label">점주명</td>
          <td class="filter-input">
            <input type="text" v-model="filterFranchiseOwnerName" />
          </td>
          <td class="filter-label">주문(발주)일</td>
          <td class="filter-input">
            <input type="date" v-model="filterOrderDate" />
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

    <input class="create-button" type="button" value="발주하기" @click="showPopup" style="  cursor : pointer; border:0; ">

    <popup v-if="createPopup" :showPopup="showPopup" :popupVisible="createPopup"/>
    <OrderDetail v-if="createDetailPopup" :showDetailPopup="showDetailPopup" :popupVisible="createDetailPopup" :detailItem="detailItem"/>

    <table style=" margin-top: 5%;">
      <thead >
        <tr >
          <th v-for="(header, index) in headers" :key="index" > <div align="center">{{ header.label }}</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, rowIndex) in paginatedLists" :key="rowIndex"
            :id="'row-' + rowIndex"
            @dblclick="showDetailPopup(item)"
            @mouseenter="highlightRow(rowIndex)"
            @mouseleave="resetRowColor(rowIndex)"
        >
          <td v-for="(header, colIndex) in headers" :key="colIndex" align="center">
            {{ item[header.key] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>



<script setup>
import { ref, computed } from 'vue';
import popup from './orderPopup.vue';
import OrderDetail from './orderDetail.vue';

const lists = ref([]);

// 추후 토큰으로 받을 예정
const franchiseCode = ref(1);
const adminCode = ref(2);

const headers = ref([
  { key: 'orderCode', label: '주문 코드' },
  { key: 'orderCondition', label: '주문 상태' },
  { key: 'franchiseName', label: '가맹점 이름' },
  { key: 'orderDate', label: '주문 날짜' },
  { key: 'invoiceCode', label: '배송 코드' },
  { key: 'invoiceDate', label: '배송 예정일' },
  { key: 'franchiseOwnerName', label: '가맹점주 이름' },
]);

const filter = ref('');
const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;
const dateFilter = ref('');
const conditionFilter = ref('');

const filterOrderCode = ref('');
const filterFranchiseName = ref('');
const filterFranchiseOwnerName = ref('');
const filterInvoiceCode = ref('');
const filterOrderDate = ref('');

const getOrderList = async () => {
  try {
    const response = await fetch(`/api/admin/orders?adminCode=${adminCode.value}`, {
      method: 'GET',
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
  filterOrderCode.value = "";
  filterFranchiseName.value = "";
  filterFranchiseOwnerName.value = "";
  filterInvoiceCode.value = "";
  filterOrderDate.value = "";
  filteredLists.value = lists.value;
};

const applyFilter = () => {
  currentPage.value = 1; // 필터 적용 시 페이지를 초기화합니다.
  filteredLists.value = lists.value.filter(item =>
    (conditionFilter.value ? item.orderCondition === conditionFilter.value : true) &&
    (filterOrderCode.value ? String(item.orderCode).includes(filterOrderCode.value) : true) &&
    (filterFranchiseName.value ? String(item.franchiseName).includes(filterFranchiseName.value) : true) &&
    (filterFranchiseOwnerName.value ? String(item.franchiseOwnerName).includes(filterFranchiseOwnerName.value) : true) &&
    (filterInvoiceCode.value ? String(item.invoiceCode).includes(filterInvoiceCode.value) : true) &&
    (filterOrderDate.value ? String(item.orderDate).includes(filterOrderDate.value) : true)
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

getOrderList();

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



<style>
  @import "../../assets/css/order.css" ;
</style>