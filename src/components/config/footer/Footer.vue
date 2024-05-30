<template>
  <!-- footer -->
  <footer class="footer">
    <p class="footer_text">
      회사명: PIOMS 솔루션  |  대표명: 김용승  |  사업자등록번호: 478-34-23344  |  주소: 서울특별시 동작구 보라매로 87, 3~5층 플레이데이터 © PIOMS
    </p>
  </footer>
</template>

<style scoped>
/* footer css */
.footer {
  width: 2100px;
  height: 30px;
  position: fixed;
  bottom: 10px;
  left: 0;
  background-color: #ffffff;
  padding: 10px 20px; /* 상하 좌우 여백 */
  box-shadow: 0 -1px 5px rgba(0,0,0,0.1); /* 약간의 그림자 효과 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.footer_text {
  font-size: 12px;
  color: #B9B9B9;
  top: 10px;
  text-align: center;
}
</style>