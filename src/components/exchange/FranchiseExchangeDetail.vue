<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <br>
      <div class="info">
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
        <div style="display: block; font-size: 1.5lh; display:flex; justify-content: center; font-weight: 1000; width:100%;" align="center">
          <table>
            <thead>
              <tr align="center">
                <th>상품 코드</th>
                <th>상품 이름</th>
                <th>반품 수량</th>
                <th>반품/폐기</th>
              </tr>
            </thead>
            <!-- 처리 대기중인 교환인 경우 -->
            <tr v-for="(product, index) in list" :key="index" align="center">
              <td>{{ product.productCode }}</td>
              <td>{{ product.productName }}</td>
              <td>{{ product.exchangeProductCount }}</td>
              <td>{{ product.exchangeProductStatus }}</td>
            </tr>
          </table>
        </div>
        <br><br><br><br>

        <br>
        <div class="but-group" v-if="item.exchangeStatus=='반송신청'">
          <input class="but" type="button" value="삭제하기" @click="deleteExchange">
        </div>
          <input class="but" type="button" value="돌아가기" @click="showDetailPopup">

      </div>
      신청일자 : {{ item.exchangeDate }}
      <br>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios';

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
console.log(list);

// 추후 개선 예정
const franchiseOwnerCode = ref(1);


const deleteExchange = async () => {
  try {
    const response = await fetch(`/api/franchise/exchange/${item.exchangeCode}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        'access': `${localStorage.getItem('access')}`, // 인증 토큰을 포함하는 경우
      },
      });
    if (response.status == 406) {
      alert("삭제 불가..");
      return;
    }
    if (!response.ok) {
      alert("서버 에러 발생 ");
      throw new Error('네트워크 오류 발생');
    }
    alert("삭제되었습니다.");
    props.showDetailPopup();
  } catch (error) {
    console.error('오류 발생:', error);
  }
};


</script>
