<template>
    <div class="popup-overlay" v-if="writeActive">
      <div class="popup-content">
        <span class="close" @click="showPopup">&times;</span>
        
        <h2 align="center">발주서 생성</h2>
        <br /><br /><br />
        <div>
          <input v-model="filter" placeholder="검색어를 입력하세요" @input="applyFilter" />
          <select v-model="conditionFilter" @change="applyFilter">
            <option value="">주문 상태</option>
            <option value="공급가능">공급가능</option>
            <option value="일시제한">일시제한</option>
            <option value="단종">단종</option>
            <option value="품절">품절</option>
          </select>
          <table>
            <thead>
              <tr>
                <th>상품 코드</th>
                <th>상품 이름</th>
                <th>상품 가격</th>
                <th>본사 수량</th>
                <th>상품 상태</th>
                <th>색상</th>
                <th>상품 설명</th>
                <th>상품카테고리</th>
                <th>성별</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in filteredLists" :key="index" 
                  :id="'row-' + index"
                  @dblclick="addProductToList(product)" 
                  @mouseenter="highlightRow(index)"
                  @mouseleave="resetRowColor(index)">
                <td>{{ product.productCode }}</td>
                <td>{{ product.productName }}</td>
                <td>{{ product.productPrice }}원</td>
                <td>{{ product.productCount }}개</td>
                <td>{{ product.productStatus }}</td>
                <td>{{ product.productColor }}</td>
                <td>{{ product.productContent }}</td>
                <td>{{ product.categoryThirdCode }}</td>
                <td>{{ product.productGender }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <h3>선택된 상품 리스트</h3>
        <div></div>
        <table>
          <thead>
            <tr>
              <th>상품 코드</th>
              <th>상품 이름</th>
              <th>상품 수량</th>
              <th>수량</th>
              <th>선택</th>
            </tr>
          </thead>
          <tr v-for="(selectedProduct, index) in selectedProducts" :key="index">
            <td>{{ selectedProduct.productCode }}</td>
            <td>{{ selectedProduct.productName }}</td>
            <td>{{ selectedProduct.productCount }}</td>
            <td><input type="number" v-model="selectedProduct.quantity" min="1" @change="calculateTotalPrice" /></td>
            <td><button @click="removeProductFromList(index)">취소</button></td>
          </tr>
        </table>
        <p v-if="totalPrice > 0">총 가격: {{ totalPrice }}원</p>
      </div>
      <button @click="exportOrder">발주신청하기</button>
    </div>
    

  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const props = defineProps({
    showPopup: Function,
    popupVisible: Boolean,
    writeActive: Boolean,
  });
  
  const writeActive = ref(true);
  const filter = ref("");
  const conditionFilter = ref("");
  const filteredLists = ref([]);
  
  const applyFilter = () => {
    filteredLists.value = products.value.filter((item) => {
      const matchesFilter = filter.value
        ? item.productName.toLowerCase().includes(filter.value.toLowerCase()) ||
          item.productPrice.toString().includes(filter.value)
        : true;
      const matchesCondition = conditionFilter.value
        ? item.productStatus === conditionFilter.value
        : true;

      return matchesFilter && matchesCondition;
    });
    console.log("Filtered Lists:", filteredLists.value);
  };
  
  const products = ref([]);
  
  const getProducts = async () => {
    try {
      const response = await fetch("/api/franchise/product", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("네트워크 오류 발생");
      }
      const data = await response.json();
      products.value = data.map(({ orderProductList, ...rest }) => ({ ...rest, quantity: 1 }));
      filteredLists.value = products.value;
      console.log(products);
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };
  getProducts();
  
  const selectedProducts = ref([]);
  const totalPrice = ref(0);
  
  const addProductToList = (product) => {
    if (!selectedProducts.value.some((p) => p.productCode === product.productCode)) {
      selectedProducts.value.push(product);
      calculateTotalPrice();
    }
  };
  
  const removeProductFromList = (index) => {
    selectedProducts.value.splice(index, 1);
    calculateTotalPrice();
  };
  
  const calculateTotalPrice = () => {
    totalPrice.value = selectedProducts.value.reduce((acc, curr) => acc + (curr.productPrice * curr.quantity), 0);
  };
  
  const highlightRow = (index) => {
    document.querySelector(`#row-${index}`).classList.add('highlighted');
  };
  
  const resetRowColor = (index) => {
    document.querySelector(`#row-${index}`).classList.remove('highlighted');
  };


  const exportOrder = async () => {
  console.log("exportOrder");

  const productsData = selectedProducts.value.reduce((acc, product) => {
    acc[product.productCode] = product.quantity;
    return acc;
  }, {});
  const orderData = {
    products: productsData,
    franchiseCode: 1 // 실제 프랜차이즈 코드를 사용 예정
  };
  try {
    const response = await fetch("/api/franchise/1/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });
    
    if (response.status == 406) {
      alert("생각은 하셨나요? 신청 재고량 너무 많거나, 이미 승인 대기중인 발주가 존재합니다.");
      props.showPopup();
      throw new Error("");
    }
    if (!response.ok) {
      alert("불가불가불가사리");
      props.showPopup();
      throw new Error("네트워크 오류 발생");
    }
    const result = await response.json();
    console.log("주문 성공:", result);
    props.showPopup();
  } catch (error) {
    console.error("주문 오류 발생:", error);
  }

};


  </script>
  
  <style scoped>
  /* 수정 팝업 스타일 */
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
  
  .img {
    height: 90%;
    width: 90%;
  }
  
  .imgForm {
    background-color: #b7b7b7;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    padding: 1px 15px 15px;
    margin: 10px;
  }
  
  .but-group {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .but {
    margin: 20px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #D9D9D9;
    background-color: #D9D9D9;
    color: #000000;
    font-size: 30px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    width: 30%;
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
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
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
  </style>
  