<template>
  <div class="container">

    <div align="center"  style="padding-bottom: 30px;">
      <div style="  max-width: 1440px;justify-content: center;align-items: center;"  >
        <br>
        <div style="float: left" ><img src="@/assets/icon/Delivery.png" style="width: 18px" />&nbsp;&nbsp;
          <span class="breadcrumb">배송 기사 관리 > 배송 기사 전체 조회 및 관리</span>
        </div>
      </div>
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
          <th>이름</th>
          <th>아이디</th>
          <th>전화번호</th>
          <th>등록일</th>
          <th>수정일</th>
          <th>삭제일</th>
          <th>로그인 실패횟수</th>
          <th>상태</th>
          <th>가맹점</th>
          <th>관리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(driver, index) in paginatedLists" :key="driver.driverCode">
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
            <button @click="showEdit(driver)" class="editbutton">조회</button>
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
import { useStore } from 'vuex';
import ProductPostPopup from "@/components/admin/product/ProductPostPopup.vue";
import axios from "axios";

const store = useStore();
const accessToken = store.state.accessToken;

const drivers = ref([]);
const filteredDrivers = ref([]);
const filterDriverName = ref('');
const status = ref('all'); // 추가된 상태 필터

const currentPage = ref(1);
const itemsPerPage = 15;

const fetchDrivers = async () => {
  try {
    const response = await fetch('http://localhost:5000/admin/driver/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch delivery drivers');
    }

    const data = await response.json();
    drivers.value = data || [];
    applyFilters();
  } catch (error) {
    console.error('Failed to fetch delivery drivers:', error);
  }
};
const downloadExcel = () => {
  axios({
    url: 'http://localhost:5000/admin/exceldownload/driver-excel',
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
    link.setAttribute('download', 'DriverList.xlsx');
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.error('EBad request:', error);
  });
};
const applyFilters = () => {
  filteredDrivers.value = drivers.value.filter(driver => {
    const matchesDriverName = !filterDriverName.value || driver.driverName.includes(filterDriverName.value);
    const matchesStatus = status.value === 'all' || (status.value === 'active' && driver.driverStatus) || (status.value === 'inactive' && !driver.driverStatus);
    return matchesDriverName && matchesStatus;
  });
};

const resetFilters = () => {
  filterDriverName.value = '';
  status.value = 'all'; // 상태 필터 초기화
  applyFilters();
  currentPage.value = 1;
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

const showEdit = (driver) => {
  // Add your edit logic here
};

onMounted(() => {
  fetchDrivers();
});
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
