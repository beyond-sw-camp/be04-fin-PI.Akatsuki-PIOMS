<template>
  <div class="popup-overlay" >
       <div class="popup-content">
           <button class="close" @click="showDetailPopup" >돌아가기</button>
           <br>
           <div class="info">
                <h1 align="center">반품 및 교환 주문서</h1>

                <div style="display:flex;" align="center">
                  <div class="divvv2" >
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
                        {{item.exchangeCode}}
                    </div>
                  </div>                    
            </div>
            

            <div class="divvv-title">
                반품 및 교환 항목
            </div>
            <div style="display: block; font-size: 1.5lh; display:flex; justify-content: center; font-weight: 1000; width:100%;" align = "center">

                <table>
                  <thead>
                    <tr align="center">
                      <th>상품 코드</th>
                      <th>상품 이름</th>
                      <th>반품 수량</th>
                      <th>정상 수량</th>
                      <th>폐기 수량</th>
                      <th>반품/폐기</th>
                    </tr>
                  </thead>
                  <!-- 처리 대기중인 교환인 경우 -->
                  <tr v-for="(product, index) in list" :key="index" align="center" v-if="item.exchangeStatus=='처리대기' ">
                    <td>{{ product.productCode }}</td>
                    <td>{{ product.productName }}</td>
                    <td>{{ product.exchangeProductCount }}</td>
                    <td><input type="number" v-model="product.exchangeNormalCount" min="0"  /></td>
                    <td><input type="number" v-model="product.exchangeDiscount" min="0"  /></td>
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

            <br>
            <div class="but-group" v-if="item.exchangeStatus=='처리대기' ">
              <input class="but" type="button" value="발주승인" @click="checkExchange">
              <input class="but" type="button" value="발주반려" @click="clickDeny">
            </div>
            <div class="but-group" v-else>
              <input class="but" type="button" value="발주승인" @click="checkExchange">
              <input class="but" type="button" value="발주반려" @click="clickDeny">
            </div>

            <div v-if="isDenied">
              <div class="popup-overlay"  >
                <div class="popup-content" style="width: 600px; height: 600px;">
                  <form @submit.prevent="denyOrder">
                    <h2>반려사유 </h2>
                    <textarea v-model="reason" cols="30" rows="5"></textarea><br>

                    <div style="display: block; font-size: 1.5lh; display:flex; justify-content: center; font-weight: 1000; width:100%;" align="center">
                      <table>
                        <thead>
                          <tr>
                            <th  v-for="(header, index) in headers" :key="index" >{{ header.label }}</th>
                          </tr>
                        </thead>
                        <tbody >
                          <tr class="table" v-for="(product, rowIndex) in list" :key="rowIndex">
                            <td v-for="(header, colIndex) in headers" :key="colIndex" >
                              <div>{{ product[header.key] }}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="but-group">
                      <button type="button" class="close" @click="clickDeny">취소</button>
                      &nbsp;&nbsp;&nbsp;
                      <button type="submit" class="close">등록</button>
                    </div>
                  </form> 
                </div>
              </div>
            </div>
            
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
    /*{ key: 'requestProductCode', label: '상품 코드' },*/
    { key: 'productName', label: '상품명' },
    { key: 'exchangeProductStatus', label: '반품/폐기' },
    { key: 'exchangeProductCount', label: '요청 수량' },
    { key: 'exchangeProductNormalCount', label: '정상 수량' },
    { key: 'exchangeProductDiscount', label: '폐기 수량' },
  ]);
  

 const props = defineProps({
   showDetailPopup: Function,
   popupVisible: Boolean,
   writeActive: Boolean,
   detailItem: Object,
 });
 const item = props.detailItem;
 const list = props.detailItem.products;


 // 추후 개선 예정 
 const adminCode = 2;
 const franchiseCode = 1;

 console.log(item);
 console.log(list);

const checkExchange = async () => {
    try {
      const response = await fetch(`/api/admin/exchange/${item.exchangeCode}?=${adminCode}`, {
        method: 'PUT',
      });
      if(response.status ==406){
        alert("이 발주는 이미 처리되어 있습니다.");
        props.showDetailPopup();
        return;
      }
      if (!response.ok) {
        alert("헉 왜 주문 승인 안되지????????????")
        throw new Error('네트워크 오류 발생');
      }
      props.showDetailPopup();

    } catch (error) {
      console.error('오류 발생:', error);
    }
};


</script>


<style scoped>



  </style>
  