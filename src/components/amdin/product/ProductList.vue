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
              <option value="공급가능">공급가능</option>
              <option value="일시제한">일시제한</option>
              <option value="단종">단종</option>
              <option value="품절">품절</option>
            </select>
          </td>
          <td class="filter-label">상품노출상태</td>
          <td class="filter-input">
            <select id="selectedExposureStatus" v-model="selectedExposureStatus">
              <option value="노출">노출</option>
              <option value="미노출">미노출</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="filter-label">색상</td>
          <td class="filter-input">
            <select id="filterColor" v-model="filterColor">
              <option value="빨간색">빨간색</option>
              <option value="주황색">주황색</option>
              <option value="노란색">노란색</option>
              <option value="초록색">초록색</option>
              <option value="파란색">파란색</option>
              <option value="남색">남색</option>
              <option value="보라색">보라색</option>
            </select>
          </td>
          <td class="filter-label">사이즈</td>
          <td class="filter-input">
            <select id="filterSize" v-model="filterSize">
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
              <option v-for="category in firstCategories" :key="category.categoryFirstCode" :value="category.categoryFirstCode">
                {{ category.categoryFirstName }}
              </option>
            </select>
            <select class="categories" id="secondCategory" v-model="selectedSecondCategory" @change="fetchThirdCategories">
              <option value="">중분류</option>
              <option v-for="category in secondCategories" :key="category.categorySecondCode" :value="category.categorySecondCode">
                {{ category.categorySecondName }}
              </option>
            </select>
            <select class="categories" id="thirdCategory" v-model="selectedThirdCategory">
              <option value="">소분류</option>
              <option v-for="category in thirdCategories" :key="category.categoryThirdCode" :value="category.categoryThirdCode">
                {{ category.categoryThirdName }}
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
    <div class="post-btn" id="app">
      <button @click="showPostPopup = true" class="postBtn">등록하기</button>
      <ProductPostPopup v-if="showPostPopup" @close="showPostPopup = false" />
      <button @click="downloadExcel" class="excelBtn"><img src="@/assets/icon/excel.png" alt="excel"></button>
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
          <td v-for="(header, colIndex) in headers" :key="colIndex" class="table-td">
            <button v-if="header.key === 'productName'" @click="showModifyPopup(item.productCode)" class="button-as-text">
              {{ item[header.key] }}
            </button>
            <span v-else>{{ item[header.key] }}</span>
          </td>
        </tr>
        <tr v-for="row in emptyRows" :key="'empty-' + row">
          <td v-for="header in headers" :key="header.key"></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span> {{currentPage}} / {{totalPages}} </span>
      <button @click="nextPage" :disabled="currentPage ===totalPages">다음</button>
    </div>
    <ProductDetailPopup v-if="currentProductCode" :currentProductCode="currentProductCode" @close="currentProductCode = null" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductPostPopup from "@/components/amdin/product/ProductPostPopup.vue"
import ProductDetailPopup from "@/components/amdin/product/ProductDetailPopup.vue";
import axios from "axios";

const lists = ref([]);
const headers = ref([
  { key: 'productCode', label: '상품 코드'},
  { key: 'productName', label: '상품명'},
  { key: 'productCount', label: '본사 보유량'},
  { key: 'productDiscount', label: '본사 폐기량'},
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

const firstCategories = ref([]);
const secondCategories = ref([]);
const thirdCategories = ref([]);
const selectedFirstCategory = ref('');
const selectedSecondCategory = ref('');
const selectedThirdCategory = ref('');

const fetchFirstCategories = async () => {
  try {
    const response = await fetch('/api/admin/category/first', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('대분류를 불러오는 데 실패했습니다.');
    }
    firstCategories.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchSecondCategories = async () => {
  if (selectedFirstCategory.value === '') {
    secondCategories.value = [];
    return;
  }
  try {
    const response = await fetch(`/api/admin/category/second/list/detail/categoryfirst/${selectedFirstCategory.value}`);
    if (!response.ok) {
      throw new Error('중분류를 불러오는 데 실패했습니다.');
    }
    secondCategories.value = await response.json();
    thirdCategories.value = [];
    selectedSecondCategory.value = '';
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchThirdCategories = async () => {
  if (selectedSecondCategory.value === '') {
    thirdCategories.value = [];
    return;
  }
  try {
    const response = await fetch(`/api/admin/category/third/list/detail/categorysecond/${selectedSecondCategory.value}`);
    if (!response.ok) {
      throw new Error('소분류를 불러오는 데 실패했습니다.');
    }
    thirdCategories.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

const applyFilters = () => {
  filteredLists.value = lists.value.filter(list => {
    const matchesExposureStatus = selectedExposureStatus.value === '전체' || list.productExposureStatus === (selectedExposureStatus.value === '노출');
    const matchesStatus = !filterStatus.value || list.productStatus === filterStatus.value;
    const matchesColor = !filterColor.value || list.productColor === filterColor.value;
    const matchesSize = !filterSize.value || list.productSize === parseInt(filterSize.value, 10);
    const matchesCategory = !selectedThirdCategory.value || list.categoryThirdCode === selectedThirdCategory.value;

    return matchesExposureStatus && matchesStatus && matchesColor && matchesSize && matchesCategory;
  });
};

const resetFilters = () => {
  selectedExposureStatus.value = '전체';
  filterStatus.value = '';
  filterColor.value = '';
  filterSize.value = '';
  selectedFirstCategory.value = '';
  selectedSecondCategory.value = '';
  selectedThirdCategory.value = '';
  filteredLists.value = lists.value;
};

const showPostPopup = ref(false);
const currentProductCode = ref('');
const setCurrentProductCode = (productCode) => {
  currentProductCode.value = productCode;
};

const showModifyPopup = (productCode) => {
  setCurrentProductCode(productCode);
};

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

const downloadExcel = () => {
  axios({
    url: 'http://localhost:5000/admin/exceldownload/product-excel', // 백엔드 엑셀 다운로드 API 엔드포인트
    method: 'GET',
    responseType: 'blob', // 서버에서 반환되는 데이터의 형식을 명시
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'productList.xlsx'); // 원하는 파일 이름 설정
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.error('Excel 다운로드 중 오류 발생:', error);
  });
};

const paginatedLists = computed(() => {
  let items = [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

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
downloadExcel();
fetchFirstCategories();
fetchSecondCategories();
fetchThirdCategories();
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
.postBtn {
  width: 67px;
  height: 30px;
  border: none;
  background-color: #D9D9D9;
  cursor: pointer;
  text-align: center;
  align-items: center;
}
.excelBtn {
  width: 100px;
  height: 26px;
  border: none;
  background-color: white;
  cursor: pointer;
  margin-right: 0.5%;
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
.post-btn {
  display: flex;
  justify-content: space-between; /* 양 끝에 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  position: absolute; /* 절대 위치 설정 */
  left: 18.5%; /* 좌측 정렬 */
  transform: translateY(-50%); /* 수직 중앙 정렬 */
  width: 1200px;
}

.post-btn .postBtn {
  order: 1; /* 왼쪽에 배치 */
  flex: 0 0 auto; /* 고정된 너비 */
}

.post-btn .excelBtn {
  order: 2; /* 오른쪽에 배치 */
  flex: 0 0 auto; /* 고정된 너비 */
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
  table-layout: fixed;
}

.table th {
  font-weight: bold;
  color: #000;
  width: 100px;
  height: 10px;
  table-layout: fixed;
}

.table th,
.table td {
  border: 0.5px solid #D9D9D9;
  padding: 8px;
  width: 80px;
  height: 10px;
  table-layout: fixed;
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
  width: 5%;
}

.allpost:hover {
  background-color: #f2f2f2;
}

.allpost td {
  border-right: 1px solid #ddd;
}

.categories {
  margin-left: 2%;
}
.button-as-text {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-align: left; /* 텍스트 정렬을 위해 필요시 사용 */
}
</style>
