<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <br>
      <div class="info" style="min-height: 700px;">
        <h1 align="center">반품 및 교환 주문서</h1>

        <div style="display:flex;" align="center">
          <div class="divvv2">
            <div class="divvv3-title">
              가맹점명
            </div>
            <div class="divvv3">
              {{ item.franchiseName }}
            </div>
          </div>
          <div class="divvv2">
            <div class="divvv3-title">
              점주명
            </div>
            <div class="divvv3">
              {{ item.franchiseOwnerName }}
            </div>
          </div>
          <div class="divvv2">
            <div class="divvv3-title">
              반품번호
            </div>
            <div class="divvv3">
              {{ item.exchangeCode }}
            </div>
          </div>
        </div>

        <div class="divvv-title">
          반품 및 교환 항목
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr class="header1">
                <th>상품 코드</th>
                <th>상품 이름</th>
                <th>반품 수량</th>
                <th>정상 수량</th>
                <th>폐기 수량</th>
                <th>반품/폐기</th>
              </tr>
            </thead>
            <!-- 처리 대기중인 교환인 경우 -->
            <tr class="allpost"  v-for="(product, index) in list" :key="index" align="center" v-if="item.exchangeStatus=='처리대기' ">
              <td>{{ product.productCode }}</td>
              <td>{{ product.productName }}</td>
              <td>{{ product.exchangeProductCount }}</td>
              <td><input type="number" v-model.number="product.exchangeNormalCount" min="0" /></td>
              <td><input type="number" v-model.number="product.exchangeDiscount" min="0" /></td>
              <td>{{ product.exchangeProductStatus }}</td>
            </tr>
            <!-- 처리 대기중인 아닌 경우 -->
            <tr v-for="(product, index) in list" align="center" v-else>
              <td>{{ product.productCode }}</td>
              <td>{{ product.productName }}</td>
              <td>{{ product.exchangeProductCount }}</td>
              <td>{{ product.exchangeProductNormalCount }}</td>
              <td>{{ product.exchangeProductDiscount }}</td>
              <td>{{ product.exchangeProductStatus }}</td>
            </tr>
          </table>
        </div>
        <br><br><br><br>

      </div>
      신청일자 : {{ item.exchangeDate }}
      <div class="action-buttons" >
          <input v-if="item.exchangeStatus=='처리대기' " class="ho-btn" type="button" value="저장하기" @click="checkExchange">
          <input class="ho-btn" type="button" value="돌아가기" @click="showDetailPopup">
        </div>
      <br>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from 'vuex';
import Swal from "sweetalert2"; // Vuex store 임포트
import AdminExchangePage from "@/components/exchange/AdminExchangePage.vue"; // Vuex store 임포트
const store = useStore(); // Vuex store 사용

const headers = ref([
  { key: 'productName', label: '상품명' },
  { key: 'exchangeProductStatus', label: '반품/폐기' },
  { key: 'exchangeProductCount', label: '요청 수량' },
  { key: 'exchangeNormalCount', label: '정상 수량' },
  { key: 'exchangeDiscount', label: '폐기 수량' },
]);

const props = defineProps({
  showDetailPopup: Function,
  popupVisible: Boolean,
  writeActive: Boolean,
  detailItem: Object,
});
const item = props.detailItem;
const list = props.detailItem.products;



const checkExchange = async () => {
  const requestData = {
    exchangeStatus: "처리완료",
    products: list.map(product => ({
      exchangeProductCode: product.exchangeProductCode,
      productCode : product.productCode,
      exchangeProductCount: product.exchangeProductCount,
      exchangeProductNormalCount: product.exchangeNormalCount,
      exchangeProductDiscount: product.exchangeDiscount
    }))
  };

  console.log(requestData);

  try {

 const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`http://localhost:5000/admin/exchange/${item.exchangeCode}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    if (!response.ok) {
      throw new Error('네트워크 오류 발생');
    }
    await Swal.fire({
      position: "center",
      icon: "success",
      title: "반품 처리 완료되었습니다.",
      showConfirmButton: false,
      timer: 1500
    });
    props.showDetailPopup();
    location.reload(AdminExchangePage);
  } catch (error) {
    await Swal.fire({
      position: "center",
      icon: "error",
      title: "잘못된 요청입니다.",
      showConfirmButton: false,
      timer: 1500
    });
    console.error('오류 발생:', error);
  }
};


</script>


<style scoped>
  @import "../../assets/css/order.css" ;
  @import "../../assets/css/popup.css" ;
</style>
