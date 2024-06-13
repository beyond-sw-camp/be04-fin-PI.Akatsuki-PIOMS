<template>
  <div class="container">
    <div class="header" align="center"  style="padding-bottom: 30px;">
      <div style="  max-width: 1440px;justify-content: center;align-items: center;"  >
        <br>
        <div style="float: left" ><img src="@/assets/icon/이력관리.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">이력 관리 > 전체 이력 관리</span>
        </div>
      </div>
    </div>

    <div class="product-sub-title"> * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png">초기화 또는<img src="@/assets/icon/search.png">검색을 눌러주세요.
    </div>

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
        <button class="postBtn">
        </button>
        <button @click="downloadExcel" class="excelBtn">
          <img src="@/assets/icon/excel.png" alt="excel">
        </button>
      </div>
    </div>

    <!-- 이력 조회 결과 -->
    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th width="4%">No</th>
          <th width="10%">이력변경자</th>
          <th>이력내용</th>
          <th width="10%">변경일</th>
          <th width="10%">이력상태</th>
          <th width="10%">이력대상</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(history, index) in paginatedHistories" :key="history.logCode" class="tr__bd">
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
    url: 'http://api.pioms.shop/admin/exceldownload/log-excel', // 백엔드 엑셀 다운로드 API 엔드포인트
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
    const response = await fetch('http://api.pioms.shop/admin/log', {
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
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 팝업 오버레이의 z-index 설정 */
}

.popup-content {
  width:500px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.popup-text {
  white-space: pre-wrap;
  margin-bottom: 20px;
}

.popup-content button {
  align-self: center;
}
</style>
