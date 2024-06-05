<template>
  <div class="container">
    <!-- 상단 네비게이션 -->
    <div class="navigation">
      <span>상품 및 재고 관리 &gt; 상품 관리 &gt; 즐겨찾기 상품 관리</span>
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
        <tr v-for="(product, index) in favoriteProducts" :key="product.franchiseWarehouseCode">
          <td>{{ index + 1 }}</td>
          <td>{{ product.product.productName }}</td>
          <td>이미지</td>
          <td>{{ product.franchiseWarehouseTotal }}</td>
          <td>{{ product.franchiseWarehouseEnable }}</td>
          <td :class="{'status-temporary': product.product.productStatus === '일시제한', 'status-available': product.product.productStatus === '공급가능'}">
            {{ product.product.productStatus }}
          </td>
          <td>{{ product.product.productColor }}</td>
          <td>{{ product.product.productSize }}</td>
          <td>{{ product.product.categoryThird.categorySecond.categoryFirst.categoryFirstName }}</td>
          <td>{{ product.product.categoryThird.categorySecond.categorySecondName }}</td>
          <td>{{ product.product.categoryThird.categoryThirdName }}</td>
          <td><button @click="removeFavorite(product.franchiseWarehouseCode)">삭제</button></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 액션 버튼 섹션 -->
    <div class="action-buttons">
      <button @click="navigateToAddProduct" class="add-product-btn">상품 추가</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const accessToken = store.state.accessToken;
const favoriteProducts = ref([]);

// Fetch favorite products
const fetchFavorites = async () => {
  try {
    const response = await fetch('http://api.pioms.shop/franchise/warehouse/favorites', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      favoriteProducts.value = data;
    } else {
      throw new Error('즐겨찾기 상품을 불러오는 데 실패했습니다.');
    }
  } catch (error) {
    console.error('Failed to fetch favorite products:', error);
  }
};

const removeFavorite = async (productId) => {
  try {
    const response = await fetch(`http://api.pioms.shop/franchise/warehouse/removeFavorite/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      favoriteProducts.value = favoriteProducts.value.filter((product) => product.franchiseWarehouseCode !== productId);
    } else {
      throw new Error('즐겨찾기 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('Failed to remove favorite:', error);
  }
};

const navigateToAddProduct = () => {
  window.location.href = 'http://pioms.shop/franchise/favorite/register';
};

fetchFavorites();
</script>

<style scoped>
.container {
  padding: 20px;
}

.navigation {
  margin-bottom: 20px;
  font-weight: bold;
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

.status-temporary {
  color: red;
}

.status-available {
  color: blue;
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

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.add-product-btn {
  padding: 10px 20px;
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-product-btn:hover {
  background-color: #ff3b2f;
}
</style>
