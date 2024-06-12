<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/icon/반품및교환.png" style="width: 18px"/>&nbsp;
      <span class="breadcrumb">가맹점 및 직원 관리 > 가맹점 및 점주 관리 > 가맹점 관리</span>
    </div>

    <div class="product-sub-title"> * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png">초기화 또는<img src="@/assets/icon/search.png">검색을 눌러주세요.
    </div>

  <div v-if="isLoading">

    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">반품상태</td>
          <td class="filter-input">
            <div class="radio-group">
              <label>  <input type="radio" value="반송신청" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter">반송신청</label>
              <label>  <input type="radio" value="반송중" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter">반송중</label>
              <label>  <input type="radio" value="처리대기" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter">처리대기</label>
              <label>  <input type="radio" value="처리완료" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter">처리완료</label>
              <label>  <input type="radio" value="반환대기" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter">반환대기</label>
              <label>  <input type="radio" value="반환중" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter">반환중</label>
              <label>  <input type="radio" value="반환완료" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter">반환완료</label>
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
          <td class="filter-input" colspan="3">
            <input type="date" v-model="filterExchangeDate" />
          </td>
        </tr>

      </table>

      <div class="filter-buttons">
        <button @click="resetFilters" class="reset-btn">
          <img src="@/assets/icon/reset.png" alt="Reset" />
        </button>
        <button @click="applyFilter" class="search-btn">
          <img src="@/assets/icon/search.png" alt="Search" />
        </button>
      </div>

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
  </div>
</template>



<script setup>
import { ref, computed } from 'vue';
import exchangePopup from './exchangePopup.vue';
import ExchangeDetail from './exchangeDetail.vue';
import { useStore } from 'vuex'; // Vuex store 임포트
import Swal from "sweetalert2"; // Vuex store 임포트
const store = useStore(); // Vuex store 사용
const isLoading = ref(false);


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
    // const response = await fetch(`http:///localhost:5000/admin/exchanges`, {
    const response = await fetch(`http://localhost:5000/admin/exchange/list`, {
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
    isLoading.value=true;

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
.container {
  padding: 20px;
}

.header {
  display: flex;
  padding-left: 210px;
  align-items: center;
  margin-bottom: 20px;
  justify-content: flex-start;
}

.breadcrumb {
  font-size: 16px;
  color: #555;
  font-weight: bold;
}

.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.filter-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  max-width: 1440px;
}

.filter-table td {
  padding: 5px 10px;
}

.filter-label {
  font-weight: bold;
  text-align: center;
  border: solid 1px #747474;
  width: 120px;
  background-color: #D9D9D9;
}

.filter-input {
  text-align: left;
  border: solid 1px #747474;
  padding: 5px;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;

}
.reset-btn, .search-btn {
  background-color: #fff;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  margin: 0 5px;
}

.table-container {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.table {
  width: 100%;
  max-width: 1440px;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-spacing: 0 10px;
}

.table th {

  font-weight: bold;
  color: #000;
  text-align: center;
}

.table th,
.table td {
  padding: 10px;
  text-align: center;
}

.header1 {
  background-color: #D9D9D9;
  font-weight: bold;
  height: 40px;
  font-size: 14px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 100px;
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

.pagination span {
  margin: 0 10px;
  font-weight: bold;
}

.post-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 1440px;
}

.postBtn {
  border: none;
  background-color: white;
  cursor: pointer;
}

.excelBtn {
  border: none;
  background-color: white;
  cursor: pointer;
}

.product-sub-title {
  display: flex;
  padding-left: 210px;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
  justify-content: flex-start;
}




.radio-group {
  /* border: 2px solid #9d9d9d; */
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  border-radius: 5px;
}

.radio-group .title {
  margin-right: 20px;
}
.radio-group .left {
  background-color: #d9d9d9;
  padding: 10px ;
  width: 100px ;
  justify-content: center;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 16px;
}

.condition-button {
  display: inline-block;
  padding: 2px 5px; /* 최소한의 패딩으로 글씨 영역만큼만 색이 적용되도록 합니다 */
  border-radius: 3px;
  color: #fff;
  font-weight: bold;
}

.condition-button.pending {
  background-color: #ffcc00; /* Color for 승인대기 */
}

.condition-button.approved {
  background-color: #007bff; /* Color for 승인완료 */
}

.condition-button.rejected {
  background-color: #ff6285; /* Color for 승인거절 */
}

.condition-button.inspection-pending {
  background-color: #ffcc00; /* Color for 검수대기 */
}

.condition-button.inspection-completed {
  background-color: #45a049; /* Color for 검수완료 */
}

/* 여기부턴 재현님꺼 */
.container {
  position: relative;
  /*min-height: 100vh; !* Ensure the container takes at least the full height of the viewport *!*/
}


.date-range span {
  margin: 0 5px;
}

.action-buttons {
  max-width: 1300px;
  justify-content: center; /* 가운데 정렬 */
  align-items: center;
}
.reset-btn{
  background-color: #fff;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 8px;
  font-size: 14px;
  margin: 0 5px;
}

.search-btn {
  background-color: #fff;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 8px;
  font-size: 14px;
  margin: 0 5px;
  grid-column-start: 4;
}

.reset-btn:hover, .search-btn:hover {
  background-color: #f0f0f0;
}
.create-btn {
  background-color: #fff;
  color: black;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  //position: relative;
  bottom: 3px; /* 원하는 위치로 이동 */
  left: 546px ; /* 원하는 위치로 이동 */
  grid-column-start:6 ;
}


.allpost {
  text-align: center;
  padding: 10px 0;
  height: 30px;
}

.allpost .num {
  width: 5%;
}

.allpost td {
  font-size: 14px;

}

</style>
