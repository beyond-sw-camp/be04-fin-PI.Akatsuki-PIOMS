<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/icon/가맹점.png" style="width: 18px"/>&nbsp;
      <span class="breadcrumb">가맹점 및 직원 관리 > 가맹점 및 점주 관리 > 가맹점 및 점주 전체조회</span>
    </div>

    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">키워드 검색</td>
          <td class="filter-input">
            <select v-model="keyword">
              <option value="franchiseName">지점명</option>
              <option value="franchiseOwnerName">점주명</option>
              <option value="adminName">담당 관리자</option>
            </select>
            &nbsp;
            <input type="text" placeholder="검색어를 입력해주세요" v-model="searchText" />
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

      <div class="filter-buttons">
        <button @click="resetFilters" class="reset-btn">
          <img src="@/assets/icon/reset.png" alt="Reset" />
        </button>
        <button @click="applyFilters" class="search-btn">
          <img src="@/assets/icon/search.png" alt="Search" />
        </button>
      </div>
    </div>

    <div class="ExNregi">
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
          <th>지점명</th>
          <th>점주명</th>
          <th>담당 관리자</th>
          <th>주소</th>
          <th>전화번호</th>
          <th>등록일</th>
          <th>수정일</th>
          <th>삭제일</th>
          <th>사업자번호</th>
          <th>배송일</th>
          <th>배송기사</th>
          <th>상태</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(franchise, index) in paginatedFranchises" :key="franchise.franchiseCode">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ franchise.franchiseName }}</td>
          <td>{{ franchise.franchiseOwnerName }}</td>
          <td>{{ franchise.adminName }}</td>
          <td>{{ franchise.franchiseAddress }}</td>
          <td>{{ franchise.franchiseCall }}</td>
          <td>{{ formatDate(franchise.franchiseEnrollDate) }}</td>
          <td>{{ formatDate(franchise.franchiseUpdateDate) }}</td>
          <td>{{ formatDate(franchise.franchiseDeleteDate) }}</td>
          <td>{{ franchise.franchiseBusinessNum }}</td>
          <td>{{ franchise.franchiseDeliveryDate }}</td>
          <td>{{ franchise.deliveryDriverName }}</td>
          <td>{{ franchise.franchiseDeleteDate ? '비활성화' : '활성화' }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" style="margin-bottom: 100px">
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

const store = useStore();
const franchises = ref([]);
const filteredFranchises = ref([]);
const keyword = ref('franchiseName');
const searchText = ref('');
const status = ref('all');

const currentPage = ref(1);
const itemsPerPage = 15;

const fetchFranchises = async () => {
  try {
    const accessToken = store.state.accessToken;
    const userRole = store.state.userRole;
    const userId = store.state.userCode;

    const response = await fetch(`http://localhost:5000/admin/franchise/list?role=${userRole}&userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    franchises.value = data.map(franchise => ({
      franchiseCode: franchise.franchiseCode,
      franchiseName: franchise.franchiseName,
      franchiseAddress: franchise.franchiseAddress,
      franchiseCall: franchise.franchiseCall,
      franchiseEnrollDate: franchise.franchiseEnrollDate,
      franchiseUpdateDate: franchise.franchiseUpdateDate,
      franchiseDeleteDate: franchise.franchiseDeleteDate,
      franchiseBusinessNum: franchise.franchiseBusinessNum,
      franchiseDeliveryDate: franchise.franchiseDeliveryDate,
      franchiseOwnerName: franchise.franchiseOwner ? franchise.franchiseOwner.franchiseOwnerName : '-',
      deliveryDriverName: franchise.deliveryDriver ? franchise.deliveryDriver.driverName : '-',
      adminName: franchise.adminName
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
  filteredFranchises.value = franchises.value.filter(franchise => {
    const matchesKeyword = !searchText.value || franchise[keyword.value]?.includes(searchText.value);
    const matchesStatus = status.value === 'all' || (status.value === 'active' ? !franchise.franchiseDeleteDate : franchise.franchiseDeleteDate);
    return matchesKeyword && matchesStatus;
  });
  currentPage.value = 1;
};

const resetFilters = () => {
  keyword.value = 'franchiseName';
  searchText.value = '';
  status.value = 'all';
  applyFilters();
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
  height: 40px;
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
