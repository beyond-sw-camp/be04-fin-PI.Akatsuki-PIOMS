<template>
  <div class="headerTitle" align="left" style="margin-left: 17%; margin-top: 1%">
    <p class="product-title"><img src="@/assets/icon/Cloth.png" style="width: 20px;height: 20px">상품 및 상품 카테고리 관리 > 상품 카테고리 관리 > 상품 카테고리 등록</p>
  </div>
  <div class="category-container">
    <div class="category-select">
      <div class="category-column">
        <div class="post-category"><p>1차 카테고리(대분류)</p></div>
        <div class="input-container">
          <input type="text" class="postInput" v-model="insertCategoryFirstName" placeholder="대분류 카테고리명을 입력해주세요.">
          <button @click="saveCategoryFirst" class="categoryPost">등록</button>
        </div>
        <div class="category-section">
          <ul>
            <li v-for="category in firstCategories" :key="category.categoryFirstCode">
              <button @click="fetchSecondCategories(category.categoryFirstCode)">{{ category.categoryFirstName }}</button>
            </li>
          </ul>
        </div>
      </div>
      <div class="category-column">
        <div class="post-category"><p>2차 카테고리(중분류)</p></div>
        <div class="input-container">
          <input type="text" class="postInput" v-model="insertCategorySecondName" placeholder="중분류 카테고리명을 입력해주세요.">
          <button @click="saveCategorySecond" class="categoryPost">등록</button>
        </div>
        <div class="category-section">
          <ul>
            <li v-for="category in secondCategories" :key="category.categorySecondCode">
              <button @click="fetchThirdCategories(category.categorySecondCode)">{{ category.categorySecondName }}</button>
            </li>
          </ul>
        </div>
      </div>
      <div class="category-column">
        <div class="post-category"><p>3차 카테고리(소분류)</p></div>
        <div class="input-container">
          <input type="text" class="postInput" v-model="insertCategoryThirdName" placeholder="소분류 카테고리명을 입력해주세요.">
          <button @click="saveCategoryThird" class="categoryPost">등록</button>
        </div>
        <div class="category-section">
          <ul>
            <li v-for="category in thirdCategories" :key="category.categoryThirdCode">
              <button>{{ category.categoryThirdName }}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import CategoryList from "@/components/amdin/Category/CategoryList.vue";
import Swal from "sweetalert2";

const store = useStore();
const accessToken = store.state.accessToken;

const insertCategoryFirstName = ref('');
const insertCategorySecondName = ref('');
const insertCategoryThirdName = ref('');
const firstCategories = ref([]);
const secondCategories = ref([]);
const thirdCategories = ref([]);
const selectedFirstCategory = ref('');
const selectedSecondCategory = ref('');


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
    const response = await fetch(`http://localhost:5000/admin/category/second/list/detail/categoryfirst/${categoryFirstCode}`, {
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
const saveCategoryFirst = async () => {
  if (!insertCategoryFirstName.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '카테고리명 누락',
      text: '대분류 카테고리명을 입력해주세요.',
    });
    return;
  }
  const existingFirstNames = firstCategories.value.map(category => category.categoryFirstName);
  if (existingFirstNames.includes(insertCategoryFirstName.value.trim())) {
    await Swal.fire({
      icon: 'warning',
      title: '카테고리 중복',
      text: '이미 존재하는 대분류 카테고리명입니다.',
    });
    return;
  }
  const savedFirstData = {
    categoryFirstName: insertCategoryFirstName.value
  };

  console.log('savedFirstData: ', savedFirstData);

  try {
    const responseFirst = await fetch(`http://localhost:5000/admin/category/first/post?requesterAdminCode=1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savedFirstData)
    });

    if(!responseFirst.ok) {
      const errorFirstText = await responseFirst.text();
      throw new Error(`카테고리 대분류 추가 실패했습니다. 상태 코드: ${responseFirst.status}, 메시지: ${errorFirstText}`);
    }
    await Swal.fire({
      icon: 'success',
      title: '카테고리 등록 성공!',
      text: '카테고리 대분류 등록에 성공했습니다.',
    });

    fetchFirstCategories();
    insertCategoryFirstName.value = '';

  } catch (error) {
    console.error('오류: ', error);
  }
};
const saveCategorySecond = async () => {
  if (!selectedFirstCategory.value) {
    await Swal.fire({
      icon: 'warning',
      title: '상위 카테고리 누락',
      text: '대분류 카테고리를 선택해주세요.',
    });
    return;
  }

  if (!insertCategorySecondName.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '카테고리명 누락',
      text: '중분류 카테고리명을 입력해주세요.',
    });
    return;
  }
  const existingSecondNames = secondCategories.value.map(category => category.categorySecondName);
  if (existingSecondNames.includes(insertCategorySecondName.value.trim())) {
    await Swal.fire({
      icon: 'warning',
      title: '카테고리 중복',
      text: '이미 존재하는 중분류 카테고리명입니다.',
    });
    return;
  }
  const savedSecondData = {
    categorySecondName: insertCategorySecondName.value,
    categoryFirstCode: selectedFirstCategory.value
  };

  console.log('savedSecondData: ', savedSecondData);

  try {
    const responseSecond = await fetch(`http://localhost:5000/admin/category/second/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savedSecondData)
    });

    if(!responseSecond.ok) {
      const errorSecondText = await responseSecond.text();
      throw new Error(`카테고리 중분류 추가 실패했습니다. 상태 코드: ${responseSecond.status}, 메시지: ${errorSecondText}`);
    }
    await Swal.fire({
      icon: 'success',
      title: '카테고리 등록 성공!',
      text: '카테고리 중분류 등록에 성공했습니다.',
    });

    fetchSecondCategories(selectedFirstCategory.value);
    insertCategorySecondName.value = '';

  } catch (error) {
    console.error('오류: ', error);
  }
};
const saveCategoryThird = async () => {
  if (!selectedSecondCategory.value) {
    await Swal.fire({
      icon: 'warning',
      title: '상위 카테고리 누락',
      text: '중분류 카테고리를 선택해주세요.',
    });
    return;
  }
  if (!insertCategoryThirdName.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '카테고리명 누락',
      text: '소분류 카테고리명을 입력해주세요.',
    });
    return;
  }
  const existingThirdNames = thirdCategories.value.map(category => category.categoryThirdName);
  if (existingThirdNames.includes(insertCategoryThirdName.value.trim())) {
    await Swal.fire({
      icon: 'warning',
      title: '카테고리 중복',
      text: '이미 존재하는 소분류 카테고리명입니다.',
    });
    return;
  }
  const savedThirdData = {
    categoryThirdName: insertCategoryThirdName.value,
    categorySecondCode: selectedSecondCategory.value
  };

  console.log('savedThirdData: ', savedThirdData);

  try {
    const responseThird = await fetch(`http://localhost:5000/admin/category/third/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savedThirdData)
    });

    if(!responseThird.ok) {
      const errorThirdText = await responseThird.text();
      throw new Error(`카테고리 소분류 추가 실패했습니다. 상태 코드: ${responseThird.status}, 메시지: ${errorThirdText}`);
    }
    await Swal.fire({
      icon: 'success',
      title: '카테고리 등록 성공!',
      text: '카테고리 소분류 등록에 성공했습니다.',
    });

    fetchThirdCategories(selectedSecondCategory.value);
    insertCategoryThirdName.value = '';
    location.reload(CategoryList);
  } catch (error) {
    console.error('오류: ', error);
  }
};

onMounted(() => {
  fetchFirstCategories();
});

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
  max-width: 1225px;
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
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.category-column {
  flex: 1;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 400px;
  overflow-y: auto;
}

.post-category {
  background-color: #d9d9d9;
  color: #ffffff;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.post-category p {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.input-container {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}
.input-container input {
  border: 1px solid #d9d9d9;
  border-radius: 5px;
}
.postInput {
  flex-grow: 1;
  padding: 5px;
}

.input-container button {
  margin-left: 5px;
  height: 29px;
  text-align: center;
}

.category-section {
  overflow-y: auto;
  max-height: 400px;
}

.category-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-section button {
  width: 80%;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  cursor: pointer;
  text-align: left;
  margin-bottom: 10px;
  border-radius: 8px;
  font-size: 14px;
}

.category-section button:hover {
  background-color: #f0f0f0;
}
.categoryPost {
  color: #FFFFFF;
  font-weight: bold;
  border: none;
  background-color: #344DAF;
  border-radius: 4px;
}
</style>
