<template>
    <div class="popup-overlay" v-if="writeActive">
      <div class="popup-content">
        
        
        <div class="info">
        <h2 align="center">발주서 생성</h2>
        <br /><br /><br />

      <div class="filter-container">
          <div class="radio-group">
            <div class="title"><label style="width:100px">검색 </label></div>
            <input v-model="filter" placeholder="검색어를 입력하세요" @input="applyFilter" />
          </div>

          <div class="radio-group">
            <div class="title"><label style="width:100px">상품상태</label></div>

            <label>
              전체 <input type="radio" value="" name="dateOrder" v-model="conditionFilter" @change="applyFilter" checked>
            </label>
            <label>
              공급가능 <input type="radio" value="공급가능" name="dateOrder" v-model="conditionFilter" @change="applyFilter" >
            </label>
            <label>
              일시제한 <input type="radio" value="일시제한" name="dateOrder" v-model="conditionFilter" @change="applyFilter" >
            </label>
            <label>
              단종 <input type="radio" value="단종" name="dateOrder" v-model="conditionFilter" @change="applyFilter" >
            </label>
            <label>
              품절 <input type="radio" value="품절" name="dateOrder" v-model="conditionFilter" @change="applyFilter">
            </label>
          </div>
      </div>

    <div align="center">
      <h3>상품 리스트</h3>
      <div class="table-wrapper" align="center">
          <table>
            <thead>
              <tr>
                <th>상품 코드</th><th>상품 이름</th><th>상품 가격</th><th>본사 수량</th><th>상품 상태</th><th>색상</th><th>상품 설명</th><th>상품카테고리</th><th>성별</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(product, index) in filteredLists" :key="index" 
                  :id="'row-' + index"
                  @dblclick="addProductToList(product)" 
                  @mouseenter="highlightRow(index)"
                  @mouseleave="resetRowColor(index)"
                  style="cursor: pointer;">
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
      </div>
        <br>
        <div align="center">
        <h3>선택된 상품 리스트</h3>
        <div class="table-wrapper2">
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
            <td><button class="button2" @click="removeProductFromList(index)">취소</button></td>
          </tr>
        </table>
      </div >
    </div>
      <div style="display: flex; justify-content: right;">
        <p v-if="totalPrice > 0">총 가격: {{ totalPrice }}원</p>
        <button @click="exportOrder">발주신청하기</button>
        <button class="close" @click="showPopup" >돌아가기</button>
      </div>
      </div>
    </div>
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
    if(conditionFilter.value == ""){
      filteredLists.value = products.value;
      return;
    }
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
    // products: productsData,
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

</style>
  