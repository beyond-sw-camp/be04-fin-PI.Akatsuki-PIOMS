<template>
  <div class="popup-overlay" >
       <div class="popup-content">
           <span class="close" @click="showDetailPopup">&times;</span>
           
           <br>
           <div class="info">
                <h2 align="center">발주서</h2>
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
                            sadfsadf 
                          </div>
                          <div class="divvv3">
                             asdfsadf
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
                            가맹점주소 
                          </div>
                          <div class="divvv3">
                            asdf
                             <!-- {{ item.franchiseAddress }} -->
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
            <div class="divvv-title">
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
              <input class="but" type="button" value="발주승인">
              <input class="but" type="button" value="발주반려">
            </div>
            
          </div>
          배송 예정일 : {{ item.deliveryDate }}
           <br>
           주문코드 : {{ item.orderCode }}<br>   
       </div>
   </div>

   

       
</template>

<script setup>
   import { ref } from "vue";
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
 console.log(item);
 console.log(list);
 console.log(exchangeList);

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
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .popup-content button:hover {
    background-color: #45a049;
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
  </style>
  