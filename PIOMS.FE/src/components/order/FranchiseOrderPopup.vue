<template>
    <div class="popup-overlay" v-if="writeActive">
      <div class="popup-content">


        <div class="info">
          <div class="divvv-title">발주서 생성</div>

      <div class="filter-container">
          <div class="radio-group">
            <div class="title"><label style="width:100px">검색 </label></div>
            <input v-model="filter"  placeholder="검색어를 입력하세요" @input="applyFilter" @keyup.enter="applyFilter"/>

          </div>

          <div class="radio-group">
            <div class="title"><label style="width:100px">상품상태</label></div>

            <input type="radio" value="" name="dateOrder" v-model="conditionFilter" @change="applyFilter" checked>
            <label> 전체 </label>
            <input type="radio" value="공급가능" name="dateOrder" v-model="conditionFilter" @change="applyFilter" >
            <label>공급가능</label>
            <input type="radio" value="일시제한" name="dateOrder" v-model="conditionFilter" @change="applyFilter" >
            <label>일시제한</label>
            <input type="radio" value="단종" name="dateOrder" v-model="conditionFilter" @change="applyFilter" >
            <label>단종</label>
            <input type="radio" value="품절" name="dateOrder" v-model="conditionFilter" @change="applyFilter">
            <label>품절</label>

          </div>
      </div>

      <div class="divvv-title">상품 리스트</div>

      <div class="table-container" style="max-height: 100px; max-height: 400px; /* 원하는 최대 높이를 설정하세요 */overflow-y: auto; overflow-x: auto;  ">
        <table class="table" style="">
            <thead>
              <tr class="header1">
                <th>상품 코드</th><th>상품 이름</th><th>상품 가격</th><th>본사 수량</th><th>상품 상태</th><th>색상</th><th>상품 설명</th><th>카테고리(대)</th><th>카테고리(중)</th><th>카테고리(소)</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(product, index) in filteredLists" :key="index"
                  :id="'row-' + index"
                  @dblclick="addProductToList(product)"
                  @mouseenter="highlightRow(index)"
                  @mouseleave="resetRowColor(index)"
                  class="allpost">

                <td>{{ product.productCode }}</td>
                <td>{{ product.productName }}</td>
                <td>{{ product.productPrice }}원</td>
                <td>{{ product.productCount }}개</td>
                <td>{{ product.productStatus }}</td>
                <td>{{ product.productColor }}</td>
                <td>{{ product.productContent }}</td>
                <td>{{ product.categoryFirstName }}</td>
                <td>{{ product.categorySecondName }}</td>
                <td>{{ product.categoryThirdName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
        <br>

        <div class="divvv-title" style="height: 30px;">선택된 상품 리스트</div>
        <div class="table-container">
          <table class="table">
          <thead>
            <tr class="header1">
              <th>상품 코드</th>
              <th>상품 이름</th>
              <th>상품 수량</th>
              <th>수량</th>
              <th>선택</th>
            </tr>
          </thead>
          <tr v-for="(selectedProduct, index) in selectedProducts" :key="index"
            class="allpost"
          >
            <td >{{ selectedProduct.productCode }}</td>
            <td>{{ selectedProduct.productName }}</td>
            <td>{{ selectedProduct.productCount }}</td>
            <td><input type="number" v-model="selectedProduct.quantity" min="1" @change="calculateTotalPrice" /></td>
            <td><button class="cancel-btn" @click="removeProductFromList(index)">취소</button></td>
          </tr>
        </table>
      </div >
        <p v-if="totalPrice > 0">총 가격: {{ totalPrice }}원</p>
      <div style="display: flex; justify-content: right; gap:10px;">
        <button style="float: right" class="ho-btn" @click="exportOrder">발주신청하기</button>
        <button style="float: right" class="ho-btn" @click="showPopup" >돌아가기</button>
      </div>
    </div>
  </div>



  </template>

<script setup>
  import { ref } from "vue";
  import { useStore } from 'vuex';
  import Swal from "sweetalert2";
  import FranchiseOrderPage from "@/components/order/FranchiseOrderPage.vue"; // Vuex store 임포트
  const store = useStore(); // Vuex store 사용


  const props = defineProps({
    showPopup: Function,
    popupVisible: Boolean,
    writeActive: Boolean,
    franchiseCode:Number,
    franchiseOwnerCode:Number
  });
  const franchiseOwnerCode = props.franchiseOwnerCode;
  const franchiseCode = props.franchiseCode;

  const writeActive = ref(true);
  const filter = ref("");
  const conditionFilter = ref("");
  const filteredLists = ref([]);

  const applyFilter = () => {
    if(conditionFilter.value === ""){
      filteredLists.value = products.value.filter((item) => {
        const matchesFilter = filter.value
            ? item.productName.toLowerCase().includes(filter.value.toLowerCase())
            : true;
        return matchesFilter;
      });
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
      const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
      // const response = await fetch("http://api.pioms.shop/franchise/product", {
      const response = await fetch("http://api.pioms.shop/franchise/product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
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
    orderTotalPrice: totalPrice.value,
    products: productsData,
    franchiseCode: franchiseCode
  };

  try {
    const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
    // const response = await fetch(`http://api.pioms.shop/franchise/order`, {
    const response = await fetch(`http://api.pioms.shop/franchise/order`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

    if (!response.ok) {
      throw new Error("네트워크 오류 발생");
    }
    const result = await response.json();

    await Swal.fire({
      position: "center",
      icon: "success",
      title: "발주 요청 완료",
      showConfirmButton: false,
      timer: 1500
    });
    location.reload(FranchiseOrderPage);
    props.showPopup();

  } catch (error) {
    await Swal.fire({
      position: "center",
      icon: "error",
      title: "발주 요청 실패",
      showConfirmButton: false,
      timer: 1500
    });
    props.showPopup();
    location.reload(FranchiseOrderPage);
    console.error("주문 오류 발생:", error);
  }

};
</script>
<style scoped>
  @import "../../assets/css/popup.css" ;
  @import "../../assets/css/order.css" ;


</style>
