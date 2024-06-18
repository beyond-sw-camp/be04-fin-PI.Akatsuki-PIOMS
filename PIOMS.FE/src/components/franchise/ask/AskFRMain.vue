<template>
  <div class="container">
    <div class="header" align="center" style="padding-bottom: 30px;">
      <div style="  max-width: 1440px;justify-content: center;align-items: center;">
        <br>
        <div style="float: left"><img src="@/assets/icon/문의사항.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">공지 및 문의 관리 &gt; 문의 관리 &gt; 문의사항 관리 및 조회</span>
        </div>
      </div>
    </div>

    <div class="product-sub-title"> * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png">초기화 또는<img src="@/assets/icon/search.png">검색을 눌러주세요.
    </div>

  <div class="container">
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
        <button @click="showCreate" class="postBtn">
          <img src="@/assets/icon/문의사항등록.png" alt="postProduct">
        </button>
        <button class="excelBtn">
        </button>
      </div>
    </div>

    <div class="table-container">

      <table class="table">
        <thead>
        <tr class="header1">
          <th width="4%">No</th>
          <th width="4%">문의상태</th>
          <th width="30%">문의제목</th>
          <th width="4%">작성자</th>
          <th>등록일</th>
          <th>수정일</th>
          <th>답변일</th>
          <th width="10%">관리</th>
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
                @click="ask.askStatus === '답변대기' ? showEdit(ask) : showView(ask)"
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
  <Create v-if="createPopup" @refreshData="refreshData" :closeCreate="closeCreate"/>
  <Edit v-if="editPopup" @refreshData="refreshData" :askCode="askCode" :closeEdit="closeEdit"/>
  <View v-if="viewPopup" @refreshData="refreshData" :askCode="askCode" :closeView="closeView"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Create from './AskFormCreate.vue';
import Edit from './AskFormEdit.vue';
import View from './AskFormView.vue';
import Breadcrumb from '@/components/admin/ask/Breadcrumb.vue';
import { useStore } from 'vuex';

const store = useStore();
const accessToken = store.state.accessToken;
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

const fetchAsks = async () => {
  try {
    const response = await fetch(`http://api.pioms.shop/franchise/asklist`, {
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
    const matchesStartDate = !startDate.value || new Date(...ask.askEnrollDate) >= new Date(startDate.value);
    const matchesEndDate = !endDate.value || new Date(...ask.askEnrollDate) <= new Date(endDate.value);
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

const askCode = ref(null);
const createPopup = ref(false);
const editPopup = ref(false);
const viewPopup = ref(false);

const showCreate = () => {
  createPopup.value = true;
}

const showEdit = (ask) => {
  editPopup.value = !editPopup.value;
  askCode.value = ask.askCode;
}

const showView = (ask) => {
  viewPopup.value = !viewPopup.value;
  askCode.value = ask.askCode;
}

const closeCreate = () => {
  createPopup.value = false;
}

const closeEdit = () => {
  editPopup.value = !editPopup.value;
}

const closeView = () => {
  viewPopup.value = !viewPopup.value;
}

onMounted(() => {
  fetchAsks();
});

const refreshData = () => {
  fetchAsks(); // 데이터를 새로고침
};
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

</style>
