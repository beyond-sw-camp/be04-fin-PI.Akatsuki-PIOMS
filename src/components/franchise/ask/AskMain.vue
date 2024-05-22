<template>
  <div>
    <!-- Breadcrumb 컴포넌트 추가 -->
    <Breadcrumb :crumbs="breadcrumbs" />

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
          <td class="filter-label">가맹점명</td>
          <td class="filter-input">
            <select id="selectedFranchise" v-model="selectedFranchise" title="가맹점명 선택">
              <option value="">가맹점명</option>
              <option v-for="franchise in franchises" :key="franchise.code" :value="franchise.name">
                {{ franchise.name }}
              </option>
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
    </div>
    <div class="action-buttons">
      <button @click="resetFilters" class="reset-btn">
        <img src="@/assets/icon/reset.png" alt="Reset" />
      </button>
      <button @click="applyFilters" class="search-btn">
        <img src="@/assets/icon/search.png" alt="Search" />
      </button>
    </div>
    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th>No</th>
          <th>문의상태</th>
          <th>문의제목</th>
          <th>작성자</th>
          <th>가맹점명</th> <!-- 추가된 부분 -->
          <th>등록일</th>
          <th>수정일</th>
          <th>답변일</th>
          <th>관리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(ask, index) in filteredAsks" :key="ask.askCode" class="allpost">
          <td class="num">{{ index + 1 }}</td>
          <td>{{ ask.askStatus }}</td>
          <td class="boardname">{{ ask.askTitle }}</td>
          <td>{{ ask.franchiseOwnerName }}</td>
          <td>{{ ask.franchiseName }}</td> <!-- 추가된 부분 -->
          <td>{{ formatDate(ask.askEnrollDate) }}</td>
          <td>{{ formatDate(ask.askUpdateDate) }}</td>
          <td>{{ formatDate(ask.askCommentDate) }}</td>
          <td>
            <button
                class="editbutton"
                :class="{ 'editbutton-pending': ask.askStatus === '답변대기' }"
                @click="ask.askStatus === '답변대기' ? registerAnswer(ask.askCode) : editAnswer(ask.askCode)"
            >
              {{ ask.askStatus === '답변대기' ? '답변 작성' : '답변 조회' }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import Breadcrumb from '@/components/franchise/ask/Breadcrumb.vue'; // Breadcrumb 컴포넌트 임포트

const asks = ref([]);
const filteredAsks = ref([]);
const filterStatus = ref('전체');
const startDate = ref('');
const endDate = ref('');
const selectedFranchise = ref('');

const breadcrumbs = [
  {label: '공지 및 문의 관리', link: '/notice'},
  {label: '문의사항 관리', link: '/notice/inquiry'},
  {label: '문의사항 조회 및 관리', link: null},
];

const franchises = ref([
  {code: 1, name: 'PIOMS 신사점'},
  {code: 2, name: 'PIOMS 강남점'},
  {code: 3, name: 'PIOMS 더현대서울점'},
  {code: 4, name: 'PIOMS 홍대점'},
  {code: 5, name: 'PIOMS 성수점'},
  {code: 6, name: 'PIOMS 논현점'},
]);

const fetchAsks = async () => {
  try {
    const response = await axios.get('http://localhost:9000/admin/ask/list');
    asks.value = response.data.asks || response.data.askDTOs || [];
    filteredAsks.value = asks.value;
  } catch (error) {
    console.error('Failed to fetch asks:', error);
  }
};

const applyFilters = () => {
  filteredAsks.value = asks.value.filter(ask => {
    const matchesStatus = filterStatus.value === '전체' || ask.askStatus === filterStatus.value;
    const matchesFranchise = !selectedFranchise.value || ask.franchiseName === selectedFranchise.value; // 필터 조건 수정
    const matchesStartDate = !startDate.value || new Date(ask.askEnrollDate[0], ask.askEnrollDate[1] - 1, ask.askEnrollDate[2]) >= new Date(startDate.value);
    const matchesEndDate = !endDate.value || new Date(ask.askEnrollDate[0], ask.askEnrollDate[1] - 1, ask.askEnrollDate[2]) <= new Date(endDate.value);

    return matchesStatus && matchesFranchise && matchesStartDate && matchesEndDate;
  });
};

const resetFilters = () => {
  filterStatus.value = '전체';
  startDate.value = '';
  endDate.value = '';
  selectedFranchise.value = '';
  filteredAsks.value = asks.value;
};

const formatDate = (dateArray) => {
  if (!dateArray || dateArray.length === 0) return '날짜 없음';
  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const openAnswerForm = (askCode, mode) => {
  const width = 800;
  const height = 600;
  const left = (window.screen.width / 2) - (width / 2);
  const top = (window.screen.height / 2) - (height / 2);
  const url = `http://localhost:5173/admin/answerform/${mode}?askCode=${askCode}`;
  window.open(url, 'popup', `width=${width},height=${height},top=${top},left=${left},toolbar=no,scrollbars=no,resizable=no`);
};

// 답변 등록 버튼 클릭 시
const registerAnswer = (askCode) => {
  openAnswerForm(askCode, 'register');
};

// 답변 수정 버튼 클릭 시
const editAnswer = (askCode) => {
  openAnswerForm(askCode, 'edit');
};

onMounted(() => {
  fetchAsks();
});
</script>

<style scoped>
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
  width: 1200px;
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
  width: 500px;
  text-align: left;
  border: 1px solid lightgray; /* 테두리 색상 추가 */
}

.date-range {
  display: flex;
  align-items: center;
}

.date-range span {
  margin: 0 5px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
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

.reset-btn:hover, .search-btn:hover {
  background-color: #fff;
}

.table-container {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.table {
  width: 1200px;
  max-width: 1200px;
  border-collapse: separate;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-spacing: 0 10px;
}

.table th {
  font-weight: bold;
  color: #000;
}

.boardname {
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.header1 {
  background-color: #D9D9D9;
  font-weight: bold;
  height: 50px;
  font-size: 12px;
  text-align: center;
}

.header1 .num {
  width: 5%;
}

.allpost {
  text-align: center;
  padding: 10px 0;
}

.allpost .num {
  width: 5%;
}

.allpost td {
  border-right: 1px solid #ddd;
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
  background-color: #ff6285; /* 답변대기 색상 */
}

.editbutton:hover {
  background-color: #ffbb00;
}

.editbutton-pending:hover {
  background-color: #ff6275;
}
</style>
