<template>
  <!-- 공지사항 상세 정보 팝업 -->
  <div class="overlay">
    <div class="notice-form">
      <h2>공지사항 상세 정보</h2>
      <button class="close-btn" @click="$emit('close')">X</button>
      <table>
        <tr>
          <td class="detailTitle">제목</td>
          <td>{{ notice.noticeTitle }}</td>
        </tr>
        <tr>
          <td class="detailContent">내용</td>
          <td>{{ notice.noticeContent }}</td>
        </tr>
        <tr>
          <td class="label">등록일</td>
          <td>{{ formatDate(notice.noticeEnrollDate) }}</td>
        </tr>
        <tr>
          <td class="label">수정일</td>
          <td>{{ formatDate(notice.noticeUpdateDate) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
// import {onMounted, ref} from 'vue';
//
// const noticeTitle =ref([]);
// const noticeContent =ref([]);
// const selectedNotice = ref({});
// const props = defineProps({
//   noticeCode: Number,
//   closeDetailsPopup: Function
// });
// const closeDetailsPopup = () => {
//   props.closeDetailsPopup();
// };
//
// const fetchNoticeData = async () => {
//   const noticeCode = props.noticeCode.noticeCode;
//   if (!noticeCode) {
//     console.error('존재하지 않는 공지사항 목록입니다.');
//     return;
//   }
//   try {
//     const response = await fetch(`http://api.pioms.shop/admin/notice/list/details/${noticeCode}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     selectedNotice.value = data;
//   } catch (error) {
//     console.error('공지사항을 불러오는 데 실패하였습니다: ', error);
//   }
// };
//
// const formatDate = (dateArray) => {
//   if (!dateArray || dateArray.length === 0) return '날짜 없음';
//   const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
//   const date = new Date(year, month - 1, day, hour, minute, second);
//   return date.toLocaleDateString('ko-KR', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit'
//   });
// };
// onMounted(fetchNoticeData);


  const props = defineProps({
    notice: Object,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.notice-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.close-btn {
  background: red;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
