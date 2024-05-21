<template>
  <div class="parent">
    <div>
      <input v-model="filter" placeholder="검색" @input="applyFilter"/>
      <select v-model="dataFilter" @change="applyFilter" >
        <option value="">날짜</option>
        <option value="recent">최신순</option>
        <option value="old">오래된순</option>
      </select>
      <select v-model="conditionFilter" @change="applyFilter">
        <option value="">상품 상태</option>
        <option value="공급가능">공급가능</option>
        <option value="일시제한">일시제한</option>
        <option value="단종">단종</option>
        <option value="품절">품절</option>
      </select>
      <select v-model="priceFilter" @change="applyFilter">
        <option value="">가격순</option>
        <option value="high">가격 높은순</option>
        <option value="low">가격 낮은순</option>
      </select>
    </div>
    <table>
      <thead>
      <tr>
        <th v-for="(header, index) in headers" :key="index">{{header.label}}</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item, rowIndex) in paginatedLists" :key="rowIndex">
          <td v-for="(header, colIndex) in headers" :key="colIndex">
              {{item[header.key]}}
          </td>
        </tr>
        <tr v-for="row in emptyRows" :key="'empty-' + row">
          <td v-for="header in headers" :key="header.key"></td>
        </tr>
      </tbody>
    </table>
    <div class="pagination" >
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span> {{currentPage}} / {{totalPages}} </span>
      <button @click="nextPage" :disabled="currentPage ===totalPages">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const lists = ref([]);
const headers = ref([
  { key: 'productCode', label: '상품 코드'},
  { key: 'productName', label: '상품명'},
  { key: 'productCount', label: '본사 보유량'},
  { key: 'productDisCount', label: '본사 폐기량'},
  { key: 'productNoticeCount', label: '알림 기준 수량'},
  { key: 'productStatus', label: '상품 상태'},
  { key: 'productExposureStatus', label: '상품 노출 상태'},
  { key: 'productColor', label: '색상'},
  { key: 'productSize', label: '사이즈'},
  { key: 'categoryThirdCode', label: '카테고리 코드'},
]);

const filter = ref('');
const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;
const dataFilter = ref('');
const conditionFilter = ref('');

const getMemberId = async () => {
  try {
    const response = await fetch('/api/admin/product', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('네트워크 오류 발생');
    }

    const data = await response.json();
    if (data.length > 0) {
      lists.value = data.map(({ product, ...rest }) => rest);
      filteredLists.value = lists.value;
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

  filteredLists.value = lists.value.filter(item =>
      (Object.values(item).some(val =>
          String(val).toLowerCase().includes(filter.value.toLowerCase())
      )) &&
      (dateFilter.value ? true : true) && // 날짜 필터는 따로 처리하지 않습니다.
      (conditionFilter.value ? item['orderCondition'] === conditionFilter.value : true)
  );

  // 날짜를 오래된 순으로 정렬합니다.
  if (dateFilter.value === 'old') {
    filteredLists.value.sort((a, b) => compareDate(a.productEnrollDate, b.productEnrollDate));
  } else if (dateFilter.value === 'recent') {
    // 최근 순으로 정렬합니다.
    filteredLists.value.sort((a, b) => compareDate(b.productEnrollDate, a.productEnrollDate));
  }

  console.log("Filtered Lists:", filteredLists.value);
};


const compareDate = (productEnrollDateA, productEnrollDateB) => {
  const dateA = new Date(productEnrollDateA);
  const dateB = new Date(productEnrollDateB);

  return dateA - dateB; // 오래된 순으로 정렬
};

const paginatedLists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredLists.value.slice(start, end);
});

const emptyRows = computed(() => {
  const currentList = paginatedLists.value;
  const emptyRowCount = itemsPerPage - currentList.length;
  return Array.from({ length: emptyRowCount });
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

</script>

<style scoped>

table {
  width: 1000px; /* 화면 너비의 25% */
  height: 25vh; /* 화면 높이의 25% */
  border-collapse: collapse;
  font-size: 12px;
}
tr {
  height: 30px;
}
th {
  border: 1px solid #d9d9d9;
  width: 100px; /* 고정된 th의 셀 너비 */
  height: 30px; /* 고정된 th의 셀 높이 */
  text-align: center; /* 텍스트 가운데 정렬 */
  background-color: #f4f4f4;
  font-weight: bold;
}
td {
  border: 1px solid #d9d9d9;
  width: 100px; /* th의 셀과 같은 너비 */
  height: 30px; /* th의 셀과 같은 높이 */
  text-align: center; /* 텍스트 가운데 정렬 */
  overflow: hidden; /* 넘치는 텍스트 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트에 생략 기호 추가 */
  white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
}

tr {
  border: 1px solid #d9d9d9;
  width: 100px; /* th의 셀과 같은 너비 */
  height: 30px; /* th의 셀과 같은 높이 */
  text-align: center; /* 텍스트 가운데 정렬 */
  overflow: hidden; /* 넘치는 텍스트 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트에 생략 기호 추가 */
  white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

thead {
  border-bottom: 2px solid #ccc;
}
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}
input {
  margin-right: 1%;
}
select {
  margin-bottom: 1%;
  margin-right: 1%;
}
</style>
