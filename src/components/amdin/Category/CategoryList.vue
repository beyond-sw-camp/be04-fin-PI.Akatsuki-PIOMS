<template>
  <div class="category-top">
    <img src="@/assets/icon/Cloth.png" alt="" style="width: 40px; height: 40px">
    <span>
    상품 및 상품 카테고리 관리 > 상품 카테고리 관리 > 상품 카테고리 전체 조회
    </span>
  </div>
  <div class="category-select">
    <div class="categoryFirst-select">
      <div class="select-title"><p>1차 카테고리(대분류)</p></div>
      <ul>
        <li v-for="category in firstCategories" :key="category.categoryFirstCode" class="category-item">
          <div class="category-content">
            <button style="width: 200px">
              <span @click="fetchSecondCategories(category.categoryFirstCode)">
                {{ category.categoryFirstName }}
              </span>
            </button>
            <div class="category-actions">
              <button @click="editCategoryFirst(category.categoryFirstCode,category.categoryFirstName)" class="MD-btn">수정</button>
              <button @click="deleteCategoryFirst(category.categoryFirstCode, category.categoryFirstName)" class="MD-btn">삭제</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="categorySecond-select">
      <div class="select-title"><p>2차 카테고리(중분류)</p></div>
      <ul>
        <li v-for="category in secondCategories" :key="category.categorySecondCode" class="category-item">
          <div class="category-content">
            <button style="width: 200px">
              <span @click="fetchThirdCategories(category.categorySecondCode)">
                {{ category.categorySecondName }}
              </span>
            </button>
            <div class="category-actions">
              <button @click="editCategorySecond(category.categorySecondCode, category.categorySecondName)" class="MD-btn">수정</button>
              <button @click="deleteCategorySecond(category.categorySecondCode, category.categorySecondName)" class="MD-btn">삭제</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="categoryThird-select">
      <div class="select-title"><p>3차 카테고리(소분류)</p></div>
      <ul>
        <li v-for="category in thirdCategories" :key="category.categoryThirdCode" class="category-item">
          <div class="category-content">
            <button style="width: 200px">
              <span>
                {{ category.categoryThirdName }}
              </span>
            </button>
            <div class="category-actions">
              <button @click="editCategoryThird(category.categoryThirdCode, category.categoryThirdName)" class="MD-btn">수정</button>
              <button @click="deleteCategoryThird(category.categoryThirdCode, category.categoryThirdName)" class="MD-btn">삭제</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <CategoryFirstPopup v-if="editCategoryFirstVisible" :currentFirstCode="currentFirstCode" :currentFirstName="currentFirstName" @close="editCategoryFirstVisible = false"/>
    <CategorySecondPopup v-if="editCategorySecondVisible" :currentSecondCode="currentSecondCode" :currentSecondName="currentSecondName" @close="editCategorySecondVisible = false"/>
    <CategoryThirdPopup v-if="editCategoryThirdVisible" :currentThirdCode="currentThirdCode" :currentThirdName="currentThirdName" @close="editCategoryThirdVisible = false"/>
    <DeleteFirstPopup v-if="deleteCategoryFirstVisible" :currentFirstCode="currentFirstCode" :currentFirstName="currentFirstName" @close="deleteCategoryFirstVisible = false"/>
    <DeleteSecondPopup v-if="deleteCategorySecondVisible" :currentSecondCode="currentSecondCode" :currentSecondName="currentSecondName" @close="deleteCategorySecondVisible = false"/>
    <DeleteThirdPopup v-if="deleteCategoryThirdVisible" :currentThirdCode="currentThirdCode" :currentThirdName="currentThirdName" @close="deleteCategoryThirdVisible = false"/>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import CategoryFirstPopup from "@/components/amdin/Category/CategoryFirstPopup.vue";
import CategorySecondPopup from "@/components/amdin/Category/CategorySecondPopup.vue";
import CategoryThirdPopup from "@/components/amdin/Category/CategoryThirdPopup.vue";
import DeleteFirstPopup from "@/components/amdin/Category/DeleteFirstPopup.vue";
import DeleteSecondPopup from "@/components/amdin/Category/DeleteSecondPopup.vue";
import DeleteThirdPopup from "@/components/amdin/Category/DeleteThirdPopup.vue";

const firstCategories = ref([]);
const secondCategories = ref([]);
const thirdCategories = ref([]);
const selectedFirstCategory = ref('');
const selectedSecondCategory = ref('');
const filteredLists = ref([]);
const lists = ref([]);
const editCategoryFirstVisible = ref(false);
const editCategorySecondVisible = ref(false);
const editCategoryThirdVisible = ref(false);
const deleteCategoryFirstVisible = ref(false);
const deleteCategorySecondVisible = ref(false);
const deleteCategoryThirdVisible = ref(false);
const currentFirstCode = ref('');
const currentSecondCode = ref('');
const currentThirdCode = ref('');
const currentFirstName = ref('');
const currentSecondName = ref('');
const currentThirdName = ref('');

const getCategoryFirstId = async () => {
  try {
    const response = await fetch('http://localhost:5000/admin/category/first', {
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
    const response = await fetch('http://localhost:5000/admin/category/first', {
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
    const response = await fetch(`http://localhost:5000/admin/category/second/list/detail/categoryfirst/${categoryFirstCode}`);
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
    const response = await fetch(`http://localhost:5000/admin/category/third/list/detail/categorysecond/${categorySecondCode}`);
    if (!response.ok) {
      throw new Error('소분류를 불러오는 데 실패했습니다.');
    }
    thirdCategories.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

const setCurrentFirstCode = (categoryFirstCode) => {
  currentFirstCode.value = categoryFirstCode;
}
const setCurrentFirstName = (categoryFirstName) => {
  currentFirstName.value = categoryFirstName;
}
const setCurrentSecondCode = (categorySecondCode) => {
  currentSecondCode.value = categorySecondCode;
}
const setCurrentSecondName = (categorySecondName) => {
  currentSecondName.value = categorySecondName;
}
const setCurrentThirdCode = (categoryThirdCode) => {
  currentThirdCode.value = categoryThirdCode;
}
const setCurrentThirdName = (categoryThirdName) => {
  currentThirdName.value = categoryThirdName;
}
const editCategoryFirst = (categoryFirstCode, categoryFirstName) => {
  setCurrentFirstCode(categoryFirstCode);
  setCurrentFirstName(categoryFirstName);
  editCategoryFirstVisible.value = true;
};
const editCategorySecond = (categorySecondCode, categorySecondName) => {
  setCurrentSecondCode(categorySecondCode);
  setCurrentSecondName(categorySecondName);
  editCategorySecondVisible.value = true;
};

const editCategoryThird = (categoryThirdCode, categoryThirdName) => {
  setCurrentThirdCode(categoryThirdCode);
  setCurrentThirdName(categoryThirdName);
  editCategoryThirdVisible.value = true;
}

const deleteCategoryFirst = (categoryFirstCode, categoryFirstName) => {
  setCurrentFirstCode(categoryFirstCode);
  setCurrentFirstName(categoryFirstName);
  deleteCategoryFirstVisible.value = true;
};


const deleteCategorySecond = (categorySecondCode, categorySecondName) => {
  setCurrentSecondCode(categorySecondCode);
  setCurrentSecondName(categorySecondName);
  deleteCategorySecondVisible.value = true;
};

const deleteCategoryThird = (categoryThirdCode, categoryThirdName) => {
  setCurrentThirdCode(categoryThirdCode);
  setCurrentThirdName(categoryThirdName)
  deleteCategoryThirdVisible.value = true;
};

getCategoryFirstId();
fetchFirstCategories();
fetchSecondCategories();
fetchThirdCategories();
</script>

<style scoped>
.category-top {
  margin-left: 8%;
}
.category-top img {
  vertical-align: middle;
}
.category-top span {
  vertical-align: middle;
}

.filter-category select {
  margin-right: 10px;
}
.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.category-content {
  display: flex;

  flex-grow: 1;
}
.category-content button {
  width: 50px;
  border-radius: 5px;
}
.category-actions {
  display: flex;
  gap: 8px;
}

.filter-categoryName input {
  margin-right: 10px;
}

.filter-table tr {
  width: 100%;
  table-layout: fixed;
}
.select-title {
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: #888888;
  border-radius: 10px;
  height: 50px;
}
.category-select {
  width: 1450px;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items to the top */
  height: auto; /* Set height to auto */
  padding: 30px;
}

.categoryFirst-select, .categorySecond-select, .categoryThird-select {
  width: 370px;
  min-height: 400px; /* Set a minimum height */
  padding: 10px;
  overflow-y: auto; /* Enable vertical scrolling */
  max-height: 400px; /* Set a maximum height */
  margin-left: 5%;
  border: none;
  border-radius: 15px;
  background-color: #d9d9d9;
}

.categoryFirst-select ul, .categorySecond-select ul, .categoryThird-select ul {
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 5px;
}

.categoryFirst-select li, .categorySecond-select li, .categoryThird-select li {
  margin-bottom: 10px;
}

.categoryFirst-select button, .categorySecond-select button, .categoryThird-select button {
  width: 100%;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  cursor: pointer;
  text-align: left;
}

.categoryFirst-select button:hover, .categorySecond-select button:hover, .categoryThird-select button:hover {
  background-color: #f0f0f0;
}
</style>