<template>
  <div class="container">

    <div class="header" align="center" style="padding-bottom: 30px;">
      <div style="  max-width: 1440px;justify-content: center;align-items: center;">
        <br>
        <div style="float: left"><img src="@/assets/icon/가맹점.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">창고 조회 및 재고 관리 > 창고 조회 > 본사 창고 조회</span>
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
            <td class="filter-label">상품명</td>
            <td class="filter-input">
              <input type="text" v-model="filterProductName" @keyup.enter="applyFilters" class="textInput"
                     placeholder="상품명을 입력하세요."/>
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

          <tr>
            <td class="filter-label">카테고리 구분</td>
            <td class="filter-input" colspan="3">
              <select id="firstCategory" v-model="selectedFirstCategory" @change="fetchSecondCategories"
                      class="categories">
                <option value="">대분류</option>
                <option v-for="category in firstCategories" :key="category.categoryFirstCode"
                        :value="category.categoryFirstCode">
                  {{ category.categoryFirstName }}
                </option>
              </select>
              <select class="categories" id="secondCategory" v-model="selectedSecondCategory"
                      @change="fetchThirdCategories">
                <option value="">중분류</option>
                <option v-for="category in secondCategories" :key="category.categorySecondCode"
                        :value="category.categorySecondCode">
                  {{ category.categorySecondName }}
                </option>
              </select>
              <select class="categories" id="thirdCategory" v-model="selectedThirdCategory">
                <option value="">소분류</option>
                <option v-for="category in thirdCategories" :key="category.categoryThirdCode"
                        :value="category.categoryThirdCode">
                  {{ category.categoryThirdName }}
                </option>
              </select>
            </td>
          </tr>

        </table>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="resetFilters" class="reset-btn">
        <img src="@/assets/icon/reset.png" alt="Reset"/>
      </button>
      <button @click="applyFilters" class="search-btn">
        <img src="@/assets/icon/search.png" alt="Search"/>
      </button>
    </div>

    <div align="center">
      <div class="post-btn" id="app">
        <button @click="downloadExcel" class="excelBtn"><img src="@/assets/icon/excel.png" alt="excel"></button>
      </div>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th v-for="(header, index) in headers" :key="index">{{ header.label }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, rowIndex) in paginatedLists" :key="rowIndex" class="tr__bd"
            :id="'row-' + rowIndex">
          <td class="table-td">{{ rowIndex + 1 }}</td>
          <td v-for="(header, colIndex) in headers.slice(1)" :key="colIndex" class="table-td">
            <template v-if="header.key === 'imgUrl'">
              <img :src="getProductImageUrl(item.productCode)" class="product-img"/>
            </template>
            <template v-else-if="header.key === 'productStatus'">
              <div
                  :class="{'status-available': item.productStatus === '공급가능', 'status-unavailable': item.productStatus !== '공급가능'}">
                {{ item.productStatus }}
              </div>
            </template>
            <template v-else>
              {{ item[header.key] }}
            </template>
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
      <span> {{ currentPage }} / {{ totalPages }} </span>
      <button @click="nextPage" :disabled="currentPage ===totalPages">다음</button>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import axios from "axios";
import {useStore} from 'vuex';

const store = useStore();
const accessToken = store.state.accessToken;

const lists = ref([]);
const headers = ref([
  {key: 'index', label: '번호'},
  {key: 'productName', label: '상품명'},
  {key: 'imgUrl', label: '상품 이미지'},
  {key: 'franchiseWarehouseCount', label: '보유량'},
  {key: 'franchiseWarehouseEnable', label: '판매가능 재고량'},
  {key: 'productNoticeCount', label: '알림 기준 수량'},
  {key: 'productStatus', label: '상품 상태'},
  {key: 'productColor', label: '색상'},
  {key: 'productSize', label: '사이즈'},
  {key: 'categoryFirstName', label: '카테고리 대분류'},
  {key: 'categorySecondName', label: '카테고리 중분류'},
  {key: 'categoryThirdName', label: '카테고리 소분류'},
]);

const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;
const filterProductName = ref('');
const filterStatus = ref('');
const filterColor = ref('');
const filterSize = ref('');

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

const getProductImageUrl = (productCode) => {
  return productImages.value[productCode] || 'path/to/default-image.jpg';
};
const fetchProductImages = async () => {
  try {

    const response = await fetch(`http://api.pioms.shop/franchise/product/productImage`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('이미지를 불러오지 못했습니다.');
    }
    const productImagesData = await response.json();

    productImages.value = productImagesData.reduce((map, item) => {
      map[item.productCode] = item.imgUrl;
      return map;
    }, {});

    console.log(productImages);
  } catch (error) {
    console.error('Error:', error);
  }
};
const fetchFirstCategories = async () => {
  try {
    const response = await fetch('http://api.pioms.shop/franchise/category/first', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`http://api.pioms.shop/franchise/category/second/list/detail/categoryfirst/${selectedFirstCategory.value}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
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
    const response = await fetch(`http://api.pioms.shop/franchise/category/third/list/detail/categorysecond/${selectedSecondCategory.value}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
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
    const matchesProductName = !filterProductName.value || list.productName.includes(filterProductName.value);
    const matchesStatus = !filterStatus.value || list.productStatus === filterStatus.value;
    const matchesColor = !filterColor.value || list.productColor === filterColor.value;
    const matchesSize = !filterSize.value || list.productSize === parseInt(filterSize.value, 10);

    let matchesCategory = true;
    if (selectedFirstCategory.value) {
      matchesCategory = list.categoryFirstName === selectedFirstCategory.value;
      if (matchesCategory && selectedSecondCategory.value) {
        matchesCategory = list.categorySecondName === selectedSecondCategory.value;
        if (matchesCategory && selectedThirdCategory.value) {
          matchesCategory = list.categoryThirdName === selectedThirdCategory.value;
        }
      }
    }

    return matchesProductName && matchesStatus && matchesColor && matchesSize && matchesCategory;
  });
};
const resetFilters = () => {
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
  try {
    const productResponse = await fetch('http://api.pioms.shop/franchise/product', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!productResponse.ok) {
      throw new Error('네트워크 오류 발생');
    }

    const productData = await productResponse.json();

    const franchiseWarehouseResponse = await fetch('http://api.pioms.shop/franchise/warehouse', {
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

    lists.value = productData.map(product => {
      const correspondingWarehouse = franchiseWarehouseData.find(warehouse =>
          warehouse.product.productCode === product.productCode);
      return {
        productCode: product.productCode,
        productName: product.productName,
        imgUrl: product.imgUrl,
        franchiseWarehouseCount: correspondingWarehouse ? correspondingWarehouse.franchiseWarehouseCount : 0,
        franchiseWarehouseEnable: correspondingWarehouse ? correspondingWarehouse.franchiseWarehouseEnable : 0,
        productNoticeCount: product.productNoticeCount,
        productStatus: product.productStatus,
        productColor: product.productColor,
        productSize: product.productSize,
        categoryFirstName: product.categoryFirstName,
        categorySecondName: product.categorySecondName,
        categoryThirdName: product.categoryThirdName,
      };
    });

    filteredLists.value = lists.value;
  } catch (error) {
    console.error('오류 발생:', error);
  }
};
const downloadExcel = () => {
  axios({
    url: 'http://api.pioms.shop/franchise/exceldownload/product-excel',
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
    link.setAttribute('download', 'productList.xlsx');
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
fetchProductImages();
fetchFirstCategories();
fetchSecondCategories();
fetchThirdCategories();
</script>
<style scoped>

.product-img {
  width: 30px;
  height: 30px;
  transition: transform 0.5s ease;
}

.product-img:hover {
  transform: scale(3.3);
}

.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.filter-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  min-width: 1440px;
}

.filter-table td {
  padding: 5px 10px;
}

.filter-label {
  font-weight: bold;
  text-align: center;
  border: solid 1px #747474;
  width: 120px;
  background-color: #D9D9D9;
}

.filter-input {
  text-align: left;
  border: solid 1px #747474;
  padding: 5px;
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
  background-color: #D9D9D9;
  font-weight: bold;
  height: 50px;
  font-size: 14px;
  text-align: center;
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


.button-as-text {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-align: left;
}

.textInput {
  border: 1px solid rgba(217, 217, 217, 0.7);
}

.categories {
  border: 1px solid rgba(217, 217, 217, 0.7);
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

.status-available {
  align-content: center;
  background-color: #FFCD4B;
  border-radius: 8px;
  color: #FFFFFF;
  font-weight: bold;
  height: 25px;
  font-size: 14px;
}

.status-unavailable {
  align-content: center;
  background-color: #FF6285;
  border-radius: 8px;
  color: #FFFFFF;
  font-weight: bold;
  height: 25px;
  font-size: 14px;
}

.header {
  width: 100%;
  max-width: 1440px;
  text-align: center;
  padding-bottom: 30px;
}

.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.post-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 1440px;
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

.breadcrumb {
  font-size: 16px;
  color: #555;
  font-weight: bold;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 1440px;
}
</style>
