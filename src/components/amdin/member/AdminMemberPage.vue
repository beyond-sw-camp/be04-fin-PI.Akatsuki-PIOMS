<template>
  <div>
    <div class="headerTitle">
      <h3 class="product-title"><img src="@/assets/icon/Cloth.png">상품 및 상품 카테고리 관리 > 상품 관리 > 상품 전체 조회 및 관리</h3>
      <h6 class="product-sub-title" style="margin-top: 1%; margin-bottom: 1%">조회할 상품의 조건을 선택 후
        <img src="@/assets/icon/reset.png">초기화 또는 <img src="@/assets/icon/search.png">검색을 눌러주세요.
      </h6>
    </div>
    <div class="filter-section">
      <div>
      </div>
      <table class="filter-table">
        <tr>
          <td class="filter-label">관리자명</td>
          <td class="filter-input">
            <input type="text" v-model="filterAdminName" @keyup.enter="applyFilters" class="textInput" placeholder="관리자명을 입력하세요."/>
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
    <div class="post-btn" id="app">
      <button @click="showPostPopup = true" class="postBtn">
        <img src="@/assets/icon/new%20Item.png" alt="postProduct">
      </button>
      <AdminPostPopup v-if="showPostPopup" @close="showPostPopup = false"/>
      <button @click="downloadExcel" class="excelBtn"><img src="@/assets/icon/excel.png" alt="excel"></button>
    </div>
    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <th v-for="(header, index) in headers" :key="index">{{header.label}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, rowIndex) in paginatedLists" :key="rowIndex" class="allpost">
          <td v-for="(header, colIndex) in headers" :key="colIndex" class="table-td">
                {{ item[header.key] }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span> {{currentPage}} / {{totalPages}} </span>
      <button @click="nextPage" :disabled="currentPage ===totalPages">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from "axios";
import { useStore } from 'vuex';
const store = useStore();
import AdminPostPopup from "@/components/amdin/member/AdminPostPopup.vue";
const accessToken = store.state.accessToken;

const lists = ref([]);
const headers = ref([
  { key: 'adminCode', label: '관리자 코드'},
  { key: 'adminName', label: '이름'},
  { key: 'adminId', label: 'ID'},
  { key: 'adminPwd', label: 'PWD'},
  { key: 'adminEmail', label: '이메일'},
  { key: 'adminPhone', label: '휴대전화'},
  { key: 'adminRole', label: '역할'},
  { key: 'adminStatus', label: '활성상태'},
  { key: 'pwdCheckCount', label: '로그인실패횟수'},
  { key: 'enrollDate', label: '등록일'},
  { key: 'updateDate', label: '수정일'},
  { key: 'deleteDate', label: '삭제일'},
  { key: 'accessNumber', label: '발급코드'},
]);

const showPostPopup = ref(false);

const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;
const filterAdminName = ref('');

const applyFilters = () => {
  filteredLists.value = lists.value.filter(list => {
    const matchesAdminName = !filterAdminName.value || list.adminName.includes(filterAdminName.value);

    return matchesAdminName;
  });
};
const resetFilters = () => {
  filterAdminName.value = '';
  filteredLists.value = lists.value;
};

const getAdminMembers = async () => {
  try {
    const response = await fetch('http://localhost:5000/admin/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Bad request');
    }

    const data = await response.json();
    if (data.length > 0) {
      lists.value = data.map(({ admin, ...rest }) => rest);
      filteredLists.value = lists.value;
    } else {
      lists.value = [];
      filteredLists.value = [];
    }
  } catch (error) {
    console.error('Bad request:', error);
  }
};
const downloadExcel = () => {
  axios({
    url: 'http://localhost:5000/admin/exceldownload/admin-excel', // 백엔드 엑셀 다운로드 API 엔드포인트
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    responseType: 'blob', // 서버에서 반환되는 데이터의 형식을 명시
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'adminList.xlsx'); // 원하는 파일 이름 설정
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.error('EBad request:', error);
  });
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

getAdminMembers();
</script>

<style scoped>
.pagination {
  margin-top: 10px;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-section {
  display: flex;
  justify-content: center;
}

.filter-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 1250px;
}

.filter-table td {
  padding: 5px 10px;
}

.filter-label {
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  width: 100px;
  background-color: #D9D9D9;
  border: 1px solid #ddd;
}

.filter-input {
  width: 500px;
  text-align: left;
  border: 1px solid lightgray;
  border-right: none;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
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
.post-btn {
  display: flex;
  justify-content: space-between; /* 양 끝에 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  position: absolute; /* 절대 위치 설정 */
  left: 14%; /* 좌측 정렬 */
  width: 1270px;
}

.reset-btn:hover, .search-btn:hover {
  background-color: #fff;
}

.table-container {
  width: 100%;
  margin-top: 40px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.table {
  width: 1200px;
  max-width: 1200px;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-spacing: 0 10px;
  table-layout: fixed;
}

.table th {
  font-weight: bold;
  color: #000;
  width: 100%;
  height: 10px;
  table-layout: fixed;
}

.table th,
.table td {
  border: 0.5px solid #D9D9D9;
  padding: 8px;
  width: 80px;
  height: 10px;
  table-layout: fixed;
}
.table-td {
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header1 {
  background-color: #D9D9D9;
  font-weight: bold;
  height: 50px;
  font-size: 12px;
  text-align: center;
  width: 5%;
}

.header1 th{
  font-size: 15px;
  text-align: center;
}

.allpost {
  text-align: center;
  padding: 10px 0;
  width: 5%;
}

.allpost:hover {
  background-color: #f2f2f2;
}

.allpost td {
  border-right: 1px solid #ddd;
  font-size: 12px;
}

.button-as-text {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-align: left; /* 텍스트 정렬을 위해 필요시 사용 */
}
.textInput {
  border: 1px solid rgba(217, 217, 217, 0.7);
}
.categories {
  border: 1px solid rgba(217, 217, 217, 0.7);
}
.product-title {
  margin-left: 18%;
}
.headerTitle {
  text-align: left;
  margin-left: 16.2%;
}

.product-sub-title {
  margin-left: 18%;
}
.product-sub-title img {
  width: 20px;
  height: 20px;
}
.headerTitle img {
  width: 30px;
  height: 30px;
}
.headerTitle h6 {
  margin-bottom: 5%;
}
.headerTitle h3,
.headerTitle h6 {
  margin: 0
}
.pagination button {
  border: none;
  border-radius: 10px;
  width: 75px;
}
</style>
