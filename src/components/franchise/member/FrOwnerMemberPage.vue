<template>
  <div class="container">
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">점주명</td>
          <td class="filter-input">
            <input type="text" v-model="filterOwnerName" placeholder="점주명 검색" />
          </td>
          <td class="filter-label">가맹점명</td>
          <td class="filter-input">
            <input type="text" v-model="filterFranchiseName" placeholder="가맹점명 검색" />
          </td>
        </tr>
        <tr>
          <td class="filter-label">상태</td>
          <td colspan="3" class="filter-input">
            <label>
              <input type="radio" v-model="filterStatus" value= 1 /> 활성화
            </label>
            <label>
              <input type="radio" v-model="filterStatus" value= 0 /> 비활성화
            </label>
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
    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th>No</th>
          <th>점주명</th>
          <th>가맹점명</th>
          <th>아이디</th>
          <th>비밀번호</th>
          <th>이메일</th>
          <th>전화번호</th>
          <th>등록일</th>
          <th>수정일</th>
          <th>삭제일</th>
          <th>로그인 실패횟수</th>
          <th>상태</th>
          <th>관리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(franchise, index) in paginatedFranchises" :key="franchise.franchiseCode" class="allpost">
          <td class="num">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ franchise.franchiseOwner.ownerName }}</td>
          <td>{{ franchise.franchiseName }}</td>
          <td>{{ franchise.franchiseBusinessNum }}</td>
          <td>{{ franchise.franchiseAddress }}</td>
          <td>{{ franchise.franchiseCall }}</td>
          <td>{{ franchise.deliveryDriver.driverName }}</td>
          <td>{{ formatDate(franchise.franchiseEnrollDate) }}</td>
          <td>{{ formatDate(franchise.franchiseUpdateDate) }}</td>
          <td>{{ formatDate(franchise.franchiseDeleteDate) }}</td>
          <td>{{ franchise.loginFailCount }}</td>
          <td>{{ franchise.status }}</td>
          <td>
            <button @click="showRegist(franchise)" class="editbutton">등록</button>
            <button @click="showEdit(franchise)" class="editbutton">수정</button>
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
  <Register v-if="registPopup" :askCode="askCode" :closeRegist="closeRegist"/>
  <Edit v-if="editPopup" :askCode="askCode" :closeEdit="closeEdit"/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Breadcrumb from '@/components/amdin/ask/Breadcrumb.vue'; // Breadcrumb 컴포넌트 임포트
import { useStore } from 'vuex'; // Vuex store 임포트

const store = useStore(); // Vuex store 사용

const franchises = ref([]);
const filteredFranchises = ref([]);
const filterStatus = ref('전체');
const filterOwnerName = ref('');
const filterFranchiseName = ref('');

const currentPage = ref(1);
const itemsPerPage = 15;

const breadcrumbs = [
  { label: '문의사항 조회 및 관리', link: null },
];

const refreshData = () => {
  fetchFranchises(); // 데이터를 새로고침
};

const fetchFranchises = async () => {
  try {
    const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch('http://api.pioms.shop/admin/franchise/list', {
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
    franchises.value = data || [];
    filteredFranchises.value = franchises.value;
    applyFilters();
  } catch (error) {
    console.error('Failed to fetch franchises:', error);
  }
};

const applyFilters = () => {
  filteredFranchises.value = franchises.value.filter(franchise => {
    const matchesOwnerName = !filterOwnerName.value || franchise.franchiseOwner.ownerName.includes(filterOwnerName.value);
    const matchesFranchiseName = !filterFranchiseName.value || franchise.franchiseName.includes(filterFranchiseName.value);

    return matchesOwnerName && matchesFranchiseName;
  });
};

const resetFilters = () => {
  filterStatus.value = '전체';
  filterOwnerName.value = '';
  filterFranchiseName.value = '';
  filteredFranchises.value = franchises.value;
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

const paginatedFranchises = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredFranchises.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredFranchises.value.length / itemsPerPage);
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
  fetchFranchises();
});

const registPopup = ref(false);
const askCode = ref(null);
const editPopup = ref(false);

const showRegist = (franchise) => {
  registPopup.value = !registPopup.value;
  askCode.value = franchise.franchiseCode;
};

const showEdit = (franchise) => {
  editPopup.value = !editPopup.value;
  askCode.value = franchise.franchiseCode;
};

const closeRegist = () => {
  registPopup.value = !registPopup.value;
};

const closeEdit = () => {
  editPopup.value = !editPopup.value;
};
</script>

<style scoped>
.container {
  position: relative;
  min-height: 100vh; /* Ensure the container takes at least the full height of the viewport */
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
  width: 1300px;
}

.filter-table td {
  padding: 5px 10px;
  font-size: 16px;
  height: 30px;
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

.date-range span {
  margin: 0 5px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
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
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.table {
  width: 1300px;
  max-width: 1300px;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-spacing: 0 10px;
}

.table th {
  font-weight: bold;
  color: #000;
  font-size: 16px;
  text-align: center;
}

.table th, td {
  width: 50px;
}

.table th:nth-child(5), .table td:nth-child(5) {
  width: 100px; /* 원하는 너비로 설정 */
}

td.boardname {
  text-decoration: none;
  color: black;
  cursor: pointer;
  width: 150px;
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
  font-size: 14px;
}

.allpost td:nth-child(11) {
  width: 150px; /* 로그인 실패 횟수 칸 넓히기 */
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
