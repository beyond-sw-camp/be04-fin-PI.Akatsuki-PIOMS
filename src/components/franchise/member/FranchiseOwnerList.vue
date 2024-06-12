<template>
  <div class="container">
    <div class="header" align="center"  style="padding-bottom: 30px;">
      <div style="  max-width: 1440px;justify-content: center;align-items: center;"  >
        <br>
        <div style="float: left" ><img src="@/assets/icon/smile.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">가맹점 및 직원 관리 > 가맹점 및 점주 관리 > 점주 관리</span>
        </div>
      </div>
    </div>

    <div class="product-sub-title"> * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png">초기화 또는<img src="@/assets/icon/search.png">검색을 눌러주세요.
    </div>

    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">키워드 검색</td>
          <td class="filter-input">
            <select v-model="keyword">
              <option value="franchiseOwnerName">점주명</option>
              <option value="franchiseName">가맹점명</option>
            </select>
            &nbsp;
            <input type="text" placeholder="검색어를 입력해주세요" v-model="searchText" />
          </td>
        </tr>
        <tr>
          <td class="filter-label">상태</td>
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

      <div class="filter-buttons">
        <button @click="resetFilters" class="reset-btn">
          <img src="@/assets/icon/reset.png" alt="Reset" />
        </button>
        <button @click="applyFilters" class="search-btn">
          <img src="@/assets/icon/search.png" alt="Search" />
        </button>
      </div>
    </div>

    <div class="filter-buttons">
      <div class="post-btn" id="app">
        <button @click="showPostPopup = true" class="postBtn">
          <img src="@/assets/icon/점주등록.png" alt="postProduct">
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
          <th width="4%">No</th>
          <th width="4%">점주명</th>
          <th width="10%">가맹점명</th>
          <th width="5%">아이디</th>
          <th width="10%">이메일</th>
          <th>전화번호</th>
          <th>등록일</th>
          <th>수정일</th>
          <th>삭제일</th>
          <th width="6.2%">로그인 실패횟수</th>
          <th width="3%">상태</th>
          <th width="3%">관리</th>
        </tr>
        </thead>
        <tbody>
        <tr class="tr__bd" v-for="(franchiseOwner, index) in paginatedFranchiseOwners" :key="franchiseOwner.franchiseOwnerCode">
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
            <button @click="showUpdate(franchiseOwner)" class="editbutton">조회</button>
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
    <FranchiseOwnerPostPopup :isOpen="showPostPopup" @close="closePostPopup" @refresh="fetchFranchiseOwners" />
    <FranchiseOwnerUpdatePopup :isOpen="showUpdatePopup" :franchiseOwnerCode="franchiseOwnerCode" @close="closeUpdatePopup" @refresh="fetchFranchiseOwners" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import FranchiseOwnerPostPopup from "@/components/franchise/member/FranchiseOwnerPostPopup.vue";
import FranchiseOwnerUpdatePopup from "@/components/franchise/member/FranchiseOwnerUpdatePopup.vue";
import axios from "axios";

const store = useStore();
const franchiseOwners = ref([]);
const filteredFranchiseOwners = ref([]);
const keyword = ref('franchiseOwnerName');
const searchText = ref('');
const status = ref('all');
const showPostPopup = ref(false);
const showUpdatePopup = ref(false);
const franchiseOwnerCode = ref(null);

const currentPage = ref(1);
const itemsPerPage = 15;

const showUpdate = (franchiseOwner) => {
  showUpdatePopup.value = true;
  franchiseOwnerCode.value = franchiseOwner.franchiseOwnerCode;
};

const closeUpdatePopup = () => {
  showUpdatePopup.value = false;
};

const closePostPopup = () => {
  showPostPopup.value = false;
};

const downloadExcel = () => {
  axios({
    url: 'http://api.pioms.shop/admin/exceldownload/frowner-excel',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${store.state.accessToken}`,
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'frOwnersList.xlsx');
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.error('EBad request:', error);
  });
};

const fetchFranchiseOwners = async () => {
  try {
    const response = await fetch(`http://api.pioms.shop/admin/franchise/owner/list?adminCode=${store.state.userCode}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${store.state.accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    franchiseOwners.value = data.map(franchiseOwner => ({
      franchiseOwnerCode: franchiseOwner.franchiseOwnerCode,
      franchiseOwnerName: franchiseOwner.franchiseOwnerName,
      franchiseName: franchiseOwner.franchiseName,
      franchiseOwnerId: franchiseOwner.franchiseOwnerId,
      franchiseOwnerEmail: franchiseOwner.franchiseOwnerEmail,
      franchiseOwnerPhone: franchiseOwner.franchiseOwnerPhone,
      franchiseOwnerEnrollDate: franchiseOwner.franchiseOwnerEnrollDate,
      franchiseOwnerUpdateDate: franchiseOwner.franchiseOwnerUpdateDate,
      franchiseOwnerDeleteDate: franchiseOwner.franchiseOwnerDeleteDate,
      ownerPwdCheckCount: franchiseOwner.ownerPwdCheckCount,
      franchiseOwnerStatus: franchiseOwner.franchiseOwnerStatus
    }));
    applyFilters();
  } catch (error) {
    console.error('Fetch error:', error);
  }
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

const applyFilters = () => {
  filteredFranchiseOwners.value = franchiseOwners.value.filter(franchiseOwner => {
    const matchesKeyword = !searchText.value || franchiseOwner[keyword.value]?.includes(searchText.value);
    const matchesStatus = status.value === 'all' || (status.value === 'active' ? franchiseOwner.franchiseOwnerStatus : !franchiseOwner.franchiseOwnerStatus);
    return matchesKeyword && matchesStatus;
  });
  currentPage.value = 1;
};

const resetFilters = () => {
  keyword.value = 'franchiseOwnerName';
  searchText.value = '';
  status.value = 'all';
  applyFilters();
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
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  width: 100%;
  max-width: 1440px;
  text-align: center;
  padding-bottom: 30px;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-icon {
  width: 18px;
}

.breadcrumb {
  font-size: 16px;
  color: #555;
  font-weight: bold;
}

.product-sub-title {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
  justify-content: flex-start;
  width: 100%;
  max-width: 1440px;
  padding-left: 10px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1440px;
}

.filter-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
}

.filter-table td {
  padding: 5px 10px;
}

.filter-label {
  font-weight: bold;
  text-align: center;
  border: solid 1px #747474;
  width: 120px;
  background-color: #d9d9d9;
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
  width: 100%;
  max-width: 1440px;
}

.reset-btn,
.search-btn {
  background-color: #fff;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  margin: 0 5px;
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
  background-color: #d9d9d9;
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

.post-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1440px;
}

.postBtn {
  border: none;
  background-color: white;
  cursor: pointer;
}

.excelBtn {
  border: none;
  background-color: white;
  cursor: pointer;
}

.tr__bd:hover {
  background-color: #f2f2f2;
}

.tr__bd td {
  border-bottom: 1px solid #ddd;
  font-size: 12px;
}

.tr__bd:last-child td {
  border-bottom: none;
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
  table-layout: fixed; /* 고정된 레이아웃을 사용하여 셀 너비를 고정 */
}

.table th, .table td {
  padding: 10px;
  text-align: center;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  overflow: hidden;
  text-overflow: ellipsis; /* 내용이 넘칠 때 "..." 표시 */
}
</style>
