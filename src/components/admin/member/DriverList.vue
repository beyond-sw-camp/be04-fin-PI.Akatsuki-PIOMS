<template>
  <div class="container">
    <div class="header" align="center"  style="padding-bottom: 30px;">
      <div style="max-width: 1440px;justify-content: center;align-items: center;"  >
        <br>
        <div style="float: left" ><img src="@/assets/icon/Delivery.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">가맹점 및 직원 관리 > 배송기사 관리 > 배송기사 전체 조회</span>
        </div>
      </div>
    </div>

    <div class="product-sub-title"> * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png">초기화 또는<img src="@/assets/icon/search.png">검색을 눌러주세요.
    </div>

    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">배송기사명</td>
          <td class="filter-input">
            <input type="text" v-model="filterDriverName" placeholder="배송기사명 검색" @keyup.enter="applyFilters" />
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

    <div class="filter-buttons">
      <div class="post-btn" id="app">
        <button @click="openPostPopup" class="postBtn">
          <img src="@/assets/icon/점주등록.png" alt="postProduct">
        </button>
        <button @click="downloadExcel" class="excelBtn">
          <button @click="downloadExcel" class="excelBtn"><img src="@/assets/icon/excel.png" alt="excel"></button>
        </button>
      </div>
    </div>


    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th width="4%">No</th>
          <th width="4%">이름</th>
          <th width="5%">아이디</th>
          <th>전화번호</th>
          <th>등록일</th>
          <th>수정일</th>
          <th>삭제일</th>
          <th width="6.2%">로그인 실패횟수</th>
          <th width="4%">상태</th>
          <th width="25%">가맹점</th>
          <th width="3%">관리</th>
        </tr>
        </thead>
        <tbody>
        <tr class="tr__bd" v-for="(driver, index) in paginatedLists" :key="driver.driverCode">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ driver.driverName }}</td>
          <td>{{ driver.driverId }}</td>
          <td>{{ driver.driverPhone }}</td>
          <td>{{ formatDate(driver.driverEnrollDate) }}</td>
          <td>{{ formatDate(driver.driverUpdateDate) }}</td>
          <td>{{ formatDate(driver.driverDeleteDate) }}</td>
          <td>{{ driver.driverPwdCheckCount }}</td>
          <td>{{ driver.driverStatus ? '활성화' : '비활성화' }}</td>
          <td>
            <ul style="list-style: none">
              <li style="text-align: left; list-style: square" v-for="(address, name) in driver.franchises" :key="name">{{ name }}: {{ address }}</li>
            </ul>
          </td>
          <td>
            <button @click="openUpdatePopup(driver.driverCode)" class="editbutton">조회</button>
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

    <DriverPostPopup :isOpen="showPostPopup" @close="closePostPopup" @refresh="fetchDrivers" />
    <DriverUpdatePopup :isOpen="showUpdatePopup" :driverCode="selectedDriverCode" @close="closeUpdatePopup" @refresh="fetchDrivers" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import DriverPostPopup from "@/components/driver/info/DriverPostPopup.vue";
import DriverUpdatePopup from "@/components/driver/info/DriverUpdatePopup.vue";

const store = useStore();
const accessToken = store.state.accessToken;

const drivers = ref([]);
const filteredDrivers = ref([]);
const filterDriverName = ref('');
const showPostPopup = ref(false);
const showUpdatePopup = ref(false);
const status = ref('all');
const selectedDriverCode = ref(null);

const currentPage = ref(1);
const itemsPerPage = 15;

const fetchDrivers = async () => {
  try {
    console.log('Fetching drivers...');
    const response = await fetch('http://api.pioms.shop/admin/driver/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch drivers');
    }

    const data = await response.json();
    drivers.value = data || [];
    applyFilters();
    console.log('Drivers fetched successfully:', drivers.value);
  } catch (error) {
    console.error('Failed to fetch drivers:', error);
  }
};

const applyFilters = () => {
  filteredDrivers.value = drivers.value.filter(driver => {
    const matchesDriverName = !filterDriverName.value || driver.driverName.includes(filterDriverName.value);
    const matchesStatus = status.value === 'all' || (status.value === 'active' && driver.driverStatus) || (status.value === 'inactive' && !driver.driverStatus);
    return matchesDriverName && matchesStatus;
  });
  currentPage.value = 1;
};

const resetFilters = () => {
  filterDriverName.value = '';
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
  return filteredDrivers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredDrivers.value.length / itemsPerPage);
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
    const response = await fetch('http://api.pioms.shop/admin/exceldownload/driver-excel', {
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
    link.setAttribute('download', '배송기사리스트.xlsx');
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

const openUpdatePopup = (driverCode) => {
  selectedDriverCode.value = driverCode;
  showUpdatePopup.value = true;
  console.log('Update popup opened:', showUpdatePopup.value, 'for driver:', driverCode); // 디버깅 로그 추가
};

const closeUpdatePopup = () => {
  showUpdatePopup.value = false;
  selectedDriverCode.value = null;
  console.log('Update popup closed:', showUpdatePopup.value); // 디버깅 로그 추가
};

const showEdit = (driver) => {
  selectedDriverCode.value = driver.driverCode;
  showUpdatePopup.value = true;
};

onMounted(() => {
  fetchDrivers();
  console.log('Component mounted, fetchDrivers called.');
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
