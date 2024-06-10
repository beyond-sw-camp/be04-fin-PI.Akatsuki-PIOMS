<template>

  <div class="header">
    <img src="@/assets/icon/Cloth.png" style="width: 18px"/>&nbsp;
    <span class="breadcrumb">상품 및 상품 카테고리 관리 > 상품 관리 > 상품 전체 조회 및 관리</span>
  </div>
<!--  <div class="headerTitle" align="left" style="margin-left: 17%; margin-top: 1%">-->
<!--    <p class="product-title"><img src="@/assets/icon/Cloth.png" style="width: 20px;height: 20px">상품 및 상품 카테고리 관리 > 상품 카테고리 관리 > 상품 카테고리 전체 조회 및 수정/삭제</p>-->
<!--  </div>-->
  <div class="category-container">
    <div class="category-select">
      <div class="category-section">
        <div class="select-title"><p>1차 카테고리(대분류)</p></div>
        <ul>
          <li v-for="category in firstCategories" :key="category.categoryFirstCode" class="category-item">
            <div class="category-content">
              <button @click="fetchSecondCategories(category.categoryFirstCode)">
                {{ category.categoryFirstName }}
              </button>
              <div class="category-actions">
                <button @click="editCategoryFirst(category.categoryFirstCode,category.categoryFirstName)" class="action-button">수정</button>
                <button @click="deleteCategoryFirst(category.categoryFirstCode, category.categoryFirstName)" class="action-button1">삭제</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="category-section">
        <div class="select-title">
          <p>2차 카테고리(중분류)</p>
        </div>
        <ul>
          <li v-for="category in secondCategories" :key="category.categorySecondCode" class="category-item">
            <div class="category-content">
              <button @click="fetchThirdCategories(category.categorySecondCode)">
                {{ category.categorySecondName }}
              </button>
              <div class="category-actions">
                <button @click="editCategorySecond(category.categorySecondCode, category.categorySecondName)" class="action-button">수정</button>
                <button @click="deleteCategorySecond(category.categorySecondCode, category.categorySecondName)" class="action-button1">삭제</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="category-section">
        <div class="select-title">
          <p>3차 카테고리(소분류)</p>
        </div>
        <ul>
          <li v-for="category in thirdCategories" :key="category.categoryThirdCode" class="category-item">
            <div class="category-content">
              <button>
                {{ category.categoryThirdName }}
              </button>
              <div class="category-actions">
                <button @click="editCategoryThird(category.categoryThirdCode, category.categoryThirdName)" class="action-button">수정</button>
                <button @click="deleteCategoryThird(category.categoryThirdCode, category.categoryThirdName)" class="action-button1">삭제</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
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
import CategoryFirstPopup from "@/components/admin/Category/CategoryFirstPopup.vue";
import CategorySecondPopup from "@/components/admin/Category/CategorySecondPopup.vue";
import CategoryThirdPopup from "@/components/admin/Category/CategoryThirdPopup.vue";
import DeleteFirstPopup from "@/components/admin/Category/DeleteFirstPopup.vue";
import DeleteSecondPopup from "@/components/admin/Category/DeleteSecondPopup.vue";
import DeleteThirdPopup from "@/components/admin/Category/DeleteThirdPopup.vue";
import { useStore } from 'vuex';
const store = useStore();
const accessToken = store.state.accessToken;

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
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
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
const fetchSecondCategories = async (categoryFirstCode) => {
  if (!categoryFirstCode) {
    secondCategories.value = [];
    return;
  }
  selectedFirstCategory.value = categoryFirstCode;
  try {
    const response = await fetch(`http://localhost:5000/admin/category/second/list/detail/categoryfirst/${categoryFirstCode}`,{
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
const fetchThirdCategories = async (categorySecondCode) => {
  if (!categorySecondCode) {
    thirdCategories.value = [];
    return;
  }
  selectedSecondCategory.value = categorySecondCode;
  try {
    const response = await fetch(`http://localhost:5000/admin/category/third/list/detail/categorysecond/${categorySecondCode}`, {
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
.product-sub-title img {
  width: 20px;
  height: 20px;
}
.headerTitle p {
  font-weight: bold;
  font-size: 20px;
}
.headerTitle img {
  width: 10px;
  height: 10px;
}
.headerTitle h6 {
  margin-bottom: 5%;
}
.headerTitle h3,
.headerTitle h6 {
  margin: 0
}
.category-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-select {
  display: flex;
  justify-content: space-around;
  width: 100%;
  gap: 20px;
}

.category-section {
  flex: 1;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 400px;
  overflow-y: auto;
}

.select-title {
  background-color: #d9d9d9;
  color: #ffffff;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.select-title p {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
}

.category-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.category-content button {
  flex-grow: 1;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}

.category-content button:hover {
  background-color: #e0e0e0;
}

.category-actions {
  display: flex;
  gap: 8px;
  margin-left: 3%;
}

.action-button {
  color: #000000;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.action-button1 {
  color: #FFFFFF;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button1:hover {
  background-color: #FF6285;
}

.action-button1:last-child {
  background-color: #FF6285;
}

.action-button1:last-child:hover {
  background-color: #FF6285;
}
.header {
  margin-bottom: 30px;
  margin-left: 215px;
  margin-top: 20px;
}
</style>



