<template>
  <div class="overlay" @click.self="closePopup">
    <div class="invoice-container">
      <header>
        <div class="logo-title">
          <img id="logo" src="@/assets/icon/PIOMSDelivery.png"/>
        </div>
        <button @click="printPage" class="print-btn">
          <img id="print" src="@/assets/icon/invoicePrint.png"/>
        </button>
      </header>
      <div class="section">
        <div class="section-left">
          <h3 class="fr">보낸 분</h3>
          <div>
            <p><div id="se">주소</div><span id="customer-address">서울특별시 도봉구 재현로 98</span></p>
            <p><div id="se">이름</div><span id="customer-name">{{invoice.adminName}}</span></p>
            <p><div id="se">전화번호</div><span id="customer-phone">010-1234-4567</span></p>
            <p><div id="se">송장번호</div><span id="customer-invoiceCode">{{ invoice.invoiceCode }}</span></p>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-left">
          <h3 class="fr">받는 분</h3>
          <div>
            <p><div id="se">주소</div><span id="customer-address">{{ invoice.franchiseAddress }}</span></p>
            <p><div id="se">이름</div><span id="customer-name">{{ invoice.franchiseOwnerName }}</span></p>
            <p><div id="se">전화번호</div><span id="customer-phone">{{ invoice.franchiseOwnerPhone }}</span></p>
            <p><div id="se">발주번호</div><span id="customer-orderCode">{{ invoice.orderCode }}</span></p>
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
              <th>총 금액</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(product, index) in invoice.orderProductList" :key="index">
              <td id="item-no">{{ index + 1 }}</td>
              <td id="item-name">{{ product.productName || 'N/A' }}</td>
              <td id="item-size">{{ product.productSize || 'N/A' }}</td>
              <td id="item-color">{{ product.productColor || 'N/A' }}</td>
              <td id="item-quantity">{{ product.requestProductCount || 'N/A' }}</td>
              <td id="item-quantity">{{ invoice.orderTotalPrice.toLocaleString() || 'N/A' }} 원</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="company-info">
        <p>회사명: PIOMS 솔루션  |  대표명: 김용승  |  사업자등록번호: 478-34-23344  |  주소: 서울특별시 동작구 보라매로 87, 3~5층 플레이데이터</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, onMounted, ref } from 'vue';
import { useStore } from "vuex";

const store = useStore();
const accessToken = store.state.accessToken;

const props = defineProps({
  invoice: {
    type: Object,
    default: () => ({})
  },
  product: {
    type: Array,
    default: () => ([])
  }
});

// getProductDetail 함수를 수정하여 제품 코드를 받아 해당 제품을 찾아 반환하도록 변경합니다.
const getProductDetail = (productCode) => {
  return props.product.find(product => product.productCode === productCode) || {};
};

const emits = defineEmits(['close']);
const invoice = ref(props.invoice);
const driverCode = 1;

const closePopup = () => {
  emits('close');
}

const getDetailInvoice = async () => {
  try {
    const response = await fetch(`http://api.pioms.shop/driver/${driverCode}/${props.invoice.invoiceCode}/details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text(); // JSON 파싱 이전에 문자열로 받음
    console.log('Fetched invoice details', data); // 콘솔에 데이터 구조 출력
    invoice.value = data.invoice;
    // fetchAllProductDetails();
  } catch (error) {
    console.error('송장 정보를 가져오는 중 에러가 발생했습니다:', error);
  }
};

function printPage() {
  window.print();
}
//
// const fetchAllProductDetails = () => {
//   invoice.value.order.orderProductList.forEach(product => {
//     getProductDetail(product.productCode);
//   });
// };

onMounted(() => {
  getDetailInvoice();
});

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
    position: relative;
    margin: 10px;
    left: 0;
    top: 0;
    width: 100%;
  }
  /* 인쇄 버튼 숨기기 */
  .print-btn {
    display: none;
  }
  /* 배경 색 인쇄하기 설정 */
  .fr, #se {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}


/* 송장 조회 */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
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
#customer-orderCode,
#customer-invoiceCode {
  display: inline-block;
  margin-left: 10px;
  text-align: center;
}

.section-left span {
  display: inline;
  justify-content: flex-start;
}
</style>
