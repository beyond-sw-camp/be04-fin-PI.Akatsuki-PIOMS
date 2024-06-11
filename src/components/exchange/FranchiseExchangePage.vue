<template>

  <div>
    <div align="center"  style="padding-bottom: 30px;">
      <div class="action-buttons"  >
        <br>
        <div style="float: left" ><img src="@/assets/icon/어드민.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">반품 및 교환 관리 > 반품 관리 > 반품 상품 조회</span>
        </div>
      </div>
    </div>
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">반품상태</td>
          <td class="filter-input">
            <div class="radio-group">
              <label><input type="radio" value="반송신청" name="ConditionOrder" v-model="conditionFilter" >반송신청  </label>
              <label><input type="radio" value="반송중" name="ConditionOrder" v-model="conditionFilter" >반송중  </label>
              <label><input type="radio" value="처리완료" name="ConditionOrder" v-model="conditionFilter" >처리완료  </label>
              <label><input type="radio" value="반환대기" name="ConditionOrder" v-model="conditionFilter" >반환대기  </label>
              <label><input type="radio" value="반환중" name="ConditionOrder" v-model="conditionFilter" >반환중  </label>
              <label><input type="radio" value="반환완료" name="ConditionOrder" v-model="conditionFilter" >반환완료  </label>
            </div>
          </td>
        </tr>
        <tr>
          <td class="filter-label">반품/교환 코드</td>
          <td class="filter-input">
            <input type="text" v-model="filterExchangeCode"  />
          </td>
        </tr>
        <tr>
          <td class="filter-label">등록일</td>
          <td colspan="3" class="filter-input">
            <input type="date" id="startDate" v-model="startDate" placeholder="시작 날짜 선택" title="시작 날짜 선택" >
            <span>~</span>
            <input type="date" id="endDate" v-model="endDate" placeholder="종료 날짜 선택" title="종료 날짜 선택" >
          </td>
        </tr>
      </table>
    </div>
    <div align="center" >
      <div class="action-buttons" >
        <button @click="resetFilters" class="reset-btn">
          <img src="@/assets/icon/reset.png" alt="Reset" />
        </button>
        <button @click="applyFilter" class="search-btn">
          <img src="@/assets/icon/search.png" alt="Search" />
        </button>
        <br>
        <input class="create-btn"  type="button" value="반품신청하기" @click="showPopup" style="cursor: pointer; float: right">
        <br><br><br>
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
              class="allpost"
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
import ExchangeDetail from './FranchiseExchangeDetail.vue';
import { useStore } from 'vuex'; // Vuex store 임포트
const store = useStore(); // Vuex store 사용


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
    // const response = await fetch(`http://localhost:5000/franchise/exchange/list`, {
    const response = await fetch(`http://localhost:5000/franchise/exchange/list`, {
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
        lists.value = data.map(({ ...rest }) => rest);
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
    (!endDate.value || item.exchangeDate<= endDate.value)
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
  @import "../../assets/css/order.css";


</style>

