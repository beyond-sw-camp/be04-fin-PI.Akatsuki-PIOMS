<template>
  <div>

    <input class="create-button" type="button" value="발주하기" @click="showPopup" style="  cursor : pointer; border:0; ">


    <popup v-if="createPopup" :showPopup="showPopup" :popupVisible="createPopup"/>
    <OrderDetail v-if="createDetailPopup" :showDetailPopup="showDetailPopup" :popupVisible="createDetailPopup" :detailItem="detailItem"/>

    <div class="filter-container">
      <div class="radio-group">
        <div class="title">
        <label style="width:100px">검색 </label></div>
        <input v-model="filter" placeholder="검색어를 입력하세요" @input="applyFilter" />
      </div>
      <div class="radio-group">
        <div class="title"><label style="width:100px">날짜</label></div>
        <label>
          최신순 <input checked type="radio" value="recent" name="dateOrder" v-model="dateFilter" @change="applyFilter" >
        </label>
        <label>
          오래된순 <input type="radio" value="old" name="dateOrder" v-model="dateFilter" @change="applyFilter" >
        </label>
      </div>
      <div class="radio-group">
        <div class="title">
        <label style="width:100px">발주상태</label></div>
        <label> 전체 <input type="radio" value="" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter" checked></label>
        <label> 승인대기 <input type="radio" value="승인대기" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
        <label> 발주승인 <input type="radio" value="승인완료" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
        <label> 발주반려 <input type="radio" value="승인거부" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
        <label> 검수대기 <input type="radio" value="검수대기" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
        <label> 검수완료 <input type="radio" value="검수완료" name="ConditionOrder" v-model="conditionFilter" @change="applyFilter"></label>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, rowIndex) in paginatedLists" :key="rowIndex"
            :id="'row-' + rowIndex"
            @dblclick="showDetailPopup(item)"
            @mouseenter="highlightRow(rowIndex)"
            @mouseleave="resetRowColor(rowIndex)"
        >
          <td v-for="(header, colIndex) in headers" :key="colIndex">
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
import popup from './exchangePopup.vue';
import OrderDetail from './exchangeDetail.vue';


const lists = ref([]);

// 추후 토큰으로 받을 예정
const franchiseCode = ref(1);
const adminCode = ref(2);

const headers = ref([
  { key: 'exchangeCode', label: '주문 코드' },
  { key: 'exchangeDate', label: '주문 날짜' },
  { key: 'exchangeStatus', label: '주문 상태' },
  { key: 'franchiseCode', label: '가맹점 코드' },
  { key: 'franchiseName', label: '가맹점 이름' },
  { key: 'franchiseOwnerName', label: '가맹점주 이름' },
  { key: 'franchiseAddress', label: '가맹점 주소' },
  { key: 'exchange', label: '교환 코드' },
  { key: 'adminName', label: '관리자 이름' },
]);

const filter = ref('');
const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;
const dateFilter = ref('');
const conditionFilter = ref('');

const getMemberId = async () => {
  try {
    const response = await fetch(`/api/admin/exchanges?adminCode=${adminCode.value}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('네트워크 오류 발생');
    }
    const data = await response.json();
    if (data.length > 0) {
      lists.value = data.map(({  ...rest }) => rest);

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



const applyFilter = () => {
  currentPage.value = 1; // 필터 적용 시 페이지를 초기화합니다.
  if(conditionFilter.value == ""){
    filteredLists.value = lists.value;
  }else{
    filteredLists.value = lists.value.filter(item =>
      (Object.values(item).some(val =>
        String(val).toLowerCase().includes(filter.value.toLowerCase())
      )) &&
      (dateFilter.value ? true : true) && 
      (conditionFilter.value ? item['orderCondition'] === conditionFilter.value : true)
    );
  }
  
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

getMemberId();

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