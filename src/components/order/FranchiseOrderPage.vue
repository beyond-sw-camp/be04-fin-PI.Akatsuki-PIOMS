<template>

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
  <div align="center" >
    <div class="action-buttons"  >
      <button @click="resetFilters" class="reset-btn">
        <img src="@/assets/icon/reset.png" alt="Reset" />
      </button>
      <button @click="applyFilter" class="search-btn">
        <img src="@/assets/icon/search.png" alt="Search" />
      </button>
    </div>
      <br>
      <button class="create-btn" style="float: right" @click="showPopup" >발주하기</button>
<!--      <button class="create-btn"  @click="downloadExcel"><img src="@/assets/icon/excel.png" alt="excel"></button>-->
      <br><br><br>
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
      <thead >
        <tr class="header1">
          <th>발주번호</th><th>발주일</th><th>송장번호</th><th>배송예정일</th><th>발주상태</th>
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
          <td >{{ item.orderCode }}</td>
          <td >{{ item.orderDate }}</td>
          <td v-if="item.invoiceCode!=0" class="num" style="width:5%">{{ item.invoiceCode }}</td>
          <td v-else class="num" style="width:5%">-</td>
          <td v-if="item.invoiceDate!=null">{{ item.invoiceDate }}</td>
          <td v-else>-</td>
          <td v-if="item.orderCondition=='승인대기'" >
            <div class="condition-button pending">승인대기</div>
          </td>
          <td v-else-if="item.orderCondition=='승인완료'" class="num">
            <div class="condition-button approved" >승인완료</div>
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
</template>



<script setup>
import { ref, computed } from 'vue';
import popup from './FranchiseOrderPopup.vue';
import OrderDetail from './FranchiseOrderDetail.vue';
import { useStore } from 'vuex'; // Vuex store 임포트
import axios from "axios";

const store = useStore(); // Vuex store 사용
const accessToken = store.state.accessToken;
const lists = ref([]);

// 추후 토큰으로 받을 예정
const franchiseCode = 3;
const franchiseOwnerCode = 3;

const headers = ref([
  { key: 'orderCode', label: '발주번호' },
  { key: 'orderDate', label: '발주일' },
  { key: 'invoiceCode', label: '송장번호' },
  { key: 'invoiceDate', label: '배송예정일' },
  { key: 'orderCondition', label: '발주상태' },
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
    url: 'http://localhost:5000/franchise/exceldownload/order-excel', // 백엔드 엑셀 다운로드 API 엔드포인트
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    responseType: 'blob', // 서버에서 반환되는 데이터의 형식을 명시
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
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

    const response = await fetch(`http://localhost:5000/franchise/order/list`, {
    //const response = await fetch(`http://api.pioms.shop/franchise/order/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if(response.status == 204){
      alert("발주 내역이 없습니다.")
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
@import "../../assets/css/order.css" ;
</style>
