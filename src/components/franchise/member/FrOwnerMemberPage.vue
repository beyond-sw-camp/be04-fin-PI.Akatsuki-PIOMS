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
              <input type="radio" v-model="filterStatus" value="1" /> 활성화
            </label>
            <label>
              <input type="radio" v-model="filterStatus" value="0" /> 비활성화
            </label>
            <label>
              <input type="radio" v-model="filterStatus" value="" /> 전체
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
        <tr v-for="(franchiseOwner, index) in paginatedFranchises" :key="franchiseOwner.franchiseOwnerCode" class="allpost">
          <td class="num">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ franchiseOwner.franchiseOwnerName }}</td>
          <td>{{ franchiseOwner.franchiseName }}</td>
          <td>{{ franchiseOwner.franchiseOwnerId }}</td>
          <td>{{ franchiseOwner.franchiseOwnerEmail }}</td>
          <td>{{ franchiseOwner.franchiseOwnerPhone }}</td>
          <td>{{ formatDate(franchiseOwner.franchiseOwnerEnrollDate) }}</td>
          <td>{{ formatDate(franchiseOwner.franchiseOwnerUpdateDate) }}</td>
          <td>{{ formatDate(franchiseOwner.franchiseOwnerDeleteDate) }}</td>
          <td>{{ franchiseOwner.ownerPwdCheckCount }}</td>
          <td>{{ franchiseOwner.ownerStatus }}</td>
          <td>
            <button @click="showEdit(franchiseOwner)" class="editbutton">조회</button>
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
    <Edit v-if="editPopup" :franchiseOwnerCode="franchiseOwnerCode" :closeEdit="closeEdit" @refreshData="fetchFranchises"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Edit from '@/components/franchise/member/FormEdit.vue';

const store = useStore();
const franchiseOwners = ref([]);
const filteredFranchises = ref([]);
const filterStatus = ref('');
const filterOwnerName = ref('');
const filterFranchiseName = ref('');

const currentPage = ref(1);
const itemsPerPage = 15;

const fetchFranchises = async () => {
  try {
    const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch('http://api.pioms.shop/admin/franchise/owner/list', {
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
    franchiseOwners.value = data || [];
    filteredFranchises.value = franchiseOwners.value;
    applyFilters();
  } catch (error) {
    console.error('Failed to fetch franchises:', error);
  }
};

const applyFilters = () => {
  filteredFranchises.value = franchiseOwners.value.filter(franchise => {
    const matchesOwnerName = !filterOwnerName.value || franchise.franchiseOwnerName.includes(filterOwnerName.value);
    const matchesFranchiseName = !filterFranchiseName.value || franchise.franchiseName.includes(filterFranchiseName.value);
    const matchesStatus = filterStatus.value === '' || franchise.ownerStatus === Number(filterStatus.value);

    return matchesOwnerName && matchesFranchiseName && matchesStatus;
  });
};

const resetFilters = () => {
  filterStatus.value = '';
  filterOwnerName.value = '';
  filterFranchiseName.value = '';
  filteredFranchises.value = franchiseOwners.value;
  currentPage.value = 1;
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

const editPopup = ref(false);
const franchiseOwnerCode = ref(null);

const showEdit = (franchise) => {
  editPopup.value = !editPopup.value;
  franchiseOwnerCode.value = franchise.franchiseOwnerCode;
};

const closeEdit = () => {
  editPopup.value = !editPopup.value;
};
</script>

<style scoped>
/* (기존 스타일을 유지하되 필요한 경우 추가 및 수정) */
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
  width: 100px;
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
  width: 150px;
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
