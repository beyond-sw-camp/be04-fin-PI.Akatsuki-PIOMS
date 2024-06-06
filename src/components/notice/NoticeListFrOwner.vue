<template>
  <div class = "main">

    <br/>
    <div align="center">
      <table class="read-filter">
        <tr>
          <td class="filter-label">공지 조회 조건</td>
          <td class="filter1">
            <select class="filter-section" v-model="filterType">
              <option value="all">전체</option>
              <option value="content">내용</option>
              <option value="title">제목</option>
            </select>

            <input type="text" class="filter-input" placeholder="검색어를 입력해주세요." v-model="filterText" />
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
    </div>

    <!-- 리셋, 검색 버튼 -->
    <div class="button-container">
      <button type="button" class="btn-reset" @click="resetFilters">
        <img class="reset" src="@/assets/icon/reset.png" />
      </button>
      <button type="button" class="btn-search" @click="applyFilters">
        <img class="search" src="@/assets/icon/search.png" />
      </button>
    </div>
  </div>

    <!-- 공지사항 목록 -->
    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <td>No</td>
          <td>제목</td>
          <td>내용</td>
          <td>등록일</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in paginatedLists" :key="item.noticeCode"
            :id="'row-' + rowIndex"
            class="allpost"
        >
          <td class="num">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
          <td style="width: 20%" @click="showDetailsNoticePopup(item)">{{ item.noticeTitle }}</td>
          <td style="width: 50%">{{ item.noticeContent }}</td>
          <td>{{ item.noticeEnrollDate }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 공지사항 상세 정보 팝업 -->
    <NoticeDetailsPopup v-if="viewPopup && selectedNotice" :notice="selectedNotice" @close="closeDetailsPopup" />

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NoticeDetailsPopup from '@/components/notice/NoticeDetailsPopup.vue';
import { useStore } from 'vuex';

const highlightRow = (index) => {
  document.querySelector(`#row-${index}`).classList.add('highlighted');
};
const resetRowColor = (index) => {
  document.querySelector(`#row-${index}`).classList.remove('highlighted');
};

const store = useStore();
const accessToken = store.state.accessToken;
const lists = ref([]);
const headers = ref([
  { label: 'No' },
  { key: 'noticeTitle', label: '공지사항 제목' },
  { key: 'noticeContent', label: '공지사항 내용' },
  { key: 'noticeEnrollDate', label: '등록일' }
]);

const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;

const getNotice = async () => {
  try {
    const response = await fetch('http://localhost:5000/franchise/notice/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('네트워크 오류 발생');
    }

    const data = await response.json();
    if (data.length > 0) {
      lists.value = data;
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
        (filterType.value === 'all' && notice.noticeTitle.includes(filterText.value) || notice.noticeContent.includes(filterText.value)) ||
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

const showDetailsNoticePopup = (item) => {
  selectedNotice.value = item;
  viewPopup.value = true;
};

const closeDetailsPopup = () => {
  viewPopup.value = false;
};

const viewPopup = ref(false);

const sortedNotices = computed(() => {
  return notices.value.slice().sort((a, b) => {
    return new Date(b.noticeEnrollDate) - new Date(a.noticeEnrollDate);
  });
});

onMounted(() => {
  getNotice();
});
</script>

<style scoped>
@import "../../assets/css/order.css" ;

.modify,
.delete {
  color: #ffffff;
  font-weight: bold;
  border-radius: 5px;
  border: 0;
  width: 50px;
}

.modify {
  background-color: #999999;
}
.delete {
  background-color: #FC6F86;
}
.table-td button {
  border: none;
  background-color: #ffffff;
}
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
  width: 1300px;
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

.table-container {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}




.notice-list {
  width: 1600px;
}
.notice-list tr td {
  text-align: center;
}
.notice-list thead tr td {
  background-color: #d9d9d9;
  font-weight: bold;
}

.notice-table th,
.notice-table td {
  padding: 10px;
  font-size: 14px;
  color: #444444;
}

.notice-table th {
  background-color: #d9d9d9;
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

notice-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 700px; /* 팝업의 최대 너비 */
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

.button-container {
  display: flex;
  justify-content: center; /* 버튼을 왼쪽에 정렬 */
  align-items: center; /* 버튼을 수직 가운데에 정렬 */
  gap: 10px; /* 버튼 사이의 간격을 설정 */
}
.notice-btn-container{
  display: flex;
  justify-content: center; /* 버튼을 왼쪽에 정렬 */
  align-items: center; /* 버튼을 수직 가운데에 정렬 */
}

.btn-saveNotice {

  display: flex;
  position: relative;
  //left: 10px;
  height: 35px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  border-color: #344DAF;
  background-color: #344DAF;
  color: #ffffff;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0;
  margin-bottom: 10px;
  width: 115px;

}

.btn-saveNotice:hover {
  background-color: #9a9a9a;
  color: #ffffff;
}

.btn-reset,
.btn-search {
  border: none;
  background-color: #ffffff;
}

.reset,
.search {
  width: 40px;
  height: 40px;
  justify-content: center;
  border: none;
  background-color: #ffffff;
}

</style>