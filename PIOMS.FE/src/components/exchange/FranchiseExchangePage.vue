<template>
  <div class="container">
    <div class="header" align="center" style="padding-bottom: 30px;">
      <div style="  max-width: 1440px;justify-content: center;align-items: center;">
        <br>
        <div style="float: left"><img src="@/assets/icon/Delivery.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">발주 및 교환 관리 &gt; 교환 / 반품 관리 &gt; 교환 / 반품 관리</span>
        </div>
      </div>
    </div>

    <div class="product-sub-title"> * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png">초기화 또는<img src="@/assets/icon/search.png">검색을 눌러주세요.
    </div>

    <div>

      <div class="filter-section">
        <table class="filter-table">
          <tr>
            <td class="filter-label">반품상태</td>
            <td class="filter-input">
              <div class="radio-group">
                <label><input type="radio" value="반송신청" name="ConditionOrder" v-model="conditionFilter">반송신청 </label>
                <label><input type="radio" value="반송중" name="ConditionOrder" v-model="conditionFilter">반송중 </label>
                <label><input type="radio" value="처리완료" name="ConditionOrder" v-model="conditionFilter">처리완료 </label>
                <label><input type="radio" value="반환대기" name="ConditionOrder" v-model="conditionFilter">반환대기 </label>
                <label><input type="radio" value="반환중" name="ConditionOrder" v-model="conditionFilter">반환중 </label>
                <label><input type="radio" value="반환완료" name="ConditionOrder" v-model="conditionFilter">반환완료 </label>
              </div>
            </td>
          </tr>
          <tr>
            <td class="filter-label">반품/교환 코드</td>
            <td class="filter-input">
              <input type="text" v-model="filterExchangeCode"/>
            </td>
          </tr>
          <tr>
            <td class="filter-label">등록일</td>
            <td colspan="3" class="filter-input">
              <input type="date" id="startDate" v-model="startDate" placeholder="시작 날짜 선택" title="시작 날짜 선택">
              <span>~</span>
              <input type="date" id="endDate" v-model="endDate" placeholder="종료 날짜 선택" title="종료 날짜 선택">
            </td>
          </tr>
        </table>

        <div class="filter-buttons">
          <button @click="resetFilters" class="reset-btn">
            <img src="@/assets/icon/reset.png" alt="Reset"/>
          </button>
          <button @click="applyFilter" class="search-btn">
            <img src="@/assets/icon/search.png" alt="Search"/>
          </button>
        </div>
      </div>

      <div class="filter-buttons">
        <div class="post-btn" id="app">
          <button @click="showPopup" class="postBtn">
            <img src="@/assets/icon/반품신청.png" alt="postProduct">
          </button>
          <button @click="downloadExcel" class="excelBtn">
            <img src="@/assets/icon/excel.png" alt="excel">
          </button>
        </div>
      </div>

      <exchangePopup
          v-if="createPopup"
          :showPopup="showPopup"
          :popupVisible="createPopup"
          :franchiseCode="franchiseCode"
          :franchiseOwnerCode="franchiseOwnerCode"
      />
      <ExchangeDetail
          v-if="createDetailPopup"
          :showDetailPopup="showDetailPopup"
          :popupVisible="createDetailPopup"
          :detailItem="detailItem"
          :franchiseCode="franchiseCode"
          :franchiseOwnerCode="franchiseOwnerCode"
      />
      <div class="table-container">
        <table class="table">
          <thead>
          <tr class="header1">
            <th>반품코드</th>
            <th>반품신청일</th>
            <th>반품상태</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, rowIndex) in paginatedLists" :key="rowIndex"
              :id="'row-' + rowIndex"
              @dblclick="showDetailPopup(item)"
              @mouseenter="highlightRow(rowIndex)"
              @mouseleave="resetRowColor(rowIndex)"
              class="tr__bd"
          >
            <td>{{ item.exchangeCode }}</td>
            <td>{{ item.exchangeDate }}</td>
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
            <td v-else-if="item.exchangeStatus=='반환중'">
              <div class="condition-button inspection-completed">반환중</div>
            </td>
            <td v-else-if="item.exchangeStatus=='반환완료'">
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
import {ref, computed} from 'vue';
import exchangePopup from './exchangePopup.vue';
import ExchangeDetail from './FranchiseExchangeDetail.vue';
import {useStore} from 'vuex';
import axios from "axios"; // Vuex store 임포트
const store = useStore(); // Vuex store 사용

const accessToken = store.state.accessToken;
const lists = ref([]);
const startDate = ref('');
const endDate = ref('');
const franchiseCode = 3;
const franchiseOwnerCode = 3;

const filterExchangeCode = ref('');
const filterFranchiseName = ref('');
const filterFranchiseOwnerName = ref('');
const filterInvoiceCode = ref('');
const filterExchangeDate = ref('');

const conditionFilter = ref('');
const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;

const getExchangeList = async () => {
  try {
    const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
    // const response = await fetch(`http://api.pioms.shop/franchise/exchange/list`, {
    const response = await fetch(`http://api.pioms.shop/franchise/exchange/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const data = await response.json();
      if (data.length > 0) {
        lists.value = data.map(({...rest}) => rest);
        filteredLists.value = lists.value;
      } else {
        lists.value = [];
        filteredLists.value = [];
      }
    } else {
      console.error('Expected JSON, got:', await response.text());
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
};
const downloadExcel = () => {
  axios({
    url: 'http://api.pioms.shop/franchise/exceldownload/exchange-excel',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data], {type: response.headers['content-type']}));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ProductList.xlsx');
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.error('EBad request:', error);
  });
};
const resetFilters = () => {
  conditionFilter.value = "";
  filterExchangeCode.value = "";
  filterFranchiseName.value = "";
  filterFranchiseOwnerName.value = "";
  filterInvoiceCode.value = "";
  filterExchangeDate.value = "";
  startDate.value = '';
  endDate.value = '';
  filteredLists.value = lists.value;
};

const applyFilter = () => {
  currentPage.value = 1;
  filteredLists.value = lists.value.filter(item =>
      (conditionFilter.value ? item.exchangeStatus === conditionFilter.value : true) &&
      (filterExchangeCode.value ? String(item.exchangeCode).includes(filterExchangeCode.value) : true) &&
      (!startDate.value || item.exchangeDate >= startDate.value) &&
      (!endDate.value || item.exchangeDate <= endDate.value)
  );
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
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

getExchangeList();

const createPopup = ref(false);
const createDetailPopup = ref(false);

const showPopup = () => createPopup.value = !createPopup.value;

const detailItem = ref(null);

const showDetailPopup = (item) => {
  detailItem.value = item;
  createDetailPopup.value = !createDetailPopup.value;
};

const highlightRow = (index) => document.querySelector(`#row-${index}`).classList.add('highlighted');

const resetRowColor = (index) => document.querySelector(`#row-${index}`).classList.remove('highlighted');

</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  width: 100%;
  max-width: 1440px;
  text-align: center;
  padding-bottom: 30px;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-icon {
  width: 18px;
}

.breadcrumb {
  font-size: 16px;
  color: #555;
  font-weight: bold;
}

.product-sub-title {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
  justify-content: flex-start;
  width: 100%;
  max-width: 1440px;
  padding-left: 10px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1440px;
}

.filter-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
}

.filter-table td {
  padding: 5px 10px;
}

.filter-label {
  font-weight: bold;
  text-align: center;
  border: solid 1px #747474;
  width: 120px;
  background-color: #d9d9d9;
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
  width: 100%;
  max-width: 1440px;
}

.reset-btn,
.search-btn {
  background-color: #fff;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  margin: 0 5px;
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
  background-color: #d9d9d9;
  font-weight: bold;
  height: 50px;
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
  width: 100%;
  max-width: 1440px;
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

.tr__bd:hover {
  background-color: #f2f2f2;
}

.tr__bd td {
  border-bottom: 1px solid #ddd;
  font-size: 12px;
}

.tr__bd:last-child td {
  border-bottom: none;
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
  table-layout: fixed; /* 고정된 레이아웃을 사용하여 셀 너비를 고정 */
}

.table th, .table td {
  padding: 10px;
  text-align: center;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  overflow: hidden;
  text-overflow: ellipsis; /* 내용이 넘칠 때 "..." 표시 */
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

</style>

