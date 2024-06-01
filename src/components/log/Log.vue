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
          <th>이력대상</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(history, index) in paginatedHistories" :key="history.logCode" class="allpost">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ history.logChanger }}</td>
          <td @dblclick="showPopup(history.logContent)">{{ history.logContent }}</td>
          <td>{{ formatDate(history.logDate) }}</td>
          <td>{{ history.logStatus }}</td>
          <td>{{ history.logTarget }}</td>
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

    <!-- 팝업 -->
    <div v-if="popupVisible" class="popup-overlay" @click="closePopup">
      <div class="popup-content" @click.stop>
        <h2>이력 내용</h2>
        <p class="popup-text">{{ popupContent }}</p>
        <button @click="closePopup">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Breadcrumb from '@/components/amdin/ask/Breadcrumb.vue'; // Breadcrumb 컴포넌트 임포트
import { useStore } from 'vuex';
const store = useStore();
const accessToken = store.state.accessToken;

const histories = ref([]);
const filteredHistories = ref([]);
const filterConditions = ref([]);
const filterStatus = ref('전체');
const startDate = ref('');
const endDate = ref('');

const currentPage = ref(1);
const itemsPerPage = 15;

const breadcrumbs = [
  {label: '통계 및 이력 관리', link: null},
  {label: '이력 관리', link: null},
];

const fetchHistories = async () => {
  try {
    const response = await fetch('http://localhost:5000/admin/log', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date';
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
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

const popupVisible = ref(false);
const popupContent = ref('');

const showPopup = (content) => {
  popupContent.value = content;
  popupVisible.value = true;
};

const closePopup = () => {
  popupVisible.value = false;
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
  width: 1360px;
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
  text-align: center;
}

.table th,
.table td {
  width: 150px; /* 모든 열의 기본 크기를 고정 */
}

.table .historyContent {
  cursor: pointer;
  width: 200px; /* 이력내용 칸의 크기를 고정 */
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

/* 팝업 스타일 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 42%;
  max-height: 20%;
  overflow-y: auto;
  text-align: center;
  padding-top: 10px;
}


.popup-text {
  font-size: 20px;
  white-space: pre-wrap;
  padding-top: 30px;
}

.popup-content button {
  position: relative;
  top: 60px;
  align-content: center;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 15px;
}

.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 19ch;
  max-width: 19ch; /* 최대 25글자까지 표시 */
  cursor: default;
}

.table .historyContent {
  cursor: pointer;
}
</style>