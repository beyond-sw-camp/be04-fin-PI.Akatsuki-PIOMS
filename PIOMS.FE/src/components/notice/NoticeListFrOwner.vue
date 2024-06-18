<template>
  <div class="container">
    <div class="header" align="center" style="padding-bottom: 30px;">
      <div style="  max-width: 1440px;justify-content: center;align-items: center;">
        <br>
        <div style="float: left"><img src="@/assets/icon/공지사항.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">공지 및 문의 관리 &gt; 공지사항 &gt; 공지사항 목록</span>
        </div>
      </div>
    </div>

    <div class="product-sub-title"> * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png">초기화 또는<img src="@/assets/icon/search.png">검색을 눌러주세요.
    </div>


    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">공지 조회 조건</td>
          <td class="filter-input">
            <select class="filter-section" v-model="filterType" style="width: 100px">
              <option disabled value="">선택</option>
              <option value="all">전체</option>
              <option value="content">내용</option>
              <option value="title">제목</option>
            </select>
            <input type="text" class="filter-input" placeholder="검색어를 입력해주세요." v-model="filterText"/>
          </td>
        </tr>
        <tr>
          <td class="filter-label">등록일</td>
          <td colspan="3" class="filter-input">
            <input type="date" id="startDate" v-model="startDate" placeholder="시작 날짜 선택" title="시작 날짜 선택"/>
            &nbsp;&nbsp;<span>~</span>&nbsp;
            <input type="date" id="endDate" v-model="endDate" placeholder="종료 날짜 선택" title="종료 날짜 선택"/>
          </td>
        </tr>
      </table>
      <div class="filter-buttons">
        <button @click="resetFilters" class="reset-btn">
          <img src="@/assets/icon/reset.png" alt="Reset"/>
        </button>
        <button @click="applyFilters" class="search-btn">
          <img src="@/assets/icon/search.png" alt="Search"/>
        </button>
      </div>
    </div>
    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <td width="4%">No</td>
          <td width="20%">제목</td>
          <td width="55%">내용</td>
          <td>등록일</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in paginatedLists" :key="item.noticeCode"
            :id="'row-' + rowIndex"
            class="tr__bd"
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
    <NoticeDetailsPopup v-if="viewPopup && selectedNotice" :notice="selectedNotice" @close="closeDetailsPopup"/>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import NoticeDetailsPopup from '@/components/notice/NoticeDetailsPopup.vue';
import {useStore} from 'vuex';

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
  {label: 'No'},
  {key: 'noticeTitle', label: '공지사항 제목'},
  {key: 'noticeContent', label: '공지사항 내용'},
  {key: 'noticeEnrollDate', label: '등록일'}
]);

const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;

const getNotice = async () => {
  try {
    const response = await fetch('http://api.pioms.shop/franchise/notice/list', {
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
      lists.value = data.sort((a, b) => new Date(b.noticeEnrollDate) - new Date(a.noticeEnrollDate));
      filteredLists.value = lists.value;
    } else {
      lists.value = [];
      filteredLists.value = [];
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
};

// lists.value = noticeList.sort((a, b) => new Date(b.noticeEnrollDate) - new Date(a.noticeEnrollDate));
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

onMounted(() => {
  getNotice();
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
.condition-button {
  display: inline-block;
  padding: 2px 5px; /* 최소한의 패딩으로 글씨 영역만큼만 색이 적용되도록 합니다 */
  border-radius: 3px;
  color: #fff;
  font-weight: bold;
}

</style>
