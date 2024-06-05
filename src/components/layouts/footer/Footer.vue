<template>
  <!-- footer -->
  <footer class="footer">
    <div class="page-content">
      <p class="footer_text">
        회사명: PIOMS 솔루션  |  대표명: 김용승  |  사업자등록번호: 478-34-23344  |  주소: 서울특별시 동작구 보라매로 87, 3~5층 플레이데이터 © PIOMS
      </p>
    </div>
  </footer>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
}

.footer {
  width: 100%;
  height: 30px;
  background-color: #ffffff;
  padding-top: 15px;
  z-index: 10000;
  //position: fixed;
  bottom: 20px;
}

.page-content {
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 10px;
}

.footer_text {
  font-size: 12px;
  color: #B9B9B9;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
