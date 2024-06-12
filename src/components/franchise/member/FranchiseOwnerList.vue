<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/icon/smile.png" style="width: 18px"/>&nbsp;
      <span class="breadcrumb">가맹점 및 직원 관리 > 가맹점 및 점주 관리 > 점주 전체 조회</span>
    </div>

    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">키워드 검색</td>
          <td class="filter-input">
            <input type="text" v-model="filterOwnerName" placeholder="점주명 검색" @keyup.enter="applyFilters" />
          </td>
          <td class="filter-label">가맹점명</td>
          <td class="filter-input">
            <input type="text" v-model="filterFranchiseName" placeholder="가맹점명 검색" @keyup.enter="applyFilters" />
          </td>
        </tr>
        <tr>
          <td class="filter-label">상태</td>
          <td colspan="3" class="filter-input">
            <label>
              <input type="radio" value="" v-model="filterStatus" /> 전체
            </label>
            &nbsp;
            <label>
              <input type="radio" value="1" v-model="filterStatus" /> 활성화
            </label>
            &nbsp;
            <label>
              <input type="radio" value="0" v-model="filterStatus" /> 비활성화
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
        <button @click="showPostPopup = true" class="postBtn">
          <img src="@/assets/icon/new%20Item.png" alt="postProduct">
        </button>
        <ProductPostPopup v-if="showPostPopup" @close="showPostPopup = false"/>
        <button @click="downloadExcel" class="excelBtn"><img src="@/assets/icon/excel.png" alt="excel"></button>
      </div>
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
        <tr v-for="(franchiseOwner, index) in paginatedFranchiseOwners" :key="franchiseOwner.franchiseOwnerCode">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ franchiseOwner.franchiseOwnerName }}</td>
          <td>{{ franchiseOwner.franchiseName }}</td>
          <td>{{ franchiseOwner.franchiseOwnerId }}</td>
          <td>{{ franchiseOwner.franchiseOwnerEmail }}</td>
          <td>{{ franchiseOwner.franchiseOwnerPhone }}</td>
          <td>{{ formatDate(franchiseOwner.franchiseOwnerEnrollDate) }}</td>
          <td>{{ formatDate(franchiseOwner.franchiseOwnerUpdateDate) }}</td>
          <td>{{ formatDate(franchiseOwner.franchiseOwnerDeleteDate) }}</td>
          <td>{{ franchiseOwner.ownerPwdCheckCount }}</td>
          <td>{{ franchiseOwner.franchiseOwnerStatus ? '활성화' : '비활성화' }}</td>
          <td>
            <button @click="showEdit(franchiseOwner)" class="editbutton">조회</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" style="margin-bottom: 100px">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
    <!-- Edit Component -->
    <Edit v-if="editPopup" :franchiseOwnerCode="franchiseOwnerCode" :closeEdit="closeEdit" @refreshData="fetchFranchiseOwners"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Edit from '@/components/franchise/member/FormEdit.vue';
import ProductPostPopup from "@/components/admin/product/ProductPostPopup.vue";
import axios from "axios";

const store = useStore();
const accessToken = store.state.accessToken;
const franchiseOwners = ref([]);
const filteredFranchiseOwners = ref([]);
const filterStatus = ref('');
const filterOwnerName = ref('');
const filterFranchiseName = ref('');

const currentPage = ref(1);
const itemsPerPage = 15;

const fetchFranchiseOwners = async () => {
  try {
    const accessToken = store.state.accessToken;
    const userRole = store.state.userRole;
    const userId = store.state.userCode;

    const response = await fetch(`http://localhost:5000/admin/franchise/owner/list?adminCode=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch franchise owners');
    }

    const data = await response.json();
    franchiseOwners.value = data || [];
    franchiseOwners.value.sort((a, b) => new Date(b.franchiseOwnerEnrollDate) - new Date(a.franchiseOwnerEnrollDate));
    applyFilters();
  } catch (error) {
    console.error('Failed to fetch franchise owners:', error);
  }
};
const downloadExcel = () => {
  axios({
    url: 'http://localhost:5000/admin/exceldownload/frowner-excel',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'FrOwnerList.xlsx');
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.error('EBad request:', error);
  });
};
const applyFilters = () => {
  filteredFranchiseOwners.value = franchiseOwners.value.filter(owner => {
    const matchesOwnerName = !filterOwnerName.value || owner.franchiseOwnerName.includes(filterOwnerName.value);
    const matchesFranchiseName = !filterFranchiseName.value || owner.franchiseName.includes(filterFranchiseName.value);
    const matchesStatus = filterStatus.value === '' || owner.franchiseOwnerStatus === (filterStatus.value === '1');
    return matchesOwnerName && matchesFranchiseName && matchesStatus;
  });
};

const resetFilters = () => {
  filterStatus.value = '';
  filterOwnerName.value = '';
  filterFranchiseName.value = '';
  applyFilters();
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

const paginatedFranchiseOwners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredFranchiseOwners.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredFranchiseOwners.value.length / itemsPerPage);
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
  fetchFranchiseOwners();
});

const editPopup = ref(false);
const franchiseOwnerCode = ref(null);

const showEdit = (franchiseOwner) => {
  editPopup.value = true;
  franchiseOwnerCode.value = franchiseOwner.franchiseOwnerCode;
};

const closeEdit = () => {
  editPopup.value = false;
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  margin-left: 215px;
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
  margin-bottom: 20px;
  margin-left: 205px;
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
