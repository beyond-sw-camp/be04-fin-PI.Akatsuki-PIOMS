<template>
  <!-- 팝업을 표시할 div 요소 -->
  <div v-if="showPopup" class="popup-container">
    <!-- 팝업 내용 -->
    <div class="popup-content">
      <!-- 팝업 내용 -->
      <h2>팝업 내용</h2>
      <p>팝업에 표시할 내용을 여기에 추가하세요.</p>

      <!-- 닫기 버튼 -->
      <button @click="closePopup">닫기</button>
    </div>
  </div>
</template>