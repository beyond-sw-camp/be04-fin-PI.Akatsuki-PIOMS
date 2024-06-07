<template>
  <div v-if="isLoading">
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">주문(발주)번호</td>
          <td class="filter-input">
            <input type="text" v-model="filterOrderCode" />
          </td>
          <td class="filter-label">배송(송장)번호</td>
          <td class="filter-input">
            <input type="text" v-model="filterInvoiceCode" />
          </td>
        </tr>
      </table>
    </div>
    <div align="center">
      <div class="action-buttons">
        <button @click="resetFilters" class="reset-btn">
          <img src="@/assets/icon/reset.png" alt="Reset" />
        </button>
        <button @click="applyFilter" class="search-btn">
          <img src="@/assets/icon/search.png" alt="Search" />
        </button>
        <br><br><br>
      </div>
    </div>
   
    <div class="table-container">
      <table class="table">
        <thead>
          <tr class="header1">
            <th>발주코드</th>
            <th>발주코드</th>
            <th>상품리스트</th>
            <th>발주예정일</th>
            <th>발주상태</th>
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
            <td class="num">{{ item.invoiceCode }}</td>
            <td>{{ item.orderCode }}</td>
            <td style="width: 60%;">
              <a v-for="(products, rowIndex) in item.orderProductVOList">
                  {{ products.productName}},
              </a>
            </td>
            <td>{{ item.invoiceDate }}</td>
            <td v-if="item.deliveryStatus=='배송전'" style="width: 5%; padding:5px;" > <div style=" background-color: green; border-radius: 5px; ;color: aliceblue; font-weight: bold;"> {{ item.deliveryStatus }} </div></td>
            <td v-if="item.deliveryStatus=='배송중'" style="width: 5%; padding:5px;"><div style=" background-color: pink; border-radius: 5px; ;color: aliceblue; font-weight: bold;"> {{ item.deliveryStatus }} </div></td>
            <td v-if="item.deliveryStatus=='배송완료'" style="width: 5%; padding:5px;"><div style=" background-color: hotpink; border-radius: 5px; ;color: aliceblue; font-weight: bold;"> {{ item.deliveryStatus }} </div></td>

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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Swal from "sweetalert2";

const store = useStore();

const isLoading = ref(false);
const lists = ref([]);
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
    const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`http://api.pioms.shop/admin/invoice/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('네트워크 오류 발생');
    }
    const data = await response.json();
    console.log(data);
    if (data.invoiceList && data.invoiceList.length > 0) {
      lists.value = data.invoiceList;
      filteredLists.value = lists.value;
    } else {
      lists.value = [];
      filteredLists.value = [];
    }
    isLoading.value = true;
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
  currentPage.value = 1;
  filteredLists.value = lists.value.filter(item =>
    (conditionFilter.value ? item.orderCondition === conditionFilter.value : true) &&
    (filterOrderCode.value ? String(item.orderCode).includes(filterOrderCode.value) : true) &&
    (filterFranchiseName.value ? String(item.franchiseName).includes(filterFranchiseName.value) : true) &&
    (filterFranchiseOwnerName.value ? String(item.franchiseOwnerName).includes(filterFranchiseOwnerName.value) : true) &&
    (filterInvoiceCode.value ? String(item.invoiceCode).includes(filterInvoiceCode.value) : true) &&
    (filterOrderDate.value ? String(item.orderDate).includes(filterOrderDate.value) : true)
  );

  if (dateFilter.value === 'old') {
    filteredLists.value.sort((a, b) => compareDate(a.orderDate, b.orderDate));
  } else if (dateFilter.value === 'recent') {
    filteredLists.value.sort((a, b) => compareDate(b.orderDate, a.orderDate));
  }
};

const compareDate = (orderDateA, orderDateB) => {
  const dateA = new Date(orderDateA);
  const dateB = new Date(orderDateB);
  return dateA - dateB;
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

onMounted(() => {
  getOrderList();
});

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
  @import "../../../assets/css/order.css" ;

</style>
