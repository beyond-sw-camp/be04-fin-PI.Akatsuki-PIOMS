<template>
  <div>
    <div class="container">
      <img class="notice" src="@/assets/icon/List.png" />
      <span class="F-title">공지 및 문의 관리&nbsp;&nbsp;></span>
      <span class="F-title">공지사항 관리&nbsp;&nbsp;></span>
      <span class="F-title">공지사항 조회 관리</span>
    </div>

    <br />
    <table class="read-filter">
      <tr>
        <td class="filter-label">공지 조회 조건</td>
        <td class="filter1">
          <select class="filter-section" v-model="filterType">
            <option value="">전체</option>
            <option value="content">내용</option>
            <option value="title">제목</option>
          </select>

          <input type="text" class="filter-input" placeholder="검색어를 입력하세요." v-model="filterText" />
        </td>
      </tr>
      <tr>
        <td class="filter-label">등록일</td>
        <td colspan="3" class="filter-date">
          <input type="date" id="startDate" v-model="startDate" placeholder="시작 날짜 선택" title="시작 날짜 선택" />
          &nbsp;&nbsp;<span>~</span>&nbsp;
          <input type="date" id="endDate" v-model="endDate" placeholder="종료 날짜 선택" title="종료 날짜 선택" />
        </td>
      </tr>
    </table>

    <!-- 리셋, 검색 버튼 -->
    <div class="button-container">
      <button type="button" class="btn-reset" @click="resetFilters">
        <img class="reset" src="@/assets/icon/reset.png" />
      </button>
      <button type="button" class="btn-search" @click="applyFilters">
        <img class="search" src="@/assets/icon/search.png" />
      </button>
    </div>

    <!-- 공지사항 등록 버튼 -->
    <button type="button" class="btn-saveNotice" :class="{ 'btn-saveNotice-pending': isFormVisible }" @click="toggleForm">
      공지사항 등록
    </button>

    <!-- 오버레이 -->
    <div v-if="isFormVisible" class="overlay" @click="toggleForm"></div>

    <!-- 공지사항 등록 및 수정 폼 팝업 -->
    <div v-if="isFormVisible" class="notice-form">
      <h2>{{ isEditMode ? '공지사항 수정' : '공지사항 작성' }}</h2>
      <form @submit.prevent="submitNotice">
        <div>
          <label for="noticeTitle">제목</label>
          <input type="text" id="noticeTitle" v-model="newNotice.noticeTitle" required />
        </div>
        <div>
          <label for="noticeContent">내용</label>
          <textarea id="noticeContent" v-model="newNotice.noticeContent" required></textarea>
        </div>
        <button type="submit">{{ isEditMode ? '수정' : '등록' }}</button>
        <button type="button" @click="toggleForm">취소</button>
      </form>
    </div>

    <!-- 공지사항 목록 -->
    <table class="data-table">
      <thead>
      <tr>
        <th v-for="header in headers" :key="header.key">{{ header.label }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in paginatedLists" :key="item.noticeCode">
        <td v-for="(header, colIndex) in headers" :key="colIndex" class="table-td">
          <button v-if="header.key === 'noticeTitle'" @click="showDetailsNoticePopup(item)"> {{ item[header.key] }} </button>
        </td>
        <td>{{ item.noticeCode }}</td>
        <td>{{ item.noticeTitle }}</td>
        <td>{{ item.noticeContent }}</td>
        <td>{{ formatDate(item.noticeEnrollDate) }}</td>
        <td>
          <button @click="toggleForm(true, item)">수정</button>
          <button @click="deleteNotice(item.noticeCode)">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 공지사항 상세 정보 팝업 -->
    <div v-if="isDetailPopupVisible" class="overlay">
      <div class="notice-form">
        <button class="close-btn" @click="closeDetailsPopup">X</button>
        <h2>공지사항 상세 정보</h2>
        <form>
          <div>
            <label for="detailTitle">제목</label>
            <input type="text" id="detailTitle" v-model="selectedNotice.noticeTitle" disabled />
          </div>
          <div>
            <label for="detailContent">내용</label>
            <textarea id="detailContent" v-model="selectedNotice.noticeContent" disabled></textarea>
          </div>
        </form>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';

const lists = ref([]);
const headers = ref([
  { key: 'noticeCode', label: '공지사항 코드' },
  { key: 'noticeTitle', label: '공지사항 제목' },
  { key: 'noticeContent', label: '공지사항 내용' },
  { key: 'noticeEnrollDate', label: '등록일' }
]);

const isDetailsPopupVisible = ref(false);
const selectedNotice = ref({});

const showDetailsNoticePopup = (notice) => {
  selectedNotice.value = notice;
  isDetailsPopupVisible.value = true;
};

const closeDetailsPopup = () => {
  isDetailsPopupVisible.value = false;
};

const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;

const getNotice = async () => {
  try {
    const response = await fetch('http://api.pioms.shop/admin/notice/list', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('네트워크 오류 발생');
    }

    const data = await response.json();
    if (data.length > 0) {
      lists.value = data.map(({ notice, ...rest }) => rest);
      filteredLists.value = lists.value;
    } else {
      lists.value = [];
      filteredLists.value = [];
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
};

const filterType = ref('');
const filterText = ref('');
const startDate = ref('');
const endDate = ref('');

const applyFilters = () => {
  filteredLists.value = lists.value.filter(notice => {
    const matchesFilterType =
        filterType.value === '' ||
        (filterType.value === 'title' && notice.noticeTitle.includes(filterText.value)) ||
        (filterType.value === 'content' && notice.noticeContent.includes(filterText.value));
    const matchesStartDate =
        !startDate.value || new Date(notice.noticeEnrollDate) >= new Date(startDate.value);
    const matchesEndDate =
        !endDate.value || new Date(notice.noticeEnrollDate) <= new Date(endDate.value);

    return matchesFilterType && matchesStartDate && matchesEndDate;
  });
  currentPage.value = 1; // 필터 적용 후 페이지를 첫 페이지로 설정
};

const paginatedLists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredLists.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredLists.value.length / itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const resetFilters = () => {
  filterType.value = '';
  filterText.value = '';
  startDate.value = '';
  endDate.value = '';
  applyFilters(); // 필터 초기화 후 다시 필터 적용
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const isFormVisible = ref(false);
const isEditMode = ref(false);
const newNotice = ref({
  noticeCode: '',
  noticeTitle: '',
  noticeContent: '',
});

const toggleForm = (isEdit = false, notice = {}) => {
  isFormVisible.value = !isFormVisible.value;
  isEditMode.value = isEdit;

  if (isEdit) {
    newNotice.value.noticeCode = notice.noticeCode;
    newNotice.value.noticeTitle = notice.noticeTitle;
    newNotice.value.noticeContent = notice.noticeContent;
  } else {
    newNotice.value.noticeCode = '';
    newNotice.value.noticeTitle = '';
    newNotice.value.noticeContent = '';
  }
};

const submitNotice = async () => {
  try {
    const method = isEditMode.value ? 'PUT' : 'POST';
    const url = isEditMode.value
        ? `http://api.pioms.shop/admin/notice/list/update/${newNotice.value.noticeCode}?requesterAdminCode=1`
        : 'http://api.pioms.shop/admin/notice/list/register?requesterAdminCode=1';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNotice.value),
    });

    if (!response.ok) {
      throw new Error(isEditMode.value ? '공지사항 수정 실패' : '공지사항 등록 실패');
    }

    alert(isEditMode.value ? '공지사항이 수정되었습니다.' : '공지사항이 등록되었습니다.');
    toggleForm();
    getNotice();
  } catch (error) {
    console.error('공지사항 처리 오류:', error);
  }
};

const deleteNotice = async (noticeCode) => {
  try {
    const response = await fetch(`http://api.pioms.shop/admin/notice/list/delete/${noticeCode}?requesterAdminCode=1`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('공지사항 삭제 실패');
    }

    alert('공지사항이 삭제되었습니다.');
    getNotice();
  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
  }
};

getNotice();
</script>

<style>
/* 공통 스타일 */
.container {
display: flex;
align-items: center;
justify-content: flex-start;
max-width: 800px;
margin-left: 5px;
padding: 20px;
position: relative;
top: 10px;
}

.F-title {
margin-right: 10px;
font-weight: bold;
font-size: 20px;
position: relative;
top: 2px;
}

.notice {
margin-right: 10px;
}

.read-filter {
margin-bottom: 20px;
background-color: #ffffff;
border: 1px solid #D9D9D9;
border-radius: 5px;
padding: 10px;
width: 1600px;
}

.read-filter td {
border: none;
}

.filter-label,
.filter1,
.filter-date {
cursor: default;
}

.filter-label {
font-size: 16px;
text-align: center;
width: 120px;
height: 60px;
font-weight: bold;
background-color: #D9D9D9;
color: #444444;
}

.filter-section {
display: flex;
align-items: center;
justify-content: center;
width: 100px;
height: 52px;
font-size: 14px;
margin-bottom: 0;
border-color: #d9d9d9;
}

.filter-input {
width: 400px;
height: 30px;
padding: 10px;
margin-left: 20px;
border-right: 1px solid #d9d9d9;
}

.filter1 {
font-size: 14px;
display: flex;
justify-content: flex-start;
margin-left: 10px;
position: relative;
top: 4px
}

.filter-input,
.filter-section {
font-size: 16px;
}

.filter-date {
border-top: 1px solid #D9D9D9 !important;
border-color: #d9d9d9;
}

.notice-table {
width: 1600px;
border-collapse: collapse;
}

.notice-table th,
.notice-table td {
padding: 10px;
text-align: center;
font-size: 14px;
color: #444444;
}

.notice-table th {
background-color: #f2f2f2;
}

.notice-table td {
position: relative;
top:5px;
}

/* 팝업 */
.overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}

.notice-form {
background: white;
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
max-width: 500px; /* 팝업의 최대 너비 */
}

.notice-form h2 {
margin-bottom: 16px;
}

.notice-form form div {
margin-bottom: 12px;
}

.notice-form input,
.notice-form textarea {
width: calc(100% - 20px); /* 팝업의 패딩 값 제외한 너비 */
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
}

.notice-form button {
padding: 8px 12px;
margin-right: 8px;
border: none;
background: #007bff;
color: white;
cursor: pointer;
border-radius: 4px;
}

.notice-form button[type="button"] {
background: #6c757d;
}

.notice-form button:disabled {
background: #ccc;
cursor: not-allowed;
}

#startDate,
#endDate {
width: 170px;
height: 30px;
font-size: 16px;
padding: 10px;
margin-left: 10px;
border: 1px solid #d9d9d9;
color: #444444;
}

.btn-reset {
background-color: transparent;
border: none;
cursor: pointer;
padding: 10px;
font-size: 18px;
}
.btn-search {
border: none;
background-color: #ffffff;
}

.button-container {
display: flex;
justify-content: center; /* 버튼을 왼쪽에 정렬 */
align-items: center; /* 버튼을 수직 가운데에 정렬 */
gap: 10px; /* 버튼 사이의 간격을 설정 */
}

.notice-list {
border: none;
}

.list1 {
width: 120px;
}

.btn-saveNotice {
display: flex;
width: 100px;
height: 30px;
font-size: 14px;
font-weight: bold;
text-align: center;
border-radius: 5px;
border-color: #344DAF;
background-color: #344DAF;
color: #ffffff;
justify-content: center;
align-items: center;
cursor: pointer;
border: 0;
}

.btn-saveNotice:hover {
background-color: #9a9a9a;
color: #ffffff;
}

.reset,
.search {
width: 40px;
height: 40px;
justify-content: center;
border: none;
}

/* 팝업에서 닫기 버튼 */
.close-btn {
position: absolute;
top: 10px;
right: 10px;
font-size: 20px;
color: #333;
background: transparent;
border: none;
cursor: pointer;
}

.close-btn:hover {
color: #999;
}

</style>