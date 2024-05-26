<template>
  <div class="category-top">
    <img src="@/assets/icon/public/Cloth.png" alt=""> 상품 및 상품 카테고리 관리 > 상품 카테고리 관리 > 상품 카테고리 전체 조회
  </div>
    <table class="filter-table">
      <tr>
        <td class="filter-label">카테고리 조회</td>
        <td class="filter-input">
        <div class="filter-category">
          <select id="firstCategory" v-model="selectedFirstCategory" @change="fetchSecondCategories" class="categories">
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
          </div>
          <div class="filter-categoryName">
          <input type="text" v-model="filterProductName" class="textInput" placeholder="카테고리명을 입력하세요."/>
          <img src="@/assets/icon/search.png" alt="" style="width: 30px; height: 30px">
          </div>
        </td>
      </tr>
    </table>
  <div class="category-select">
    <div class="categoryFirst-select">

    </div>
    <div class="categorySecond-select">

    </div>
    <div class="categoryThird-select">

    </div>
  </div>
</template>

<script setup>

import {ref} from "vue";

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

fetchFirstCategories();
fetchSecondCategories();
fetchThirdCategories();
</script>

<style scoped>
.filter-label {
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  width: 100px;
  background-color: #D9D9D9;
  border: 1px solid #ddd;
}
.filter-input {
  text-align: center;
  border: 1px solid lightgray;
  border-right: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* 필요 시 width 추가 */
}
.filter-category,
.filter-categoryName {
  display: flex;
  align-items: center;
}

.filter-category select {
  margin-right: 10px;
}

.filter-categoryName input {
  margin-right: 10px;
}
.categories {
  border: 1px solid rgba(217, 217, 217, 0.7);
  margin-left: 2%;
}
.filter-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 1550px;
}
.filter-table tr {
  width: 100%;
  table-layout: fixed;
}
.category-select {
  border: 1px solid black;
  margin-top: 3%;
  width: 1500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 450px;
  padding: 30px;
}
.categoryFirst-select {
  border: 1px solid black;
  width: 450px;
  height: 400px;
}
.categorySecond-select {
  border: 1px solid black;
  width: 450px;
  height: 400px
}
.categoryThird-select {
  border: 1px solid black;
  width: 450px;
  height: 400px
}
</style>