<template>
  <div class="popup-overlay" >
       <div class="popup-content">
           <br>          <br>

           <div class="info">
                <h1 align="center">발주서</h1>
                <div style="display:flex;" align="center">
                  <div class="divvv-title">
                    수신처
                  </div>
                  <div class="divvv-title">
                    발신처
                  </div>
                </div>
                <div style="display:flex;" align="center">

                    <div class="divvv">
                        <div class="divvv2" >
                          <div class="divvv3-title">
                            관리자
                          </div>
                          <div class="divvv3">
                            {{ item.adminCode }}
                          </div>
                        </div>
                        <div class="divvv2">
                          <div class="divvv3-title">
                              관리자명
                          </div>
                          <div class="divvv3">
                             {{ item.adminName }}
                          </div>
                        </div>
                        <div class="divvv2">
                          <div class="divvv3-title">
                            점주전화번호
                          </div>
                          <div class="divvv3">
                             {{item.adminPhone}}
                          </div>
                        </div>
                    </div>

                    <div class="divvv">
                      <div class="divvv2" >
                          <div class="divvv3-title">
                            가맹점
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
                            점주전화번호
                          </div>
                          <div class="divvv3">
                             {{item.franchiseOwnerPhone}}
                          </div>
                        </div>
                </div>
            </div>


            <div class="divvv-title">
                발주상품
            </div>
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr class="header1">
                    <th v-for="(header, index) in headers" :key="index">{{ header.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="allpost" v-for="(product, rowIndex) in list" :key="rowIndex">
                    <td v-for="(header, colIndex) in headers" :key="colIndex">
                      <div >{{ product[header.key] }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br><br>
            <div class="divvv-title" style="border-top: 2px black solid;">
                반품상품
            </div>
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr class="header1">
                    <th v-for="(header, index) in exchangeHeaders" :key="exchangeList">{{ header.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="allpost" v-for="(product, rowIndex) in exchangeList" :key="rowIndex">
                    <td v-for="(header, colIndex) in exchangeHeaders" :key="colIndex">
                      <div >{{ product[header.key] }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <br>
            <br>
            <br>
            <br>



            <div v-if="isDenied">
              <div class="popup-overlay"  >
                <div class="popup-content" style="width: 600px; height: 600px;">
                  <form @submit.prevent="denyOrder">
                    <h2>반려사유 </h2>
                    <textarea v-model="reason" cols="30" rows="5"></textarea><br>

                    <div class="table-container">
                      <table class="table">
                        <thead >
                          <tr class="header1">
                            <th  v-for="(header, index) in headers" :key="index" >{{ header.label }}</th>
                          </tr>
                        </thead>
                        <tbody >
                          <tr class="allpost" v-for="(product, rowIndex) in list" :key="rowIndex">
                            <td v-for="(header, colIndex) in headers" :key="colIndex">
                              <div>{{ product[header.key] }}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="action-buttons">
                      <button type="submit" class="ho-btn">등록</button>
                      <button type="button" class="ho-btn" @click="clickDeny">취소</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
         발주일 : {{ item.orderDate }} &nbsp;&nbsp;&nbsp;&nbsp;
         주문코드 : {{ item.orderCode }}<br>
          <div class="action-buttons" v-if="item.orderCondition == '승인대기'">
              <input class="ho-btn" type="button" value="발주승인" @click="accpetOrder">
              <input class="ho-btn" type="button" value="발주반려" @click="clickDeny">
            </div>
         <div>
           <div style="float: right">
             <button class="ho-btn" @click="showDetailPopup" >돌아가기</button>
           </div>
         </div>
         <br><br>
       </div>
   </div>




</template>

<script setup>
   import { ref } from "vue";
   import axios from 'axios';
   import { useStore } from 'vuex'; // Vuex store 임포트
   import Swal from "sweetalert2";
   import AdminExchangePage from "@/components/exchange/AdminExchangePage.vue";
   import FranchiseOrderPage from "@/components/order/FranchiseOrderPage.vue";
   import AdminOrderPage from "@/components/order/AdminOrderPage.vue"; // Vuex store 임포트

   const store = useStore(); // Vuex store 사용


   const headers = ref([
    /*{ key: 'requestProductCode', label: '상품 코드' },*/
    { key: 'productName', label: '상품명' },
    { key: 'requestProductCount', label: '요청 수량' },
  ]);
  const exchangeHeaders = ref([
    { key: 'productName', label: '상품명' },
    { key: 'exchangeProductCount', label: '요청 수량' },
  ]);

 const props = defineProps({
   showDetailPopup: Function,
   popupVisible: Boolean,
   writeActive: Boolean,
   detailItem: Object,
   getOrderList: Function,
 });
 const item = props.detailItem;
 const list = props.detailItem.orderProductList;
 const exchangeList = props.detailItem.exchangeProductList;

 // 추후 개선 예정
 const adminCode = 2;
 const franchiseCode = 1;
const accpetOrder = async () => {
    try {

      const accessToken = store.state.accessToken;
        if (!accessToken) {
          throw new Error('No access token found');
      }
      const response = await fetch(`http://localhost:5000/admin/order/${item.orderCode}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("error")
      }
      await Swal.fire({
        position: "center",
        icon: "success",
        title: "발주 등록 완료되었습니다.",
        showConfirmButton: false,
        timer: 1500
      });
      props.showDetailPopup();
      location.reload(FranchiseOrderPage);
    } catch (error) {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "잘못된 요청입니다.",
        showConfirmButton: false,
        timer: 1500
      });
      location.reload(FranchiseOrderPage);

      console.error('오류 발생:', error);
    }
};

const isDenied = ref(false);
const reason = ref('');
const clickDeny = () =>{
  isDenied.value = !isDenied.value;
}

const denyOrder = async () => {

    try {
      const accessToken = store.state.accessToken;
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch(`http://localhost:5000/admin/order/${item.orderCode}/deny?denyMessage=${reason.value}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (!response.ok) {
        props.showDetailPopup();
        throw new Error('네트워크 오류 발생');
      }

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "발주 거절 처리 완료되었습니다.",
        showConfirmButton: false,
        timer: 1500
      });
      location.reload(AdminOrderPage);

    } catch (error) {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "잘못된 요청입니다.",
        showConfirmButton: false,
        timer: 1500
      });
      location.reload(AdminOrderPage);

      props.showDetailPopup();
    }
};


console.log(props.detailItem);
console.log(exchangeList);
</script>


<style scoped>
  @import "../../assets/css/popup.css" ;
  @import "../../assets/css/order.css" ;



</style>
