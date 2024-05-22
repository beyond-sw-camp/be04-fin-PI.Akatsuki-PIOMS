<template>
  <div>
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">상품명</td>
          <td class="filter-input">
            <input type="text" v-model="filterProductName" />
          </td>
        </tr>
        <tr>
          <td class="filter-label">상품상태</td>
          <td class="filter-input">
            <select id="filterStatus" v-model="filterStatus">
              <option value="전체">전체</option>
              <option value="공급가능">공급가능</option>
              <option value="일시제한">일시제한</option>
              <option value="단종">단종</option>
              <option value="품절">품절</option>
            </select>
          </td>
          <td class="filter-label">상품노출상태</td>
          <td class="filter-input">
            <select id="selectedExposureStatus" v-model="selectedExposureStatus">
              <option value="">노출여부</option>
              <option value="True">노출</option>
              <option value="False">미노출</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="filter-label">색상</td>
          <td class="filter-input">
            <select id="filterColor" v-model="filterColor">
              <option value="">전체</option>
              <option value="RED">빨간색</option>
              <option value="ORANGE">주황색</option>
              <option value="YELLOW">노란색</option>
              <option value="GREEN">초록색</option>
              <option value="BLUE">파란색</option>
              <option value="NAVY">남색</option>
              <option value="PURPLE">보라색</option>
            </select>
          </td>
          <td class="filter-label">사이즈</td>
          <td class="filter-input">
            <select id="filterSize" v-model="filterSize">
              <option value="">전체</option>
              <option value="90">90</option>
              <option value="95">95</option>
              <option value="100">100</option>
              <option value="105">105</option>
              <option value="110">110</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="filter-label">카테고리 구분</td>
          <td class="filter-input">
            <select id="firstCategory" v-model="selectedFirstCategory" @change="fetchSecondCategories">
              <option value="">대분류</option>
              <option v-for="category in firstCategories" :key="category.code" :value="category.name">
                {{ category.name }}
              </option>
            </select>
            <select id="secondCategory" v-model="selectedSecondCategory" @change="fetchThirdCategories">
              <option value="">선택하세요</option>
              <option v-for="category in secondCategories" :key="category.code" :value="category.name">
                {{ category.name }}
              </option>
            </select>
            <select id="thirdCategory" v-model="selectedThirdCategory">
              <option value="">선택하세요</option>
              <option v-for="category in thirdCategories" :key="category.code" :value="category.name">
                {{ category.name }}
              </option>
            </select>
          </td>
        </tr>
      </table>
    </div>
    <div class="action-buttons">
      <button @click="resetFilters" class="reset-btn">
        <img src="@/assets/icon/reset.png" alt="Reset" />
      </button>
      <button @click="applyFilters" class="search-btn">
        <img src="@/assets/icon/search.png" alt="Search" />
      </button>
    </div>
    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th v-for="(header, index) in headers" :key="index">{{header.label}}</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(item, rowIndex) in paginatedLists" :key="rowIndex" class="allpost">
            <td v-for="(header, colIndex) in headers" :key="colIndex">
                {{item[header.key]}}
            </td>
          </tr>
          <tr v-for="row in emptyRows" :key="'empty-' + row">
            <td v-for="header in headers" :key="header.key"></td>
          </tr>
        </tbody>
      </table>
    </div>
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

const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;
const selectedExposureStatus = ref('전체');
const filterStatus = ref('');
const filterColor = ref('');
const filterSize = ref('');

const applyFilters = () => {
  filteredLists.value = lists.value.filter(list => {
    const matchesExposureStatus = selectedExposureStatus.value === '전체' || list.productExposureStatus === filterStatus.value;
    const matchesStatus = !filterStatus.value || list.productStatus === filterStatus.value;
    const matchesColor = !filterColor.value || list.productColor === filterColor.value;
    const matchesSize = !filterSize.value || list.productSize === filterSize.value;

    return matchesExposureStatus && matchesStatus && matchesColor && matchesSize;
  })
}

const resetFilters = () => {
  selectedExposureStatus.value = '전체';
  filterStatus.value = '';
  filterColor.value = '';
  filterSize.value = '';
  filteredLists.value = lists.value;
}
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

const paginatedLists = computed(() => {
  let items = [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // 만약 데이터가 부족하면, 남은 아이템의 개수를 계산해서 추가합니다.
  if (filteredLists.value.length < itemsPerPage) {
    const remainingItems = itemsPerPage - filteredLists.value.length;
    items = [...filteredLists.value, ...Array.from({ length: remainingItems }).map(() => ({}))];
  } else {
    items = filteredLists.value.slice(start, end);
  }

  return items;
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
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 1200px;
  margin-top: 2%;
}

.filter-table td {
  padding: 5px 10px;
}

.filter-label {
  font-weight: bold;
  text-align: center;
  width: 100px;
  background-color: #D9D9D9;
  border: 1px solid #ddd;
}

.filter-input {
  width: 500px;
  text-align: left;
  border: 1px solid lightgray;
  border-right: none;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.reset-btn, .search-btn {
  background-color: #fff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 8px;
  font-size: 14px;
  margin: 0 5px;
}

.reset-btn:hover, .search-btn:hover {
  background-color: #fff;
}

.table-container {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.table {
  width: 1200px;
  max-width: 1200px;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-spacing: 0 10px;
}

.table th {
  font-weight: bold;
  color: #000;
}

.table th,
.table td {
  border: 0.5px solid #D9D9D9; /* 각 셀의 테두리를 회색으로 지정합니다. */
  padding: 8px; /* 각 셀의 안쪽 여백을 지정합니다. */
}


.header1 {
  background-color: #D9D9D9;
  font-weight: bold;
  height: 50px;
  font-size: 12px;
  text-align: center;
}

.header1 {
  width: 5%;
}

.allpost {
  text-align: center;
  padding: 10px 0;
}

.allpost {
  width: 5%;
}

.allpost td {
  border-right: 1px solid #ddd;
}
</style>
