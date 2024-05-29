<template>
  <div class="container">
    <!-- 상단 네비게이션 -->
    <Breadcrumb :crumbs="breadcrumbs" />

    <!-- 필터 섹션 -->
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">이력조건</td>
          <td class="filter-input">
            <div class="checkbox-group">
              <label><input type="checkbox" value="Company" v-model="filterConditions" /> 본사 정보</label>
              <label><input type="checkbox" value="Admin" v-model="filterConditions" /> 본사 관리자</label>
              <label><input type="checkbox" value="Franchise" v-model="filterConditions" /> 가맹점</label>
              <label><input type="checkbox" value="FranchiseOwner" v-model="filterConditions" /> 가맹점주</label>
              <label><input type="checkbox" value="Product" v-model="filterConditions" /> 상품</label>
              <label><input type="checkbox" value="Category" v-model="filterConditions" /> 상품 카테고리</label>
              <label><input type="checkbox" value="Login" v-model="filterConditions" /> 로그인 정보</label>
            </div>
          </td>
        </tr>
        <tr>
          <td class="filter-label">이력상태</td>
          <td class="filter-input">
            <select id="filterStatus" v-model="filterStatus" title="이력 상태 선택">
              <option value="전체">전체</option>
              <option value="등록">등록</option>
              <option value="수정">수정</option>
              <option value="삭제">삭제</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="filter-label">정보변경일</td>
          <td colspan="3" class="filter-input">
            <input type="date" id="startDate" v-model="startDate" placeholder="시작 날짜 선택" title="시작 날짜 선택">
            <span>~</span>
            <input type="date" id="endDate" v-model="endDate" placeholder="종료 날짜 선택" title="종료 날짜 선택">
          </td>
        </tr>
      </table>
    </div>

    <!-- 액션 버튼 섹션 -->
    <div class="action-buttons">
      <button @click="resetFilters" class="reset-btn">
        <img src="@/assets/icon/reset.png" alt="Reset" />
      </button>
      <button @click="applyFilters" class="search-btn">
        <img src="@/assets/icon/search.png" alt="Search" />
      </button>
    </div>

    <!-- 이력 조회 결과 -->
    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th>No</th>
          <th>이력변경자</th>
          <th>이력내용</th>
          <th>변경일</th>
          <th>이력상태</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(history, index) in paginatedHistories" :key="history.logCode" class="allpost">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ history.logChanger }}</td>
          <td class="historyContent">{{ history.logContent }}</td>
          <td>{{ formatDate(history.logDate) }}</td>
          <td>{{ history.logStatus }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Breadcrumb from '@/components/amdin/ask/Breadcrumb.vue'; // Breadcrumb 컴포넌트 임포트

const histories = ref([]);
const filteredHistories = ref([]);
const filterConditions = ref([]);
const filterStatus = ref('전체');
const startDate = ref('');
const endDate = ref('');

const currentPage = ref(1);
const itemsPerPage = 15;

const breadcrumbs = [
  { label: '통계 및 이력 관리', link: null },
  { label: '이력 관리', link: null },
];

const fetchHistories = async () => {
  try {
    const response = await fetch('http://localhost:5000/admin/log', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    histories.value = data || [];
    filteredHistories.value = histories.value;
    applyFilters();
  } catch (error) {
    console.error('Failed to fetch histories:', error);
  }
};

const applyFilters = () => {
  filteredHistories.value = histories.value.filter(history => {
    const matchesCondition = filterConditions.value.length === 0 ||
        filterConditions.value.includes(history.logTarget) ||
        (filterConditions.value.includes("Category") &&
            (history.logTarget === "CategoryFirst" || history.logTarget === "CategorySecond" || history.logTarget === "CategoryThird"));
    const matchesStatus = filterStatus.value === '전체' || history.logStatus === filterStatus.value;
    const historyDate = new Date(history.logDate[0], history.logDate[1] - 1, history.logDate[2]);
    const matchesStartDate = !startDate.value || historyDate >= new Date(startDate.value);
    const matchesEndDate = !endDate.value || historyDate <= new Date(endDate.value);

    return matchesCondition && matchesStatus && matchesStartDate && matchesEndDate;
  });
};

const resetFilters = () => {
  filterConditions.value = [];
  filterStatus.value = '전체';
  startDate.value = '';
  endDate.value = '';
  filteredHistories.value = histories.value;
  currentPage.value = 1; // 페이지 리셋
};

const formatDate = (dateArray) => {
  if (!dateArray || dateArray.length === 0) return '날짜 없음';
  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const paginatedHistories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredHistories.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredHistories.value.length / itemsPerPage);
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

onMounted(() => {
  fetchHistories();
});
</script>

<style scoped>
.container {
  padding: 20px;
}
.filter-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 1200px;
}

.filter-table td {
  padding: 5px 10px;
}

.filter-label {
  font-weight: bold;
  text-align: center;
  width: 100px;
  background-color: #D9D9D9;
}

.filter-input {
  text-align: left;
  border: 1px solid lightgray;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
}

.checkbox-group label {
  margin-right: 10px;
  white-space: nowrap;
}

.date-range span {
  margin: 0 5px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.reset-btn, .search-btn {
  background-color: #fff;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 8px;
  font-size: 14px;
  margin: 0 5px;
}

.reset-btn:hover, .search-btn:hover {
  background-color: #f0f0f0;
}

.table-container {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.table {
  width: 1200px;
  max-width: 1200px;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-spacing: 0 10px;
}

.table th {
  font-weight: bold;
  color: #000;
  width: 100px;
  text-align: center;
}

.header1 {
  background-color: #D9D9D9;
  font-weight: bold;
  height: 50px;
  font-size: 12px;
  text-align: center;
}

.allpost {
  text-align: center;
  padding: 10px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
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
</style>
