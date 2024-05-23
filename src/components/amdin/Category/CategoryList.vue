<template>
  <div>
    <div>
      <label for="majorCategory">대분류:</label>
      <select id="majorCategory" v-model="selectedMajorCategory" @change="fetchMiddleCategories">
        <option value="">선택하세요</option>
        <option v-for="category in majorCategories" :key="category.categoryFirstCode" :value="category.categoryFirstCode">
          {{ category.categoryFirstName }}
        </option>
      </select>
    </div>

    <div v-if="middleCategories.length > 0">
      <label for="middleCategory">중분류:</label>
      <select id="middleCategory" v-model="selectedMiddleCategory" @change="fetchMinorCategories">
        <option value="">선택하세요</option>
        <option v-for="category in middleCategories" :key="category.categorySecondCode"
                :value="category.categorySecondCode">
          {{ category.categorySecondName }}
        </option>
      </select>
    </div>

    <div v-if="minorCategories.length > 0">
      <label for="minorCategory">소분류:</label>
      <select id="minorCategory" v-model="selectedMinorCategory">
        <option value="">선택하세요</option>
        <option v-for="category in minorCategories" :key="category.categoryThirdCode"
                :value="category.categoryThirdCode">
          {{ category.categoryThirdName }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const majorCategories = ref([]);
const middleCategories = ref([]);
const minorCategories = ref([]);

const selectedMajorCategory = ref('');
const selectedMiddleCategory = ref('');
const selectedMinorCategory = ref('');

const fetchMajorCategories = async () => {
  try {
    const response = await fetch('/api/admin/category/first', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('대분류를 불러오는 데 실패했습니다.');
    }
    majorCategories.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchMiddleCategories = async () => {
  if (selectedMajorCategory.value === '') {
    middleCategories.value = [];
    minorCategories.value = [];
    return;
  }
  try {
    const response = await fetch(`/api/admin/category/second?categoryFirstCode=${selectedMajorCategory.value}`);
    if (!response.ok) {
      throw new Error('중분류를 불러오는 데 실패했습니다.');
    }
    middleCategories.value = await response.json();
    minorCategories.value = [];
    selectedMiddleCategory.value = '';
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchMinorCategories = async () => {
  if (selectedMiddleCategory.value === '') {
    minorCategories.value = [];
    return;
  }
  try {
    const response = await fetch(`/api/admin/category/third?categorySecondCode=${selectedMiddleCategory.value}`);
    if (!response.ok) {
      throw new Error('소분류를 불러오는 데 실패했습니다.');
    }
    minorCategories.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

fetchMajorCategories();
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

select {
  width: 200px;
  margin-top: 5px;
}
</style>