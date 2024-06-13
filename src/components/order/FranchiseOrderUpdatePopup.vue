<template>
    <div class="popup-overlay" v-if="writeActive">
      <div class="popup-content">

        <div class="info">
        <div class="divvv-title">발주서 수정</div>

      <div class="filter-container">
          <div class="radio-group">
            <div class="title"><label style="width:100px">검색 </label></div>
            <input v-model="filter" placeholder="검색어를 입력하세요" @input="applyFilter"  @keyup.enter="applyFilter" />
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



      <div class="divvv-title">상품 리스트</div>
      <div class="table-container" style="max-height: 100px; max-height: 400px; /* 원하는 최대 높이를 설정하세요 */overflow-y: auto; overflow-x: auto;  ">
        <table class="table">
            <thead>
              <tr class="header1">
                <th>상품 코드</th><th>상품 이름</th><th>상품 가격</th><th>본사 수량</th><th>상품 상태</th><th>색상</th><th>상품 설명</th><th>카테고리(대)</th><th>카테고리(중)</th><th>카테고리(소)</th><th>성별</th>
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

        <div class="table-container" style=" max-height: 100px; max-height: 400px; /* 원하는 최대 높이를 설정하세요 */overflow-y: auto; overflow-x: auto;  ">
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
            <td>{{ selectedProduct.productCode }}</td>
            <td>{{ selectedProduct.productName }}</td>
            <td>{{ selectedProduct.productCount }}</td>
            <td><input type="number" v-model="selectedProduct.quantity" min="1" @change="calculateTotalPrice" /></td>
            <td><button class="ho-btn" @click="removeProductFromList(index)">취소</button></td>
          </tr>
        </table>
      </div >
    <div class="action-buttons" >
        <p v-if="totalPrice > 0">총 가격: {{ totalPrice.toLocaleString() }}원</p>
        <button class="ho-btn" @click="exportOrder">수정하기</button>
        <button class="ho-btn" @click="props.clickUpdate" >돌아가기</button>
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
    item:Object,
    clickUpdate:Function,
    showDetailPopup: Function
  });
  const franchiseOwnerCode = props.franchiseOwnerCode;

  const writeActive = ref(true);
  const filter = ref("");
  const conditionFilter = ref("");
  const filteredLists = ref([]);

  const applyFilter = () => {
    if(conditionFilter.value == ""){
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
  const selectedProducts = ref([]);
  const totalPrice = ref(0);

  const getProducts = async () => {
    try {
      const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
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
      for (let i = 0; i < props.item.orderProductList.length; i++) {
        const obj = props.item.orderProductList[i];
        console.log(obj);
        if(products.value.find(element => element.productCode == obj.productCode) !=null)
          selectedProducts.value.push(products.value.find(element => element.productCode == obj.productCode));
        console.log(selectedProducts.value);
      }

      console.log(products);

    } catch (error) {
      console.error("오류 발생:", error);
    }
  };
  getProducts();



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

    const productsData = selectedProducts.value.reduce((acc, product) => {
      acc[product.productCode] = product.quantity;
      return acc;
    }, {});

    const orderData = {
      orderCode: props.item.orderCode,
      products: productsData,
    };

    try {
      const accessToken = store.state.accessToken;
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await fetch(`http://api.pioms.shop/franchise/order`, {
          method: "PUT",
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

      await Swal.fire({
        position: "center",
        icon: "success",
        title: "발주 수정 성공.",
        showConfirmButton: false,
        timer: 1500
      });
      location.reload(FranchiseOrderPage);


    } catch (error) {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "발주 수정 실패.",
        showConfirmButton: false,
        timer: 1500
      });
      location.reload(FranchiseOrderPage);
    }

};
</script>


<style scoped>
  @import "../../assets/css/popup.css" ;
</style>
