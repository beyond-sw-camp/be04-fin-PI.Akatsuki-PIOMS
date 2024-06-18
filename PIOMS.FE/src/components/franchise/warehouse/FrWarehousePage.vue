<template>
  <div class="container">
    <div class="header" align="center" style="padding-bottom: 30px;">
      <div style="max-width: 1440px; justify-content: center; align-items: center;">
        <br>
        <div style="float: left">
          <img src="@/assets/icon/가맹점.png" style="width: 18px" />&nbsp;
          <span class="breadcrumb">창고 조회 및 재고 관리 > 창고 조회 > 가맹 창고 조회</span>
        </div>
      </div>
    </div>

    <div class="product-sub-title">
      * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png" /> 초기화 또는
      <img src="@/assets/icon/search.png" /> 검색을 눌러주세요.
    </div>

    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">상품명</td>
          <td class="filter-input">
            <input
                type="text"
                v-model="filterProductName"
                @keyup.enter="applyFilters"
                class="textInput"
                placeholder="상품명을 입력하세요."
            />
          </td>
          <td class="filter-label">상품상태</td>
          <td class="filter-input">
            <select id="filterStatus" v-model="filterStatus" class="textInput">
              <option hidden="hidden" value="">전체</option>
              <option value="공급가능">공급가능</option>
              <option value="일시제한">일시제한</option>
              <option value="단종">단종</option>
              <option value="품절">품절</option>
            </select>
          </td>
        </tr>

        <tr>
          <td class="filter-label">색상</td>
          <td class="filter-input">
            <select id="filterColor" v-model="filterColor" class="textInput">
              <option hidden="hidden" value="">전체</option>
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
            <select id="filterSize" v-model="filterSize" class="textInput">
              <option hidden="hidden" value="">전체</option>
              <option value="90">90</option>
              <option value="95">95</option>
              <option value="100">100</option>
              <option value="105">105</option>
              <option value="110">110</option>
            </select>
          </td>
        </tr>
      </table>
    </div>

    <div class="filter-buttons">
      <button @click="resetFilters" class="reset-btn">
        <img src="@/assets/icon/reset.png" alt="Reset" />
      </button>
      <button @click="applyFilters" class="search-btn">
        <img src="@/assets/icon/search.png" alt="Search" />
      </button>
    </div>

    <div class="filter-buttons">
      <div class="post-btn" id="app">
        <button class="postBtn"></button>
        <button @click="downloadExcel" class="excelBtn">
          <img src="@/assets/icon/excel.png" alt="excel" />
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th style="width: 6%">상품 코드</th>
          <th>상품 이름</th>
          <th>색상</th>
          <th>사이즈</th>
          <th>상품상태</th>
          <th>상품 누적량</th>
          <th>상품 보유량</th>
          <th style="width: 100px">상품 판매가능량</th>
          <th style="width: 25%">카테고리</th>
          <th style="width: 5%">즐겨찾기</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, rowIndex) in filteredLists"
            :key="rowIndex"
            class="tr__bd"
            :id="'row-' + rowIndex"
            @click="showDetailPopup(item.productCode, item.productName, item.productCount, item.productPrice, item.productStatus, item.productColor, item.productSize, item.categoryFirstName, item.categorySecondName, item.categoryThirdName, item.productContent)"
        >
          <td>{{ item.product.productCode }}</td>
          <td>{{ item.product.productName }}</td>
          <td>{{ item.product.productColor }}</td>
          <td>{{ item.product.productSize }}</td>
          <td>{{ item.product.productStatus }}</td>
          <td>{{ item.franchiseWarehouseTotal }}</td>
          <td>{{ item.franchiseWarehouseCount }}</td>
          <td>{{ item.franchiseWarehouseEnable }}</td>
          <td>{{ item.product.categoryFirstName }} > {{ item.product.categorySecondName }} > {{ item.product.categoryThirdName }}</td>
          <td v-if="item.franchiseWarehouseFavorite">O</td>
          <td v-else>X</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watchEffect} from 'vue';
import axios from "axios";
import {useStore} from 'vuex';

const store = useStore();
const accessToken = store.state.accessToken;

const lists = ref([]);


const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;
const selectedExposureStatus = ref('전체');
const filterStatus = ref('');
const filterColor = ref('');
const filterSize = ref('');
const filterProductName = ref('');

const firstCategories = ref([]);
const secondCategories = ref([]);
const thirdCategories = ref([]);
const selectedFirstCategory = ref('');
const selectedSecondCategory = ref('');
const selectedThirdCategory = ref('');
const productImages = ref({});

const currentProductCode = ref('');
const currentProductName = ref('');
const currentProductCount = ref('');
const currentProductPrice = ref('');
const currentProductStatus = ref('');
const currentProductColor = ref('');
const currentProductSize = ref('');
const currentCategoryFirstName = ref('');
const currentCategorySecondName = ref('');
const currentCategoryThirdName = ref('');
const currentProductContent = ref('');

const detailPopup = ref(false);

const showDetailPopup = (productCode, productName, productCount, productPrice, productStatus, productColor, productSize,
                         categoryFirstName, categorySecondName, categoryThirdName, productContent) => {
  detailPopup.value = !detailPopup.value;
  setCurrentProductCode(productCode);
  setCurrentProductName(productName);
  setCurrentProductCount(productCount);
  setCurrentProductPrice(productPrice);
  setCurrentProductStatus(productStatus);
  setCurrentProductColor(productColor);
  setCurrentProductSize(productSize);
  setCurrentCategoryFirstName(categoryFirstName);
  setCurrentCategorySecondName(categorySecondName);
  setCurrentCategoryThirdName(categoryThirdName);
  setCurrentProductContent(productContent);
}
const closePopup = () => {
  detailPopup.value = !detailPopup.value;
}
const setCurrentProductCode = (productCode) => {
  currentProductCode.value = productCode;
};
const setCurrentProductName = (productName) => {
  currentProductName.value = productName;
}
const setCurrentProductCount = (productCount) => {
  currentProductCount.value = productCount;
}
const setCurrentProductPrice = (productPrice) => {
  currentProductPrice.value = productPrice;
}
const setCurrentProductStatus = (productStatus) => {
  currentProductStatus.value = productStatus;
}
const setCurrentProductColor = (productColor) => {
  currentProductColor.value = productColor;
}
const setCurrentProductSize = (productSize) => {
  currentProductSize.value = productSize;
}
const setCurrentProductContent = (productContent) => {
  currentProductContent.value = productContent;
}
const setCurrentCategoryFirstName = (categoryFirstName) => {
  currentCategoryFirstName.value = categoryFirstName;
}
const setCurrentCategorySecondName = (categorySecondName) => {
  currentCategorySecondName.value = categorySecondName;
}
const setCurrentCategoryThirdName = (categoryThirdName) => {
  currentCategoryThirdName.value = categoryThirdName;
}
const getProductImageUrl = (productCode) => {
  return productImages.value[productCode] || 'path/to/default-image.jpg';
};


const applyFilters = () => {
  filteredLists.value = lists.value.filter(list => {
    const matchesExposureStatus = selectedExposureStatus.value === '전체' || list.product.productExposureStatus === (selectedExposureStatus.value === '노출');
    const matchesProductName = !filterProductName.value || list.product.productName.includes(filterProductName.value);
    const matchesStatus = !filterStatus.value || list.product.productStatus === filterStatus.value;
    const matchesColor = !filterColor.value || list.product.productColor === filterColor.value;
    const matchesSize = !filterSize.value || list.product.productSize === parseInt(filterSize.value, 10);
    return matchesExposureStatus && matchesProductName && matchesStatus && matchesColor && matchesSize;
  });
};
const resetFilters = () => {
  selectedExposureStatus.value = '전체';
  filterProductName.value = '';
  filterStatus.value = '';
  filterColor.value = '';
  filterSize.value = '';
  selectedFirstCategory.value = '';
  selectedSecondCategory.value = '';
  selectedThirdCategory.value = '';
  filteredLists.value = lists.value;
};

const getMemberId = async () => {

  // FranchiseWarehouse 데이터 가져오기
  const franchiseWarehouseResponse = await fetch('http://api.pioms.shop/franchise/warehouse/list', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!franchiseWarehouseResponse.ok) {
    throw new Error('프랜차이즈 웨어하우스 정보를 가져오는 중 오류 발생');
  }
  const franchiseWarehouseData = await franchiseWarehouseResponse.json();
  // 각 제품에 대한 FranchiseWarehouse 정보를 추가하여 목록 완성
  lists.value = franchiseWarehouseData;
  filteredLists.value = lists.value;
  console.log(lists.value);
};

const downloadExcel = () => {
  axios({
    url: 'http://api.pioms.shop/franchise/exceldownload/product-excel', // 백엔드 엑셀 다운로드 API 엔드포인트
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
    link.setAttribute('download', 'productList.xlsx'); // 원하는 파일 이름 설정
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.error('Excel 다운로드 중 오류 발생:', error);
  });
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
