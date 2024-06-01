<template>
  <div class="category-top">
    <img src="@/assets/icon/Cloth.png" alt="" style="width: 40px; height: 40px">
    <span>
    상품 및 상품 카테고리 관리 > 상품 카테고리 관리 > 상품 카테고리 조회 및 등록
    </span>
  </div>
  <div class="category-select">
    <div class="category-column">
      <div class="post-category">카테고리(대분류)</div>
      <div class="input-container">
        <input type="text" class="postInput" v-model="insertCategoryFirstName" placeholder="대분류 카테고리명을 입력해주세요.">
        <button @click="saveCategoryFirst">등록</button>
      </div>
      <div class="categoryFirst-select">
        <ul>
          <li v-for="category in firstCategories" :key="category.categoryFirstCode">
            <div>
              <button @click="fetchSecondCategories(category.categoryFirstCode)">{{ category.categoryFirstName }}</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="category-column">
      <div class="post-category">카테고리(중분류)</div>
      <div class="input-container">
        <input type="text" class="postInput" v-model="insertCategorySecondName" placeholder="중분류 카테고리명을 입력해주세요.">
        <button @click="saveCategorySecond">등록</button>
      </div>
      <div class="categorySecond-select">
        <ul>
          <li v-for="category in secondCategories" :key="category.categorySecondCode">
            <button @click="fetchThirdCategories(category.categorySecondCode)">{{ category.categorySecondName }}</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="category-column">
      <div class="post-category">카테고리(소분류)</div>
      <div class="input-container">
        <input type="text" class="postInput" v-model="insertCategoryThirdName" placeholder="소분류 카테고리명을 입력해주세요.">
        <button @click="saveCategoryThird">등록</button>
      </div>
      <div class="categoryThird-select">
        <ul>
          <li v-for="category in thirdCategories" :key="category.categoryThirdCode">
            <button>{{ category.categoryThirdName }}</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import CategoryList from "@/components/amdin/Category/CategoryList.vue";
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
    alert('대분류 카테고리명을 입력해주세요.');
    return;
  }
  const existingFirstNames = firstCategories.value.map(category => category.categoryFirstName);
  if (existingFirstNames.includes(insertCategoryFirstName.value.trim())) {
    alert('이미 존재하는 대분류 카테고리명입니다.');
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

    console.log('카테고리 대분류 등록에 성공했습니다.');

    // 데이터를 새로고침하고 화면을 갱신합니다.
    fetchFirstCategories();
    insertCategoryFirstName.value = ''; // 입력 필드 초기화

  } catch (error) {
    console.error('오류: ', error);
  }
};

const saveCategorySecond = async () => {
  if (!selectedFirstCategory.value) {
    alert('대분류 카테고리를 선택해주세요.');
    return;
  }

  if (!insertCategorySecondName.value.trim()) {
    alert('중분류 카테고리명을 입력해주세요.');
    return;
  }
  const existingSecondNames = secondCategories.value.map(category => category.categorySecondName);
  if (existingSecondNames.includes(insertCategorySecondName.value.trim())) {
    alert('이미 존재하는 중분류 카테고리명입니다.');
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

    console.log('카테고리 중분류 등록에 성공했습니다.');

    // 데이터를 새로고침하고 화면을 갱신합니다.
    fetchSecondCategories(selectedFirstCategory.value);
    insertCategorySecondName.value = ''; // 입력 필드 초기화

  } catch (error) {
    console.error('오류: ', error);
  }
};

const saveCategoryThird = async () => {
  if (!selectedSecondCategory.value) {
    alert('중분류 카테고리를 선택해주세요.');
    return;
  }
  if (!insertCategoryThirdName.value.trim()) {
    alert('소분류 카테고리명을 입력해주세요.');
    return;
  }
  const existingThirdNames = thirdCategories.value.map(category => category.categoryThirdName);
  if (existingThirdNames.includes(insertCategoryThirdName.value.trim())) {
    alert('이미 존재하는 중분류 카테고리명입니다.');
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

    console.log('카테고리 소분류 등록에 성공했습니다.');

    // 데이터를 새로고침하고 화면을 갱신합니다.
    fetchThirdCategories(selectedSecondCategory.value);
    insertCategoryThirdName.value = ''; // 입력 필드 초기화
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
.category-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
}
.post-category {
  height: 50px; /* 원하는 높이로 설정 */
  width: 100%;
  background-color: #f0f0f0; /* 임의의 배경색 설정 */
  margin-bottom: 10px; /* 간격 조절 */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.input-container {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px; /* 입력창과 리스트 사이의 간격 */
}
.postInput {
  flex-grow: 1;
  padding: 5px; /* 여백 추가 */
}
.input-container button {
  margin-left: 5px; /* 버튼과 입력창 사이의 간격 */
  height: 29px;
  text-align: center;
}
.categoryFirst-select, .categorySecond-select, .categoryThird-select {
  border: 1px solid black;
  width: 90%;
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
  width: 90%;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  cursor: pointer;
  text-align: left;
}

.categoryFirst-select button:hover, .categorySecond-select button:hover, .categoryThird-select button:hover {
  background-color: #f0f0f0;
}
</style>