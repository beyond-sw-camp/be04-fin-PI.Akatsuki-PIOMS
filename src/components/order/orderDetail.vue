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
                          <div class="divvv3">
                            관리자
                          </div>
                          <div class="divvv3">
                            {{ item.adminCode }}
                          </div>
                        </div>
                        <div class="divvv2">
                          <div class="divvv3">
                              관리자명 
                          </div>
                          <div class="divvv3">
                             {{ item.adminName }}
                          </div>
                        </div>
                        <div class="divvv2">
                          <div class="divvv3">
                            점주전화번호
                          </div>
                          <div class="divvv3">
                             {{item.franchiseOwnerPhone}}
                          </div>
                        </div>
                    </div>

                    <div class="divvv">
                      <div class="divvv2" >
                          <div class="divvv3">
                            가맹점
                          </div>
                          <div class="divvv3">
                            {{ item.franchiseName }}
                          </div>
                        </div>
                        <div class="divvv2">
                          <div class="divvv3">
                              점주명 
                          </div>
                          <div class="divvv3">
                             {{ item.franchiseOwnerName }}
                          </div>
                        </div>
                        <div class="divvv2">
                          <div class="divvv3">
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
            <div class="but-group">
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
 });
 const item = props.detailItem;
 const list = props.detailItem.orderProductList;
 const exchangeList = props.detailItem.exchangeProductList;

 // 추후 개선 예정 
 const adminCode = 2;
 const franchiseCode = 1;

 console.log(item);
 console.log(list);
 console.log(exchangeList);


const accpetOrder = async () => {
    try {
      const response = await fetch(`/api/admin/order/${item.orderCode}/accept?adminCode=${adminCode}`, {
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

const isDenied = ref(false);
const reason = ref('');
const clickDeny = () =>{
  isDenied.value = !isDenied.value;
}

const denyOrder = async () => {
  console.log(item.orderCode);
    try {
      const response = await fetch(`/api/admin/${adminCode}/order/${item.orderCode}/deny?adminCode=${adminCode.valueOf}&denyMessage=${reason.value}`, {
        method: 'PUT',
      });
      if(response.status ==406){
        alert("이 발주는 이미 처리되어 있습니다.");
        clickDeny();
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

  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  
  
  .popup-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    width: 90%;
    max-width: 2000px;
    height: 80%;
    overflow-y: auto;
    max-height: 80vh;
  }
  
  .popup-content h2 {
    margin-bottom: 20px;
  }
  
  .popup-content .form-group {
    margin-bottom: 20px;
  }
  
  .popup-content label {
    font-weight: bold;
  }
  
  .popup-content input[type="text"],
  .popup-content textarea {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    resize: none;
    height: auto;
  }
  
  .popup-content button {
    padding: 10px 20px;
    background-color: gray;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .popup-content button:hover {
    background-color: hotpink;
  }
  .but-group {
    display: flex;
    justify-content: right;
    align-items: center;
  }
  
  .but {
    margin-bottom: 10px;
    margin-right: 10px;
    border-radius: 10px;
    border: 1px solid #D9D9D9;
    background-color: #D9D9D9;
    color: #000000;
    font-size: 20px;
    font-weight: 400;
    font-family: 'Inter', sans-serif;
    width: 10%;
  }
  
  .but:hover {
    background-color: #333333;
  }
  
  .but.active {
    background-color: #FEDB56;
    border-color: #FEDB56;
  }
  
  .popup-content::-webkit-scrollbar {
    display: none;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    border: 1.5px solid #000000;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    font-size: 20px;
    font-weight: 500;
    
  }
  
  th {
    background-color: #f2f2f2;
    text-align: left;
    
  }
  
  
  .pagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  button {
    margin: 0 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .highlighted {
    background-color: hotpink;
  }

  .divvv-title{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #D9D9D9; 
    height:100%; 
    width:99.9%; 
    font-size: 1lh;
    font-weight: 1000;
    border: 1px solid #000000;    
    padding-top: 5px;
    padding-bottom: 5px;
    /* padding: 5px; */
  }

  .divvv {
    display: block;
    justify-content: center;
    align-items: center;
    background-color: white; 
    height:100%; 
    width:50%; 
    border: 1px solid #000000;    
  }
  
  .divvv2 {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white; 
    height: 33.33333333%;
    width:100%; 
    border-right: 1px solid #000000;    
    border-bottom: 1px solid #000000;    
  }
  .divvv3 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width:100%; 
    font-size: 20px;
    border-left: 1px solid #000000;    
  }

  .info{
    border: 3px solid #000000;    
  }

  thead {
    border-bottom: 2px solid black;
  }


  </style>
  