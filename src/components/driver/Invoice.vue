<template>
  <div class="invoice-container">
    <header>
      <div class="logo-title">
        <img id="logo" src="@/assets/icon/PIOMSDelivery.png"/>
      </div>
      <button onclick="generateInvoice()">
        <img id="print" src="@/assets/icon/invoicePrint.png"/>
      </button>

<!--        &lt;!&ndash; 이부분은 인쇄 안되는 영역 &ndash;&gt;-->
<!--        <div class="leftDiv">-->
<!--          <h1>1번 발주 송장</h1>-->
<!--          <p>예시로 인쇄 기능 구현</p>-->
<!--        </div>-->

<!--        &lt;!&ndash; 이부분은 인쇄 되는 영역 &ndash;&gt;-->
<!--        <div id="printableArea" class="rightDiv">-->
<!--          <h1>2번 발주 송장</h1>-->
<!--          <p>예시로 인쇄 기능 구현</p>-->
<!--          <table>-->
<!--            <tr class="td1">-->
<!--              <td>항목 1</td>-->
<!--            </tr>-->
<!--            <tr class="td1">-->
<!--              <td>항목 2</td>-->
<!--            </tr>-->
<!--          </table>-->
    </header>



    <div class="section">
      <div class="section-left">
        <h3 class="fr">보낸 분</h3>
        <div>
          <p><div id="se">주소</div><span id="customer-address">서울특별시 도봉구 재현로 98</span></p>
          <p><div id="se">이름</div><span id="customer-name">신타치</span></p>
          <p><div id="se">전화번호</div><span id="customer-phone">010-1234-4567</span></p>
          <p><div id="se">송장번호</div><span id="customer-email">1234567</span></p>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-left">
        <h3 class="fr">받는 분</h3>
        <div>
          <p><div id="se">주소</div><span id="customer-address">서울특별시 도봉구 재현로 98</span></p>
          <p><div id="se">이름</div><span id="customer-name">신타치</span></p>
          <p><div id="se">전화번호</div><span id="customer-phone">010-1234-4567</span></p>
          <p><div id="se">발주번호</div><span id="customer-email">1234567</span></p>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-right">
        <h3 class="fr">공급 항목</h3>
        <table>
          <thead>
          <tr>
            <th>No</th>
            <th>상품명</th>
            <th>사이즈</th>
            <th>색상</th>
            <th>주문수량</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td id="item-no">123456</td>
            <td id="item-name">상품 이름</td>
            <td id="item-size">M</td>
            <td id="item-color">빨강</td>
            <td id="item-quantity">10</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="company-info">
      <p>회사명: PIOMS 솔루션  |  대표명: 김용승  |  사업자등록번호: 478-34-23344  |  주소: 서울특별시 동작구 보라매로 87, 3~5층 플레이데이터</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  invoice: Object
});

const emits = defineEmits(['close']);

function printPage() {
  window.print();
}
</script>

<style scoped>

/* 인쇄하기 css */
@media print {
  body * {
    visibility: hidden;
  }
  #printableArea, #printableArea * {
    visibility: visible;
  }
  #printableArea {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}

.leftDiv {
  margin-right: 21rem;
}

.rightDiv {
  margin-right: 21rem;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

.invoice-container {
  width: 800px;
  height: 660px;
  margin: auto;
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000; /* Ensure it is on top */
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  margin: 0;
}

.logo-title {
  display: flex;
  align-items: center;
}

#logo {
  width: 120px;
  height: 60px;
  margin-right: 10px;
  position: relative;
  left: 350px;
  bottom: 10px;
}
#print {
  width: 100px;
  height: 30px;
  position: relative;
  top: 10px;
  right: -5px;
}

button {
  border: 0;
  background-color: #fff;
  cursor: pointer;
  margin-left: auto;
}

.section {
  display: inline-block;
  margin-bottom: 2px;
  width: 100%;
}

.section-left, .section-right {
  flex: 1;
}

.section-right table {
  width: 100%;
  border-collapse: collapse;
}

.section-left p {
  margin: 10px;
}

.section-right table, .section-right th, .section-right td {
  border: 1px solid #ddd;
}

.section-right th, .section-right td {
  padding: 10px;
  text-align: left;
}

.section-right th {
  background-color: #f4f4f4;
}

.fr {
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 0;
  position: relative;
  border: 1px solid #d9d9d9;
  background-color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30px;
}
.company-info {
  font-size: 14px;
  display: flex;
  justify-content: center;
  color: #444;
}
hr {
  width: 100%;
  color: #d9d9d9;
  margin: 1px;
}
#se {
  font-weight: bold;
  margin-right: 15px;
  background-color:  #d9d9d9;
  width:65px;
  height: 18px;
  display: inline-block;
  color: #444444; /* 강조 표시를 원할 경우 */
  border-radius: 6px; /* 테두리를 둥글게 설정합니다 */
  text-align: center; /* 텍스트를 가운데로 정렬합니다 */
  font-size: 14px; /* 폰트 크기를 설정합니다 */
  text-align: center;
  padding : 6px 0;
}

#customer-address,
#customer-name,
#customer-phone,
#customer-email {
  display: inline-block;
  margin-left: 10px; /* 텍스트 사이의 간격을 설정합니다 */
  text-align: center;
}

.section-left span {
  display: inline;
  justify-content: flex-start;
}
</style>
