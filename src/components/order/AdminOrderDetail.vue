<template>
  <div class="popup-overlay" >
       <div class="popup-content">
           <button class="close" @click="showDetailPopup" >돌아가기</button>
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
            

            <div class="divvv-title">
                발주상품
            </div>
            <div style="display: block; font-size: 1.5lh; display:flex; justify-content: center; font-weight: 1000; width:100%;" align = "center">
              <table>
                <thead>
                  <tr>
                    <th v-for="(header, index) in headers" :key="index">{{ header.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="table" v-for="(product, rowIndex) in list" :key="rowIndex">
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
            <div style="display: block; font-size: 1.5lh; display:flex; justify-content: center; font-weight: 1000; width:100%" align = "center">
              <table>
                <thead>
                  <tr>
                    <th v-for="(header, index) in exchangeHeaders" :key="index">{{ header.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="table" v-for="(product, rowIndex) in exchangeList" :key="rowIndex">
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

            <div class="but-group" v-if="item.orderCondition == '승인대기'">
              <input class="but" type="button" value="발주승인" @click="accpetOrder">
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
                        <thead >
                          <tr>
                            <th  v-for="(header, index) in headers" :key="index" >{{ header.label }}</th>
                          </tr>
                        </thead>
                        <tbody >
                          <tr class="table" v-for="(product, rowIndex) in list" :key="rowIndex">
                            <td v-for="(header, colIndex) in headers" :key="colIndex">
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
          발주일자 : {{ item.orderDate }}
           <br>
           주문코드 : {{ item.orderCode }}<br>   
       </div>
   </div>

   

       
</template>

<script setup>
   import { ref } from "vue";
   import axios from 'axios';

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
    const authToken = localStorage.getItem('access');
    const headers = {
            'access': authToken,
            'Content-Type': 'application/json',
        };
    try {
      const response = await fetch(`http://localhost:5000/admin/order/${item.orderCode}/accept`, {
        method: 'PUT',
        headers: headers,
        credentials: 'include'
      });
      if(response.status ==406){
        alert("이 발주는 이미 처리되어 있습니다.");
        props.showDetailPopup();
        
        return;
      }
      if (!response.ok) {
        alert("헉 왜 주문 승인 안되지????????????")
        props.showDetailPopup();
        throw new Error('네트워크 오류 발생');
      }
    
      props.showDetailPopup();
      props.getOrderList();
    } catch (error) {
      console.error('오류 발생:', error);
      props.showDetailPopup();
    }
};

const isDenied = ref(false);
const reason = ref('');
const clickDeny = () =>{
  isDenied.value = !isDenied.value;
}

const denyOrder = async () => {
    const authToken = localStorage.getItem('access');
    const headers = {
            'access': authToken,
            'Content-Type': 'application/json',
        };
    try {
      const response = await fetch(`http://localhost:5000/admin/order/${item.orderCode}/deny?denyMessage=${reason.value}`, {
        method: 'PUT',
        headers: headers,
        credentials: 'include'
      });
      if(response.status ==406){
        alert("이 발주는 이미 처리되어 있습니다.");
        clickDeny();
        props.showDetailPopup();
        props.getOrderList();
        return;
      }
      if (!response.ok) {
        alert("헉 왜 주문 거절 안되지????????????")
        props.showDetailPopup();
        throw new Error('네트워크 오류 발생');
      }
    } catch (error) {
      alert("헉 왜 주문 거절 안되지????????????");
      props.showDetailPopup();
      console.error('오류 발생:', error);
    }
};



</script>


<style scoped>



  </style>
  