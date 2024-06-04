<template>
  <div class="franchise-container">
    <div class="header">
      <span class="breadcrumb">가맹점 및 직원 관리 > 가맹점 및 점주 관리 > 가맹점 및 점주 전체조회</span>
    </div>
    <div class="search-bar">
      <div class="keyword-search">
        <label for="keyword">키워드 검색</label>
        <select v-model="keyword">
          <option value="branchName">지점명</option>
          <option value="ownerName">점주명</option>
          <option value="managerName">담당 관리자</option>
        </select>
        <input type="text" placeholder="검색어를 입력해주세요" v-model="searchText" />
      </div>
      <div class="status-filter">
        <label for="status">활성화 여부</label>
        <select v-model="status">
          <option value="active">활성화</option>
          <option value="inactive">비활성화</option>
        </select>
      </div>
      <button @click="fetchFranchises">검색</button>
    </div>
    <table class="franchise-table">
      <thead>
      <tr>
        <th>No</th>
        <th>지점명</th>
        <th>점주명</th>
        <th>담당 관리자</th>
        <th>활성화 여부</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(franchise, index) in franchises" :key="franchise.id">
        <td>{{ index + 1 }}</td>
        <td>{{ franchise.branchName }}</td>
        <td>{{ franchise.ownerName }}</td>
        <td>{{ franchise.managerName }}</td>
        <td>{{ franchise.isActive ? '활성화' : '비활성화' }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const franchises = ref([]);
const keyword = ref('branchName');
const searchText = ref('');
const status = ref('active');

const fetchFranchises = async () => {
  try {
    const response = await fetch(`http://api.pioms.shop/admin/franchise/list?keyword=${keyword.value}&searchText=${encodeURIComponent(searchText.value)}&status=${status.value}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const text = await response.text(); // response를 텍스트로 먼저 가져옴
    try {
      const data = JSON.parse(text); // 텍스트를 JSON으로 파싱
      franchises.value = data;
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError);
      console.error('Response text:', text); // 원본 텍스트 로그 출력
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

fetchFranchises();
</script>

<style scoped>
.franchise-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  margin-bottom: 20px;
}

.breadcrumb {
  font-size: 14px;
  color: #555;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.keyword-search, .status-filter {
  margin-right: 10px;
}

.keyword-search label, .status-filter label {
  margin-right: 5px;
}

.franchise-table {
  width: 100%;
  border-collapse: collapse;
}

.franchise-table th, .franchise-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.franchise-table th {
  background-color: #f4f4f4;
}
</style>
