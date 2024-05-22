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
          <th>상품코드</th>
          <th>상품명</th>
          <th>상품 상태</th>
          <th>상품 노출 상태</th>
          <th>본사 보유량</th>
          <th>본사 폐기량</th>
          <th>알림 기준 수량</th>
          <th>색상</th>
          <th>사이즈</th>
          <th>카테고리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(product) in filteredProducts" :key="product.productCode" class="allpost">
          <td>{{ product.productCode }}</td>
          <td class="boardname">{{ product.productName }}</td>
          <td>{{ product.productStatus }}</td>
          <td>{{ product.productExposureStatus ? '노출' : '미노출' }}</td>
          <td>{{ product.productTotalCount }}</td>
          <td>{{ product.productDisCount }}</td>
          <td>{{ product.productNoticeCount }}</td>
          <td>{{ product.productColor }}</td>
          <td>{{ product.productSize }}</td>
          <td>{{ product.categoryThird.name }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const products = ref([]);
const filteredProducts = ref([]);
const filterProductName = ref('');
const filterStatus = ref('전체');
const filterColor = ref('');
const filterSize = ref('');
const selectedExposureStatus = ref('');
const firstCategories = ref([
  { code: 1, name: '여성의류' },
  { code: 2, name: '남성의류' },
  { code: 3, name: '신발' },
  { code: 4, name: '가방' },
  { code: 5, name: '이너웨어' },
  { code: 6, name: '악세서리' },
]);
const secondCategories = ref([]);
const thirdCategories = ref([]);
const selectedFirstCategory = ref('');
const selectedSecondCategory = ref('');
const selectedThirdCategory = ref('');

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:9000/admin/product');
    console.log('API Response:', response.data); // 추가된 로그
    products.value = response.data.products || response.data.productDTO || [];
    filteredProducts.value = products.value;
    console.log('Products:', products.value); // 추가된 로그
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

const applyFilters = () => {
  console.log('Applying filters...'); // 필터링 시작 로그
  filteredProducts.value = products.value.filter(product => {
    const matchesProductName = !filterProductName.value || product.productName.includes(filterProductName.value);
    const matchesStatus = filterStatus.value === '전체' || product.productStatus === filterStatus.value;
    const matchesExposureStatus = !selectedExposureStatus.value || product.productExposureStatus.toString() === selectedExposureStatus.value;
    const matchesColor = !filterColor.value || product.productColor === filterColor.value;
    const matchesSize = !filterSize.value || product.productSize === filterSize.value;
    const matchesFirstCategory = !selectedFirstCategory.value || product.categoryThird.categorySecond.categoryFirst.name === selectedFirstCategory.value;
    const matchesSecondCategory = !selectedSecondCategory.value || product.categoryThird.categorySecond.name === selectedSecondCategory.value;
    const matchesThirdCategory = !selectedThirdCategory.value || product.categoryThird.name === selectedThirdCategory.value;

    console.log(`Product: ${product.productName}`, {
      matchesProductName,
      matchesStatus,
      matchesExposureStatus,
      matchesColor,
      matchesSize,
      matchesFirstCategory,
      matchesSecondCategory,
      matchesThirdCategory
    }); // 각 조건에 맞는지 확인하는 로그

    return matchesProductName && matchesStatus && matchesExposureStatus && matchesColor && matchesSize && matchesFirstCategory && matchesSecondCategory && matchesThirdCategory;
  });
  console.log('Filtered Products:', filteredProducts.value); // 필터 적용 후 결과 로그
};

const resetFilters = () => {
  filterProductName.value = '';
  filterStatus.value = '전체';
  filterColor.value = '';
  filterSize.value = '';
  selectedExposureStatus.value = '';
  selectedFirstCategory.value = '';
  selectedSecondCategory.value = '';
  selectedThirdCategory.value = '';
  filteredProducts.value = products.value;
};

const fetchSecondCategories = async () => {
  if (!selectedFirstCategory.value) {
    secondCategories.value = [];
    thirdCategories.value = [];
    return;
  }
  try {
    const response = await axios.get(`/api/admin/category/second?categoryFirstCode=${selectedFirstCategory.value}`);
    secondCategories.value = response.data;
    thirdCategories.value = [];
    selectedSecondCategory.value = '';
  } catch (error) {
    console.error('중분류를 불러오는 데 실패했습니다.', error);
  }
};

const fetchThirdCategories = async () => {
  if (!selectedSecondCategory.value) {
    thirdCategories.value = [];
    return;
  }
  try {
    const response = await axios.get(`/api/admin/category/third?categorySecondCode=${selectedSecondCategory.value}`);
    thirdCategories.value = response.data;
    selectedThirdCategory.value = '';
  } catch (error) {
    console.error('소분류를 불러오는 데 실패했습니다.', error);
  }
};

const editProduct = (productCode) => {
  console.log('Edit product with code:', productCode);
  // 이곳에 상품 수정 로직을 추가할 수 있습니다.
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
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
  border-collapse: separate;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-spacing: 0 10px;
}

.table th {
  font-weight: bold;
  color: #000;
}

.boardname {
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.header1 {
  background-color: #D9D9D9;
  font-weight: bold;
  height: 50px;
  font-size: 12px;
  text-align: center;
}

.header1 .num {
  width: 5%;
}

.allpost {
  text-align: center;
  padding: 10px 0;
}

.allpost .num {
  width: 5%;
}

.allpost td {
  border-right: 1px solid #ddd;
}

.editbutton {
  background-color: #ffcc00;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
}

.editbutton:hover {
  background-color: #ffbb00;
}
</style>
