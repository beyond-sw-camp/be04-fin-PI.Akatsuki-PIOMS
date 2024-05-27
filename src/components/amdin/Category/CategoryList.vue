<template>
  <div class="category-top">
    <img src="@/assets/icon/Cloth.png" alt="" style="width: 40px; height: 40px">
    <span>
    상품 및 상품 카테고리 관리 > 상품 카테고리 관리 > 상품 카테고리 전체 조회
    </span>
  </div>
  <div class="category-select">
    <div class="categoryFirst-select">
      <ul>
        <li v-for="category in firstCategories" :key="category.categoryFirstCode">
          <div>
            <button class="category-button">
              <span class="category-text" @click="fetchSecondCategories(category.categoryFirstCode)">
                {{ category.categoryFirstName }}
              </span>
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div class="categorySecond-select">
      <ul>
        <li v-for="category in secondCategories" :key="category.categorySecondCode">
          <button class="category-button">
            <span class="category-text" @click="fetchThirdCategories(category.categorySecondCode)">
              {{ category.categorySecondName }}
            </span>
          </button>
        </li>
      </ul>
    </div>
    <div class="categoryThird-select">
      <ul>
        <li v-for="category in thirdCategories" :key="category.categoryThirdCode">
          <button class="category-button">
            <span class="category-text" @click="fetchThirdCategories(category.categoryThirdCode)">
              {{ category.categoryThirdName }}
            </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const firstCategories = ref([]);
const secondCategories = ref([]);
const thirdCategories = ref([]);
const selectedFirstCategory = ref('');
const selectedSecondCategory = ref('');
const selectedThirdCategory = ref('');
const filteredLists = ref([]);
const lists = ref([]);

const getCategoryFirstId = async () => {
  try {
    const response = await fetch('api/admin/category/first', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('네트워크 오류 발생');
    }

    const data = await response.json();
    if (data.length > 0) {
      lists.value = data.map(({categoryFirst, ...rest}) => rest);
      filteredLists.value = lists.value;
    } else {
      lists.value = [];
      filteredLists.value = [];
    }
  } catch (error) {
    console.error('오류 발생: ', error);
  }
};

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

const fetchSecondCategories = async (categoryFirstCode) => {
  if (!categoryFirstCode) {
    secondCategories.value = [];
    return;
  }
  selectedFirstCategory.value = categoryFirstCode;
  try {
    const response = await fetch(`/api/admin/category/second/list/detail/categoryfirst/${categoryFirstCode}`);
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

const fetchThirdCategories = async (categorySecondCode) => {
  if (!categorySecondCode) {
    thirdCategories.value = [];
    return;
  }
  selectedSecondCategory.value = categorySecondCode;
  try {
    const response = await fetch(`/api/admin/category/third/list/detail/categorysecond/${categorySecondCode}`);
    if (!response.ok) {
      throw new Error('소분류를 불러오는 데 실패했습니다.');
    }
    thirdCategories.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

getCategoryFirstId();
fetchFirstCategories();
fetchSecondCategories();
fetchThirdCategories();
</script>

<style scoped>
.category-top {
  display: inline-block;
  vertical-align: middle;
  line-height: 50px; /* 이미지 높이와 일치하게 설정 */
}
.category-top img {
  vertical-align: middle;
}
.category-top span {
  vertical-align: middle;
}
.category-button {
  background: none;
  border: none;
  padding: 0;
  cursor: default;
}

.category-text {
  cursor: pointer;
}
.filter-category select {
  margin-right: 10px;
}

.filter-categoryName input {
  margin-right: 10px;
}

.filter-table tr {
  width: 100%;
  table-layout: fixed;
}

.category-select {
  margin-top: 3%;
  width: 1350px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align items to the top */
  height: auto; /* Set height to auto */
  padding: 30px;
}

.categoryFirst-select, .categorySecond-select, .categoryThird-select {
  border: 1px solid black;
  width: 400px;
  min-height: 400px; /* Set a minimum height */
  padding: 10px;
  overflow-y: auto; /* Enable vertical scrolling */
  max-height: 400px; /* Set a maximum height */

}

.categoryFirst-select ul, .categorySecond-select ul, .categoryThird-select ul {
  list-style: none;
  padding: 0;
  margin: 0;

}

.categoryFirst-select li, .categorySecond-select li, .categoryThird-select li {
  margin-bottom: 10px;
}

.categoryFirst-select button, .categorySecond-select button, .categoryThird-select button {
  width: 100%;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  cursor: pointer;
  text-align: left;
}

.categoryFirst-select button:hover, .categorySecond-select button:hover, .categoryThird-select button:hover {
  background-color: #ddd;
}
</style>
<!--<table class="filter-table">-->
<!--<tr>-->
<!--  <td class="filter-label">카테고리 조회</td>-->
<!--  <td class="filter-input">-->
<!--    <div class="filter-category">-->
<!--      <select id="firstCategory" v-model="selectedFirstCategory" @change="fetchSecondCategories" class="categories">-->
<!--        <option value="">대분류</option>-->
<!--        <option v-for="category in firstCategories" :key="category.categoryFirstCode" :value="category.categoryFirstCode">-->
<!--          {{ category.categoryFirstName }}-->
<!--        </option>-->
<!--      </select>-->
<!--      <select class="categories" id="secondCategory" v-model="selectedSecondCategory" @change="fetchThirdCategories">-->
<!--        <option value="">중분류</option>-->
<!--        <option v-for="category in secondCategories" :key="category.categorySecondCode" :value="category.categorySecondCode">-->
<!--          {{ category.categorySecondName }}-->
<!--        </option>-->
<!--      </select>-->
<!--      <select class="categories" id="thirdCategory" v-model="selectedThirdCategory">-->
<!--        <option value="">소분류</option>-->
<!--        <option v-for="category in thirdCategories" :key="category.categoryThirdCode" :value="category.categoryThirdCode">-->
<!--          {{ category.categoryThirdName }}-->
<!--        </option>-->
<!--      </select>-->
<!--    </div>-->
<!--    <div class="filter-categoryName">-->
<!--      <input type="text" v-model="filterProductName" class="textInput" placeholder="카테고리명을 입력하세요."/>-->
<!--      <button @click="applyFilters">-->
<!--        <img src="@/assets/icon/search.png" alt="" style="width: 30px; height: 30px">-->
<!--      </button>-->
<!--    </div>-->
<!--  </td>-->
<!--</tr>-->
<!--</table>-->