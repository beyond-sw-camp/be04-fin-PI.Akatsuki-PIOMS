<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/icon/어드민.png" style="width: 18px"/>&nbsp;
      <span class="breadcrumb">관리자 관리 > 관리자 전체 조회 및 관리</span>
    </div>

    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">관리자명</td>
          <td class="filter-input">
            <input type="text" v-model="filterAdminName" placeholder="관리자명 검색" @keyup.enter="applyFilters" />
          </td>
        </tr>
        <tr>
          <td class="filter-label">활성화 여부</td>
          <td class="filter-input">
            <label>
              <input type="radio" value="all" v-model="status" /> 전체
            </label>
            &nbsp;
            <label>
              <input type="radio" value="active" v-model="status" /> 활성화
            </label>
            &nbsp;
            <label>
              <input type="radio" value="inactive" v-model="status" /> 비활성화
            </label>
          </td>
        </tr>
      </table>
    </div>
    <div class="filter-buttons">
      <button @click="resetFilters" class="reset-btn">
        <img src="@/assets/icon/reset.png" alt="Reset" />
      </button>
      <button @click="applyFilters" class="search-btn">
        <img src="@/assets/icon/search.png" alt="Search" />
      </button>
    </div>

    <div align="center" style="padding-bottom: 10px;">
      <div class="post-btn" id="app">
        <button @click="openPostPopup" class="postBtn">
          <img src="@/assets/icon/관리자등록.png" alt="postProduct">
        </button>
        <button @click="downloadExcel" class="excelBtn">
          <img src="@/assets/icon/excel.png" alt="excel">
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th>No</th>
          <th>이름</th>
          <th>ID</th>
          <th>이메일</th>
          <th>휴대전화</th>
          <th>역할</th>
          <th>활성상태</th>
          <th>로그인 실패횟수</th>
          <th>등록일</th>
          <th>수정일</th>
          <th>삭제일</th>
          <th>발급코드</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(admin, index) in paginatedLists" :key="admin.adminCode" @click="openUpdatePopup(admin.adminCode)">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ admin.adminName }}</td>
          <td>{{ admin.adminId }}</td>
          <td>{{ admin.adminEmail }}</td>
          <td>{{ admin.adminPhone }}</td>
          <td>{{ admin.adminRole }}</td>
          <td>{{ admin.adminStatus ? '활성화' : '비활성화' }}</td>
          <td>{{ admin.pwdCheckCount }}</td>
          <td>{{ formatDate(admin.enrollDate) }}</td>
          <td>{{ formatDate(admin.updateDate) }}</td>
          <td>{{ formatDate(admin.deleteDate) }}</td>
          <td>{{ admin.accessNumber }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>

    <AdminPostPopup :isOpen="showPostPopup" @close="closePostPopup" @refresh="fetchAdmins" />
    <AdminUpdatePopup :isOpen="showUpdatePopup" :adminCode="selectedAdminCode" @close="closeUpdatePopup" @refresh="fetchAdmins" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import AdminPostPopup from "@/components/admin/info/AdminPostPopup.vue";
import AdminUpdatePopup from "@/components/admin/info/AdminUpdatePopup.vue";

const store = useStore();
const accessToken = store.state.accessToken;

const admins = ref([]);
const filteredAdmins = ref([]);
const filterAdminName = ref('');
const showPostPopup = ref(false);
const showUpdatePopup = ref(false);
const status = ref('all');
const selectedAdminCode = ref(null);

const currentPage = ref(1);
const itemsPerPage = 15;

const fetchAdmins = async () => {
  try {
    console.log('Fetching admins...');
    const response = await fetch('http://localhost:5000/admin/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admins');
    }

    const data = await response.json();
    admins.value = data || [];
    applyFilters();
    console.log('Admins fetched successfully:', admins.value);
  } catch (error) {
    console.error('Failed to fetch admins:', error);
  }
};

const applyFilters = () => {
  filteredAdmins.value = admins.value.filter(admin => {
    const matchesAdminName = !filterAdminName.value || admin.adminName.includes(filterAdminName.value);
    const matchesStatus = status.value === 'all' || (status.value === 'active' && admin.adminStatus) || (status.value === 'inactive' && !admin.adminStatus);
    return matchesAdminName && matchesStatus;
  });
  currentPage.value = 1;
};

const resetFilters = () => {
  filterAdminName.value = '';
  status.value = 'all';
  applyFilters();
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

const paginatedLists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAdmins.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAdmins.value.length / itemsPerPage);
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

const downloadExcel = async () => {
  try {
    console.log('Downloading Excel...');
    const response = await fetch('http://api.pioms.shop/admin/exceldownload/admin-excel', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '관리자리스트.xlsx');
    document.body.appendChild(link);
    link.click();
    console.log('Excel downloaded successfully.');
  } catch (error) {
    console.error('Failed to download Excel:', error);
  }
};

const openPostPopup = () => {
  showPostPopup.value = true;
  console.log('Post popup opened:', showPostPopup.value); // 디버깅 로그 추가
};

const closePostPopup = () => {
  showPostPopup.value = false;
  console.log('Post popup closed:', showPostPopup.value); // 디버깅 로그 추가
};

const openUpdatePopup = (adminCode) => {
  selectedAdminCode.value = adminCode;
  showUpdatePopup.value = true;
  console.log('Update popup opened:', showUpdatePopup.value, 'for admin:', adminCode); // 디버깅 로그 추가
};

const closeUpdatePopup = () => {
  showUpdatePopup.value = false;
  selectedAdminCode.value = null;
  console.log('Update popup closed:', showUpdatePopup.value); // 디버깅 로그 추가
};

onMounted(() => {
  fetchAdmins();
  console.log('Component mounted, fetchAdmins called.');
});
</script>

<style scoped>
.container {
  padding: 20px;
}

.header {
  display: flex;
  padding-left: 210px;
  align-items: center;
  margin-bottom: 20px;
  justify-content: flex-start;
}

.breadcrumb {
  font-size: 16px;
  color: #555;
  font-weight: bold;
}

.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.filter-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  max-width: 1440px;
}

.filter-table td {
  padding: 5px 10px;
}

.filter-label {
  font-weight: bold;
  text-align: center;
  border: solid 1px #747474;
  width: 120px;
  background-color: #D9D9D9;
}

.filter-input {
  text-align: left;
  border: solid 1px #747474;
  padding: 5px;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.reset-btn, .search-btn {
  background-color: #fff;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  margin: 0 5px;
}

.table-container {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.table {
  width: 100%;
  max-width: 1440px;
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
  padding: 10px;
  text-align: center;
}

.header1 {
  background-color: #D9D9D9;
  font-weight: bold;
  height: 50px;
  font-size: 14px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 100px;
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

.ExNregi {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.post-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 1440px;
}

.postBtn {
  width: 100px;
  height: 26px;
  border: none;
  background-color: white;
  cursor: pointer;
}

.excelBtn {
  width: 100px;
  height: 26px;
  border: none;
  background-color: white;
  cursor: pointer;
  margin-right: 0.5%;
}
</style>
