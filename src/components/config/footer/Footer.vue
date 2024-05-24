<script setup>

</script>

<template>
  <!-- footer -->
  <footer class="footer">
    <p class="footer_text">
      회사명: PIOMS 솔루션  |  대표명: 김용승  |  사업자등록번호: 478-34-23344  |  주소: 서울특별시 동작구 보라매로 87, 3~5층 플레이데이터 © FORBIZKOREA x NAVER Cloud CO.LTD. All Rights Reserved.
    </p>
  </footer>
</template>

<style scoped>
  /* footer css */
  .footer {
    width: 100%;
    height: 30px;
    position: fixed;
    bottom: 10px;
    left: 0;
    padding: 10px 20px; /* 상하 좌우 여백 */
    box-shadow: 0 -1px 5px rgba(0,0,0,0.1); /* 약간의 그림자 효과 */
    display: flex;
    justify-content: flex-end;
  }
  .footer_text {
    font-size: 12px;
    color: #B9B9B9;
    position: relative;
    right: 400px;
    top: 10px;
    display: inline-flex;
    text-align: right;
  }
</style>