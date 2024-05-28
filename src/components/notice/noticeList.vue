<script>

</script>

<template>
  <div>
    <div class="container">
      <img class = "notice" src="@/assets/icon/List.png"/>
      <span class = "F-title">공지 및 문의 관리&nbsp;&nbsp;></span>
      <span class = "F-title">공지사항 관리&nbsp;&nbsp;></span>
      <span class = "F-title">공지사항 조회 관리</span>
    </div>

    <br/>
    <table class = "read-filter">
      <tr>
        <td class="filter-label">공지 조회 조건</td>
        <td class="filter1">
          <select class = "filter-section">
            <option value = "all">전체</option>
            <option value = "content">내용</option>
            <option value = "title">제목</option>
          </select>
          <input type = "text" class = "filter-input" placeholder="검색어를 입력하세요."/>
        </td>
      </tr>
      <tr>
        <td class="filter-label">등록일</td>
        <td colspan="3" class="filter-date">
          <input type="date" id="startDate" v-model="startDate" placeholder="시작 날짜 선택" title="시작 날짜 선택">
          &nbsp;&nbsp;<span>~</span>&nbsp;
          <input type="date" id="endDate" v-model="endDate" placeholder="종료 날짜 선택" title="종료 날짜 선택">
        </td>
      </tr>
    </table>

    <!-- 리셋, 검색 버튼 -->
    <div class="button-container">
      <button type="button" class="btn-reset">
        <img class = "reset" src="@/assets/icon/reset.png"/>
      </button>
      <button type="button" class="btn-reset">
        <img class = "search" src="@/assets/icon/search.png"/>
      </button>
    </div>

    <!-- 공지사항 리스트 -->
    <br/>
    <br/>
    <button type="button" class="btn-saveNotice">
      공지사항 등록
    </button>
    <br/>
    <table class="notice-table">
      <thead>
      <tr class="notice-list">
        <th class="list1">No</th>
        <th class="list2">제목</th>
        <th class="list3">등록일</th>
        <th class="list4">수정일</th>
        <th class="list5">관리</th>
      </tr>
      </thead>
      <tbody>
      <!-- 데이터를 동적으로 추가할 수 있습니다 -->
      <tr v-for="(notice, index) in paginatedNotice" :key="notice.noticeCode" class="allPost">
        <td class="num">{{ (currentPage - 1) * itemsPerpage + index + 1 }}</td>
        <td>{{notice.noticeTitle}}</td>
        <td>formatDate{{notice.noticeEnrollDate}}</td>
        <td>formatDate{{notice.noticeUpdateDate}}</td>
        <td class="button">
          <button class="editButton" @click="editNotice(notice)" :class="{ 'editButton-pending': notice.updateNotice }">
            수정
          </button>
          <button class="deleteButton" @click="deleteNotice(notice.noticeCode)" :class="{ 'deleteButton-pending': notice.deleteNotice }">
            삭제
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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
  border-collapse: collapse;
  background-color: #ffffff;
  border: 1px solid #D9D9D9;
  border-radius: 5px;
  padding: 10px;
  width: 1600px;
}

.read-filter td {
  border: none;
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
  height: 40px;
  font-size: 14px;
}

.filter-input {
  width: 300px;
  height: 40px;
  padding: 10px;
  margin-left: 10px;
}

.filter1 {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 50px;
  margin-left: 10px;
  position: relative;
  top: 3px;
}

.filter-input,
.filter-section {
  font-size: 16px;
}

.filter-date {
  border-top: 1px solid#D9D9D9 !important;
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

/* 여기서부터 filter2 옷입히기 */
/* 공통 스타일 설정 */
.input-container {
  border-radius: 5px;
  padding: 15px;

  width: 400px;
}

.input-group {
  display: flex;
  align-items: center;
  position: relative;
}

.input-box {
  width: calc(100% - 160px); /* 버튼 영역 확보 */
  height: 40px;
  font-size: 14px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.input-group-tools {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
}

.option {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin: 0 2px;
  font-size: 18px;
  color: #777;
}

.option:hover {
  color: #444;
}

.option i {
  vertical-align: middle;
}

.clear {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 18px;
  color: #e74c3c;
}

.clear:hover {
  color: #c0392b;
}

.status-message {
  margin-top: 10px;
  font-size: 12px;
  color: #777;
}

.input-box {
  display: block;
  width: 100%;
  padding: 8px 16px;
  font-size: 14px;
  line-height: 22px;
  color: #101314;
  background-color: #f8f8f8;
  border: 1px solid #d8d8d8;
  border-radius: 2px;
  text-align: left;
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s, background-color ease-in-out .15s;
}

#startDate,
#endDate {
  width: 170px;
  height: 40px;
  font-size: 16px;
  padding: 10px;
  margin-left: 10px;
}

.btn-reset {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 18px;
}

.button-container {
  display: flex;
  justify-content: center; /* 버튼을 왼쪽에 정렬 */
  align-items: center; /* 버튼을 수직 가운데에 정렬 */
  gap: 10px; /* 버튼 사이의 간격을 설정 */
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
  position: relative;
  left: 1490px;
  cursor: pointer;
  border: 0px;
}

.btn-saveNotice:hover {
  background-color: #9a9a9a;
  color: #ffffff;
}

</style>
