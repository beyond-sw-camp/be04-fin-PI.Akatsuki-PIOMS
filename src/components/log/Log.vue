<template>
  <div class="container">
    <div align="center" data-v-61061423="">
      <div class="headerTitle" align="left" style="width:1260px;margin-top:1%;" data-v-61061423=""><p
          class="product-title" data-v-61061423=""><img class="Cloth" src="/src/assets/icon/Cloth.png"
                                                        style="width:20px;height:20px;" data-v-61061423="">상품 및 상품 카테고리
        관리 &gt; 상품 관리 &gt; 상품 전체 조회 및 관리</p><h6 class="product-sub-title" style="margin-top:1%;margin-bottom:3px;"
                                                data-v-61061423=""> * 조회할 상품의 조건을 선택 후 <img
          src="/src/assets/icon/reset.png" data-v-61061423="">초기화 또는 <img src="/src/assets/icon/search.png"
                                                                          data-v-61061423="">검색을 눌러주세요. </h6></div>
    </div>
    <!-- 상단 네비게이션 -->

    <!-- 필터 섹션 -->
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">이력조건</td>
          <td class="filter-input">
            <div class="radio-group">
              <label><input type="radio" name="filterConditions" value="" v-model="filterCondition"/> 전체</label>
              <label><input type="radio" name="filterConditions" value="Company" v-model="filterCondition"/> 본사
                정보</label>
              <label><input type="radio" name="filterConditions" value="Admin" v-model="filterCondition"/> 본사
                관리자</label>
              <label><input type="radio" name="filterConditions" value="Franchise" v-model="filterCondition"/>
                가맹점</label>
              <label><input type="radio" name="filterConditions" value="FranchiseOwner" v-model="filterCondition"/> 가맹점주</label>
              <label><input type="radio" name="filterConditions" value="Product" v-model="filterCondition"/> 상품</label>
              <label><input type="radio" name="filterConditions" value="Category" v-model="filterCondition"/> 상품
                카테고리</label>
              <label><input type="radio" name="filterConditions" value="Login" v-model="filterCondition"/> 로그인
                정보</label>
            </div>
          </td>
        </tr>
        <tr>
          <td class="filter-label">이력상태</td>
          <td class="filter-input">
            <select id="filterStatus" v-model="filterStatus" title="이력 상태 선택">
              <option value="전체">전체</option>
              <option value="등록">등록</option>
              <option value="수정">수정</option>
              <option value="삭제">삭제</option>
              <option value="로그인">로그인</option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="filter-label">정보변경일</td>
          <td colspan="3" class="filter-input">
            <input type="date" id="startDate" v-model="startDate" placeholder="시작 날짜 선택" title="시작 날짜 선택">
            <span>~</span>
            <input type="date" id="endDate" v-model="endDate" placeholder="종료 날짜 선택" title="종료 날짜 선택">
          </td>
        </tr>
      </table>
    </div>

    <!-- 액션 버튼 섹션 -->
    <div align="center">
      <div class="action-buttons">
        <button @click="resetFilters" class="reset-btn">
          <img src="@/assets/icon/reset.png" alt="Reset"/>
        </button>
        <button @click="applyFilters" class="search-btn">
          <img src="@/assets/icon/search.png" alt="Search"/>
        </button>
        <br>
        <div>
          <button style="float:right;" @click="downloadExcel" class="excelBtn"><img src="@/assets/icon/excel.png"
                                                                                    alt="excel"></button>
        </div>
      </div>
    </div>
    <div class="post-btn">
    </div>
    <!-- 이력 조회 결과 -->
    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th>No</th>
          <th>이력변경자</th>
          <th>이력내용</th>
          <th>변경일</th>
          <th>이력상태</th>
          <th>이력대상</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(history, index) in paginatedHistories" :key="history.logCode" class="allpost">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ history.logChanger }}</td>
          <td @dblclick="showPopup(history.logContent)">{{ history.logContent }}</td>
          <td>{{ formatDate(history.logDate) }}</td>
          <td>{{ history.logStatus }}</td>
          <td>{{ history.logTarget }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>

    <!-- 팝업 -->
    <div v-if="popupVisible" class="popup-overlay" @click="closePopup">
      <div class="popup-content" @click.stop>
        <h2>이력 내용</h2>
        <p class="popup-text">{{ popupContent }}</p>
        <button @click="closePopup">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import Breadcrumb from '@/components/admin/ask/Breadcrumb.vue'; // Breadcrumb 컴포넌트 임포트
import {useStore} from 'vuex';
import axios from "axios";

const store = useStore();
const accessToken = store.state.accessToken;

const histories = ref([]);
const filteredHistories = ref([]);
const filterCondition = ref('');
const filterStatus = ref('전체');
const startDate = ref('');
const endDate = ref('');

const currentPage = ref(1);
const itemsPerPage = 15;

const breadcrumbs = [
  {label: '통계 및 이력 관리', link: null},
  {label: '이력 관리', link: null},
];

const downloadExcel = () => {
  axios({
    url: 'http://localhost:5000/admin/exceldownload/log-excel', // 백엔드 엑셀 다운로드 API 엔드포인트
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    responseType: 'blob', // 서버에서 반환되는 데이터의 형식을 명시
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data], {type: response.headers['content-type']}));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'LogList.xlsx'); // 원하는 파일 이름 설정
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.error('Bad request:', error);
  });
};

const fetchHistories = async () => {
  try {
    const response = await fetch('http://localhost:5000/admin/log', {
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
    // 변경일 기준으로 최신순 정렬
    data.sort((a, b) => new Date(b.logDate) - new Date(a.logDate));
    histories.value = data || [];
    histories.value.sort((a, b) => new Date(b.logDate) - new Date(a.logDate)); // 날짜 최신순 정렬
    filteredHistories.value = histories.value;
    applyFilters();
  } catch (error) {
    console.error('Failed to fetch histories:', error);
  }
};

const applyFilters = () => {
  filteredHistories.value = histories.value.filter(history => {
    const matchesCondition = !filterCondition.value || history.logTarget === filterCondition.value || (filterCondition.value === "Category" && (history.logTarget === "CategoryFirst" || history.logTarget === "CategorySecond" || history.logTarget === "CategoryThird"));
    const matchesStatus = filterStatus.value === '전체' || history.logStatus === filterStatus.value;
    const historyDate = new Date(history.logDate);
    const matchesStartDate = !startDate.value || historyDate >= new Date(startDate.value);
    const matchesEndDate = !endDate.value || historyDate <= new Date(endDate.value);

    return matchesCondition && matchesStatus && matchesStartDate && matchesEndDate;
  });
};

const resetFilters = () => {
  filterCondition.value = '';
  filterStatus.value = '전체';
  startDate.value = '';
  endDate.value = '';
  filteredHistories.value = histories.value;
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

const paginatedHistories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredHistories.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredHistories.value.length / itemsPerPage);
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

const popupVisible = ref(false);
const popupContent = ref('');

const showPopup = (content) => {
  popupContent.value = content;
  popupVisible.value = true;
};

const closePopup = () => {
  popupVisible.value = false;
};

onMounted(() => {
  fetchHistories();
});
</script>

<style scoped>
.excelBtn {
  width: 100px;
  height: 26px;
  border: none;
  background-color: white;
  padding-bottom: 36px;
  padding-left: initial;
  cursor: pointer;
}

.container {
  padding: 20px;
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
}

.filter-label {
  font-weight: bold;
  text-align: center;
  width: 100px;
  background-color: #D9D9D9;
}

.filter-input {
  text-align: left;
  border: 1px solid lightgray;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
}

.radio-group label {
  margin-right: 10px;
  white-space: nowrap;
}

.date-range span {
  margin: 0 5px;
}

.action-buttons {
  max-width: 1300px;
  justify-content: center; /* 가운데 정렬 */
  //margin-bottom: 20px;
  align-items: center;
}

.reset-btn, .search-btn {
  background-color: #fff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 8px;
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
  text-align: center;
}

.table th,
.table td {
  width: 150px; /* 모든 열의 기본 크기를 고정 */
}

.table .historyContent {
  cursor: pointer;
  width: 200px; /* 이력내용 칸의 크기를 고정 */
}

.header1 {
  background-color: #D9D9D9;
  font-weight: bold;
  height: 50px;
  font-size: 12px;
  text-align: center;
}

.allpost {
  text-align: center;
  padding: 10px 0;
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

/* 팝업 스타일 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 40%;
  height: 28%;
  overflow-y: auto;
  text-align: center;
  padding-top: 10px;
}

.popup-text {
  font-size: 20px;
  white-space: pre-wrap;
  padding-top: 30px;
}

.popup-content button {
  position: relative;
  top: 60px;
  align-content: center;
  background-color: #FF6285;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 15px;
}

.table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 19ch;
  max-width: 19ch; /* 최대 25글자까지 표시 */
  cursor: default;
}

.table .historyContent {
  cursor: pointer;
}
</style>
