<template>
  <div class="container">
    <!-- 상단 네비게이션 -->
    <div class="navigation">
      <span>상품 및 재고 관리 &gt; 상품 관리 &gt; 전체 상품 관리</span>
    </div>

    <!-- 필터 섹션 -->
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">상품명</td>
          <td class="filter-input">
            <input type="text" v-model="filterProductName" placeholder="상품명을 입력하세요." @input="applyFilters" />
          </td>
        </tr>
      </table>
    </div>

    <!-- 상품 조회 결과 -->
    <div class="table-container">
      <h3>상품 조회</h3>
      <table class="table">
        <thead>
        <tr class="header1">
          <th>No</th>
          <th>상품명</th>
          <th>상품이미지</th>
          <th>보유량</th>
          <th>판매가능 재고량</th>
          <th>상품상태</th>
          <th>색상</th>
          <th>사이즈</th>
          <th>카테고리1</th>
          <th>카테고리2</th>
          <th>카테고리3</th>
          <th>즐겨찾기</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in filteredProducts" :key="item.franchiseWarehouseCode">
          <td>{{ index + 1 }}</td>
          <td>{{ item.product.productName }}</td>
          <td>이미지</td>
          <td>{{ item.franchiseWarehouseTotal }}</td>
          <td>{{ item.franchiseWarehouseEnable }}</td>
          <td>{{ item.product.productStatus }}</td>
          <td>{{ item.product.productColor }}</td>
          <td>{{ item.product.productSize }}</td>
          <td>{{ item.product.categoryFirstName}}</td>
          <td>{{ item.product.categorySecondName }}</td>
          <td>{{ item.product.categoryThirdName}}</td>
          <td>
            <input type="checkbox" @change="toggleProductSelection(item)" :checked="isSelected(item.franchiseWarehouseCode)" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 선택된 상품 목록 -->
    <div class="table-container">
      <h3>즐겨찾기 추가 상품 목록</h3>
      <table class="table">
        <thead>
        <tr class="header1">
          <th>No</th>
          <th>상품명</th>
          <th>상품이미지</th>
          <th>보유량</th>
          <th>판매가능 재고량</th>
          <th>상품상태</th>
          <th>색상</th>
          <th>사이즈</th>
          <th>카테고리1</th>
          <th>카테고리2</th>
          <th>카테고리3</th>
          <th>제거</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in selectedProducts" :key="item.franchiseWarehouseCode">
          <td>{{ index + 1 }}</td>
          <td>{{ item.product.productName }}</td>
          <td>이미지</td>
          <td>{{ item.franchiseWarehouseTotal }}</td>
          <td>{{ item.franchiseWarehouseEnable }}</td>
          <td>{{ item.product.productStatus }}</td>
          <td>{{ item.product.productColor }}</td>
          <td>{{ item.product.productSize }}</td>
          <td>{{ item.product.categoryFirstName}}</td>
          <td>{{ item.product.categorySecondName }}</td>
          <td>{{ item.product.categoryThirdName}}</td>
          <td><button @click="removeProductFromList(item.franchiseWarehouseCode)">삭제</button></td>
        </tr>
        </tbody>
      </table>
      <div class="save-btn-container">
        <button @click="saveFavorites" class="save-btn">저장하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const filterProductName = ref('');
const filteredProducts = ref([]);
const selectedProducts = ref([]);
const products = ref([]);

// Fetch products from the server
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:5000/warehouse', {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    products.value = data;
    applyFilters();
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

// Apply filters to the product list
const applyFilters = () => {
  filteredProducts.value = products.value.filter((item) => {
    return item.product.productName.includes(filterProductName.value);
  });
};

// Check if product is selected
const isSelected = (warehouseCode) => {
  return selectedProducts.value.some((item) => item.franchiseWarehouseCode === warehouseCode);
};

// Toggle product selection
const toggleProductSelection = (item) => {
  const index = selectedProducts.value.findIndex(p => p.franchiseWarehouseCode === item.franchiseWarehouseCode);
  if (index === -1) {
    selectedProducts.value.push(item);
  } else {
    selectedProducts.value.splice(index, 1);
  }
};

// Remove product from the selected list
const removeProductFromList = (warehouseCode) => {
  selectedProducts.value = selectedProducts.value.filter(item => item.franchiseWarehouseCode !== warehouseCode);
};

const saveFavorites = async () => {
  let alreadyFavoriteProducts = [];
  let successfullyAddedProducts = [];

  const promises = selectedProducts.value.map(async (item) => {
    try {
      const response = await fetch(`http://localhost:5000/warehouse/toggleFavorite/${item.franchiseWarehouseCode}`, {

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText === "이미 즐겨찾기 추가된 상품입니다") {
          alreadyFavoriteProducts.push(item.product.productName);
        } else {
          throw new Error(`Failed to toggle favorite for warehouse code ${item.franchiseWarehouseCode}`);
        }
      } else {
        successfullyAddedProducts.push(item.product.productName);
        // Remove the item from the selected list after successful save
        removeProductFromList(item.franchiseWarehouseCode);
      }
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  });

  await Promise.all(promises);

  let message = '';
  if (successfullyAddedProducts.length > 0) {
    message += '저장이 완료되었습니다: ' + successfullyAddedProducts.join(', ') + '\n';
  }
  if (alreadyFavoriteProducts.length > 0) {
    message += '이미 즐겨찾기에 추가된 상품입니다: ' + alreadyFavoriteProducts.join(', ');
  }
  alert(message);
};





// Mock functions to get category names
const getCategoryFirstName = (categoryThirdCode) => {
  return '카테고리1'; // Replace with actual logic
};

const getCategorySecondName = (categoryThirdCode) => {
  return '카테고리2'; // Replace with actual logic
};

const getCategoryThirdName = (categoryThirdCode) => {
  return '카테고리3'; // Replace with actual logic
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.container {
  padding: 20px;
}

.navigation {
  margin-bottom: 20px;
  font-weight: bold;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-table {
  width: 100%;
  margin-bottom: 20px;
}

.filter-label {
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.filter-input input {
  width: 200px;
}

.table-container {
  margin-bottom: 40px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.header1 {
  background-color: #f0f0f0;
}

.save-btn-container {
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  padding: 10px 20px;
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.save-btn:hover {
  background-color: #ff3b2f;
}
</style>
