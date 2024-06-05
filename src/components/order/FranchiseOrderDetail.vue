<template>
  <div class="popup-overlay" >
       <div class="popup-content">
           <br>
           <br>
                <h1 align="center">발주서</h1>

           <div class="info">
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
                             {{item.franchiseOwnerPhone}}
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

            <div class="divvv-title" style="border-top: 2px black solid;">
                발주상품
            </div>

            <div class="table-container">
              <table class="table">
                <thead>
                  <tr class="header1">
                    <th>상품 코드</th><th> 상품명</th> <th>요청 수량</th> <th v-if="item.orderCondition=='검수대기' ||item.orderCondition=='검수완료' "> 검수 수량</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="allpost" v-for="(product, rowIndex) in list" :key="rowIndex">
                      <td>{{ product.productCode }}</td>
                      <td>{{ product.productName }}</td>
                      <td>{{ product.requestProductCount }}</td>
                      <td v-if="item.orderCondition=='검수대기'"> <input type="number"v-model.number="product.requestOrderGetCount" min="0"  ></td>
                      <td v-if="item.orderCondition=='검수완료'">{{ product.requestProductGetCount }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br>
             <div v-if="exchangeList!=[]">
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
             </div>

             <div class="but-group">
               <input class="but" type="button" value="검수하기" @click="gumsoo" v-if="item.orderCondition == '검수대기'">
             </div>
           <div v-if="item.orderCondition == '승인거부' || item.orderCondition=='승인대기'">
             <div v-if="item.orderCondition == '승인거부'" >
               <div class="divvv-title">거절 사유</div>
               <div class="divvv3"> {{item.orderReason}}</div>
             </div>

           </div>

          </div>
          발주일자 : {{ item.orderDate }}
           <br>
           주문코드 : {{ item.orderCode }}<br>   
          <div class="action-buttons" v-if="item.orderCondition=='승인대기' || item.orderCondition=='승인거부'">
            <input class="cancel-btn" type="button" value="수정하기" @click="clickUpdate">
          </div>
         <button style="float: right" class="cancel-btn" @click="showDetailPopup" >돌아가기</button>
       </div>

    <FranchiseOrderUpdatePopup
        v-if="updateStatus==true"
        :item="item"
        :clickUpdate="clickUpdate"
        :showDetailPopup = "showDetailPopup"
    />
   </div>




</template>

<script setup>
  import { ref } from "vue";
  import axios from 'axios';
  import { useStore } from 'vuex'; // Vuex store 임포트
  const store = useStore(); // Vuex store 사용
  import FranchiseOrderUpdatePopup from "@/components/order/FranchiseOrderUpdatePopup.vue";

  const updateStatus = ref(false);
  const clickUpdate = () =>{
    updateStatus.value = !updateStatus.value;
  }

  const exchangeHeaders = ref([
    { key: 'productName', label: '상품명' },
    { key: 'exchangeProductCount', label: '요청 수량' },
  ]);

 const props = defineProps({
   showDetailPopup: Function,
   popupVisible: Boolean,
   writeActive: Boolean,
   detailItem: Object,
   franchiseCode: Number,
   franchiseOwnerCode: Number
 });
 const item = props.detailItem;
 const list = props.detailItem.orderProductList;
 const exchangeList = props.detailItem.exchangeProductList;

 // 추후 개선 예정
 const franchiseOwnerCode = props.franchiseOwnerCode;
 console.log(item);
 console.log(list);
 console.log(exchangeList);


const reason = ref('');
const clickGumsoo = () =>{
  isDenied.value = !isDenied.value;
}

const gumsoo = async () => {
  console.log(item.orderCode);

  const requestData = {
    orderCode: item.orderCode,
    requestProduct: Object.fromEntries(list.map(product => [
       product.requestProductCode, product.requestOrderGetCount
    ]))
  };
  console.log(requestData);

  try {

    const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`http://api.pioms.shop/franchise/order/check?franchiseOwnerCode=${franchiseOwnerCode}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(requestData)
    });
    if(response.status ==406){
      alert("이 발주는 이미 처리되어 있습니다.");
      clickGumsoo();
      props.showDetailPopup();
      return;
    }
    if (!response.ok) {
      alert("헉 왜 주문 거절 안되지????????????")
      throw new Error('네트워크 오류 발생');
    }
  } catch (error) {
    alert("헉 왜 주문 거절 안되지????????????");
    console.error('오류 발생:', error);
  }
};



</script>


<style scoped>
  @import "../../assets/css/popup.css" ;
  @import "../../assets/css/order.css" ;


</style>
