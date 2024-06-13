<template>
  <div class="container">
    <div class="header" align="center" style="padding-bottom: 30px;">
      <div style="  max-width: 1440px;justify-content: center;align-items: center;">
        <br>
        <div style="float: left"><img src="@/assets/icon/Delivery.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">발주 및 교환 관리 &gt; 발주 관리 &gt; 발주내역 조회 및 관리</span>
        </div>
      </div>
    </div>

    <div class="product-sub-title"> * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png">초기화 또는<img src="@/assets/icon/search.png">검색을 눌러주세요.
    </div>

    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">승인상태</td>
          <td class="filter-input">
            <div class="radio-group">
              <label><input type="radio" value="승인대기" name="ConditionOrder" v-model="conditionFilter"
                            @change="applyFilter">승인대기 </label>
              <label><input type="radio" value="승인완료" name="ConditionOrder" v-model="conditionFilter"
                            @change="applyFilter">발주승인 </label>
              <label><input type="radio" value="승인거부" name="ConditionOrder" v-model="conditionFilter"
                            @change="applyFilter">발주반려 </label>
              <label><input type="radio" value="검수대기" name="ConditionOrder" v-model="conditionFilter"
                            @change="applyFilter">검수대기 </label>
              <label><input type="radio" value="검수완료" name="ConditionOrder" v-model="conditionFilter"
                            @change="applyFilter">검수완료 </label>
            </div>
          </td>

          <td class="filter-label">주문(발주)번호</td>
          <td class="filter-input">
            <input type="text" v-model="filterOrderCode"/>
          </td>
        </tr>
        <tr>
          <td class="filter-label">주문(발주)일</td>
          <td class="filter-input">
            <input type="date" v-model="filterOrderDate"/>
          </td>

          <td class="filter-label">배송(송장)번호</td>
          <td class="filter-input">
            <input type="text" v-model="filterInvoiceCode"/>
          </td>
        </tr>

      </table>
    </div>


    <div align="center">
      <div class="action-buttons">
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
        <button class="postBtn" style="float: left" @click="showPopup">
          <img src="@/assets/icon/발주등록.png">
        </button>
        <button @click="downloadExcel" class="excelBtn">
          <img src="@/assets/icon/excel.png" alt="excel">
        </button>
      </div>
    </div>

    <popup
        v-if="createPopup"
        :showPopup="showPopup"
        :popupVisible="createPopup"
        :franchiseCode="franchiseCode"
        :franchiseOwnerCode="franchiseOwnerCode"/>
    <OrderDetail
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
          <th>발주번호</th>
          <th>발주일</th>
          <th>송장번호</th>
          <th>배송예정일</th>
          <th>발주상태</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, rowIndex) in paginatedLists" :key="rowIndex"
            :id="'row-' + rowIndex"
            @dblclick="showDetailPopup(item)"
            @mouseenter="highlightRow(rowIndex)"
            @mouseleave="resetRowColor(rowIndex)"
            align="center"
            class="allpost"
        >
          <td>{{ item.orderCode }}</td>
          <td>{{ item.orderDate }}</td>
          <td v-if="item.invoiceCode!=0" class="num" style="width:5%">{{ item.invoiceCode }}</td>
          <td v-else class="num" style="width:5%">-</td>
          <td v-if="item.invoiceDate!=null">{{ item.invoiceDate }}</td>
          <td v-else>-</td>
          <td v-if="item.orderCondition=='승인대기'">
            <div class="condition-button pending">승인대기</div>
          </td>
          <td v-else-if="item.orderCondition=='승인완료'" class="num">
            <div class="condition-button approved">승인완료</div>
          </td>
          <td v-else-if="item.orderCondition=='승인거부'" class="num">
            <div class="condition-button rejected">승인거부</div>
          </td>
          <td v-else-if="item.orderCondition=='검수대기'" class="num">
            <div class="condition-button inspection-pending">검수대기</div>
          </td>
          <td v-else-if="item.orderCondition=='검수완료'" class="num">
            <div class="condition-button inspection-completed">검수완료</div>
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
import {ref, computed} from 'vue';
import popup from './FranchiseOrderPopup.vue';
import OrderDetail from './FranchiseOrderDetail.vue';
import {useStore} from 'vuex'; // Vuex store 임포트
import axios from "axios";

const store = useStore(); // Vuex store 사용
const accessToken = store.state.accessToken;
const lists = ref([]);

const headers = ref([
  {key: 'orderCode', label: '발주번호'},
  {key: 'orderDate', label: '발주일'},
  {key: 'invoiceCode', label: '송장번호'},
  {key: 'invoiceDate', label: '배송예정일'},
  {key: 'orderCondition', label: '발주상태'},
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


const downloadExcel = () => {
  axios({
    url: 'http://api.pioms.shop/franchise/exceldownload/order-excel', // 백엔드 엑셀 다운로드 API 엔드포인트
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    responseType: 'blob', // 서버에서 반환되는 데이터의 형식을 명시
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data], {type: response.headers['content-type']}));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'OrderList.xlsx'); // 원하는 파일 이름 설정
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.error('EBad request:', error);
  });
};

const getOrderList = async () => {

  try {
    const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`http://api.pioms.shop/franchise/order/list`, {
      //const response = await fetch(`http://api.pioms.shop/franchise/order/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (response.status == 204) {
      return;
    }

    if (!response.ok) {
      throw new Error('네트워크 오류 발생');

    }

    const data = await response.json();
    console.log(data);
    if (data.orderList.length > 0) {
      // lists.value = data.orderList.map(({ ...rest }) => rest);
      lists.value = data.orderList;
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

</style>
