<template>
  <div class="container">
    <!-- Breadcrumb 컴포넌트 추가 -->
    <Breadcrumb :crumbs="breadcrumbs" />

    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">답변여부</td>
          <td class="filter-input">
            <select id="filterStatus" v-model="filterStatus" title="문의 상태 선택">
              <option value="전체">전체</option>
              <option value="답변대기">답변대기</option>
              <option value="답변완료">답변완료</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="filter-label">등록일</td>
          <td colspan="3" class="filter-input">
            <input type="date" id="startDate" v-model="startDate" placeholder="시작 날짜 선택" title="시작 날짜 선택">
            <span>~</span>
            <input type="date" id="endDate" v-model="endDate" placeholder="종료 날짜 선택" title="종료 날짜 선택">
          </td>
        </tr>
      </table>
    </div>

    <div class="action-buttons">
      <button @click="resetFilters" class="reset-btn">
        <img src="@/assets/icon/reset.png" alt="Reset" />
      </button>
      <button @click="applyFilters" class="search-btn">
        <img src="@/assets/icon/search.png" alt="Search" />
      </button>
    </div>

    <div class="table-header">
      <button @click="createAsk" class="create-btn">문의작성</button>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th>No</th>
          <th>문의상태</th>
          <th>문의제목</th>
          <th>작성자</th>
          <th>등록일</th>
          <th>수정일</th>
          <th>답변일</th>
          <th>관리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(ask, index) in paginatedAsks" :key="ask.askCode" class="allpost">
          <td class="num">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ ask.askStatus }}</td>
          <td class="boardname">{{ ask.askTitle }}</td>
          <td>{{ ask.franchiseOwnerName }}</td>
          <td>{{ formatDate(ask.askEnrollDate) }}</td>
          <td>{{ formatDate(ask.askUpdateDate) }}</td>
          <td>{{ formatDate(ask.askCommentDate) }}</td>
          <td>
            <button
                class="editbutton"
                :class="{ 'editbutton-pending': ask.askStatus === '답변대기' }"
                @click="ask.askStatus === '답변대기' ? editAsk(ask.askCode) : viewAsk(ask.askCode)"
            >
              {{ ask.askStatus === '답변대기' ? '문의 수정' : '문의 조회' }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
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

const asks = ref([]);
const filteredAsks = ref([]);
const filterStatus = ref('전체');
const startDate = ref('');
const endDate = ref('');

const currentPage = ref(1);
const itemsPerPage = 15;

const breadcrumbs = [
  { label: '문의사항 조회 및 관리', link: null },
];

const franchiseOwnerId = 1; // 점주 ID를 하드코딩합니다. 실제 구현에서는 로그인 시 세션이나 로컬스토리지에서 가져옵니다.

const fetchAsks = async () => {
  try {
    const response = await fetch(`http://localhost:5000/franchise/asklist/${franchiseOwnerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    asks.value = data.asks || data.askDTOs || [];
    filteredAsks.value = asks.value;
    applyFilters();
  } catch (error) {
    console.error('Failed to fetch asks:', error);
  }
};

const applyFilters = () => {
  filteredAsks.value = asks.value.filter(ask => {
    const matchesStatus = filterStatus.value === '전체' || ask.askStatus === filterStatus.value;
    const matchesStartDate = !startDate.value || new Date(ask.askEnrollDate[0], ask.askEnrollDate[1] - 1, ask.askEnrollDate[2]) >= new Date(startDate.value);
    const matchesEndDate = !endDate.value || new Date(ask.askEnrollDate[0], ask.askEnrollDate[1] - 1, ask.askEnrollDate[2]) <= new Date(endDate.value);
    return matchesStatus && matchesStartDate && matchesEndDate;
  });
};

const resetFilters = () => {
  filterStatus.value = '전체';
  startDate.value = '';
  endDate.value = '';
  filteredAsks.value = asks.value;
  currentPage.value = 1; // 페이지 리셋
};

const formatDate = (dateArray) => {
  if (!dateArray || dateArray.length === 0) return '날짜 없음';
  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const paginatedAsks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAsks.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAsks.value.length / itemsPerPage);
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

const openAskForm = (askCode, mode) => {
  const width = 800;
  const height = 650;
  const left = (window.screen.width / 2) - (width / 2);
  const top = (window.screen.height / 2) - (height / 2);
  const url = `http://localhost:5173/franchise/askform/${mode}?askCode=${askCode}`;
  window.open(url, 'popup', `width=${width},height=${height},top=${top},left=${left},toolbar=no,scrollbars=no,resizable=no`);
};

// 문의 작성 버튼 클릭 시
const createAsk = () => {
  openAskForm(null, 'create');
};

// 답변 등록 버튼 클릭 시
const editAsk = (askCode) => {
  openAskForm(askCode, 'edit');
};

// 답변 수정 버튼 클릭 시
const viewAsk = (askCode) => {
  openAskForm(askCode, 'view');
};

onMounted(() => {
  fetchAsks();
});
</script>

<style scoped>
.container {
  position: relative;
  min-height: 100vh;
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
  width: 500px;
  text-align: left;
  border: 1px solid lightgray;
}

.date-range {
  display: flex;
  align-items: center;
}

.date-range span {
  margin: 0 5px;
}

.action-buttons {
  display: flex;
  justify-content: center; /* 가운데 정렬 */
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

.table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.create-btn {
  background-color: #fff;
  color: black;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  margin: 0 5px;
  position: relative;
  top: 10px; /* 원하는 위치로 이동 */
  right: 346px; /* 원하는 위치로 이동 */
}

.create-btn:hover {
  background-color: #f0f0f0;
}

.table-container {
  width: 100%;
  margin-top: 10px; /* 리스트와의 간격 조정 */
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.table {
  width: 1200px;
  max-width: 1200px;
  border-collapse: separate;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-spacing: 0 10px;
}

.table th {
  font-weight: bold;
  color: #000;
}

.boardname {
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.header1 {
  background-color: #D9D9D9;
  font-weight: bold;
  height: 50px;
  font-size: 12px;
  text-align: center;
}

.header1 .num {
  width: 5%;
}

.allpost {
  text-align: center;
  padding: 10px 0;
}

.allpost .num {
  width: 5%;
}

.allpost td {
  border-right: 1px solid #ddd;
}

.editbutton {
  background-color: #ffcc00;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
}

.editbutton-pending {
  background-color: #ff6285;
}

.editbutton:hover {
  background-color: #ffbb00;
}

.editbutton-pending:hover {
  background-color: #ff6275;
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
