<template>
  <div class="container">

    <div class="header" align="center"  style="padding-bottom: 30px;">
      <div style="  max-width: 1440px;justify-content: center;align-items: center;"  >
        <br>
        <div style="float: left" ><img src="@/assets/icon/즐겨찾기.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">창고 조회 및 재고 관리 &gt; 즐겨찾기 관리 &gt; 즐겨찾기 상품 관리</span>
        </div>
      </div>
    </div>

    <div class="product-sub-title"> * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png">초기화 또는<img src="@/assets/icon/search.png">검색을 눌러주세요.
    </div>

    <!-- 상품 조회 결과 -->
    <div class="table-container">
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
        <tr class="tr__bd" v-for="(product, index) in favoriteProducts" :key="product.franchiseWarehouseCode">
          <td>{{ index + 1 }}</td>
          <td>{{ product.product.productName }}</td>
          <td>이미지</td>
          <td>{{ product.franchiseWarehouseTotal }}</td>
          <td>{{ product.franchiseWarehouseEnable }}</td>
          <td>{{ product.product.productStatus }}</td>
          <td>{{ product.product.productColor }}</td>
          <td>{{ product.product.productSize }}</td>
          <td>{{ product.product.categoryFirstName }}</td>
          <td>{{ product.product.categorySecondName }}</td>
          <td>{{ product.product.categoryThirdName }}</td>
          <td><button @click="removeFavorite(product.franchiseWarehouseCode)">삭제</button></td>
        </tr>
        </tbody>
      </table>

    </div>


    <div class="filter-buttons">
      <div class="post-btn" id="app">
        <button class="postBtn">
        </button>
        <button @click="navigateToAddProduct" class="add-product-btn">상품 추가</button>
      </div>
    </div>

    <!-- 액션 버튼 섹션 -->
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
    const response = await fetch('http://api.pioms.shop/franchise/warehouse/favorites/by-owner', {
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

const getStatusClass = (status) => {
  if (status === '공급가능') return 'status-available';
  if (status === '일시제한') return 'status-temporary';
  if (status === '단종') return 'status-discontinued';
  if (status === '품절') return 'status-soldout';
  return '';
};

fetchFavorites();
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

.add-product-btn {
  padding: 10px 20px;
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
}

.add-product-btn:hover {
  background-color: #ff3b2f;
}


</style>
