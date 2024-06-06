<template>

    <div class="popup-overlay">
      <div class="popup-content">
        <div class="info">
        <h2 align="center">반품서 생성</h2>
        <br /><br /><br />


      <div class="divvv-title">상품 리스트</div>

      <div class="table-container" >
          <table class="table">
            <thead>
              <tr class="header1">
                <th>가맹상품 코드</th><th>상품 이름</th><th>누적량</th> <th>보유량</th><th>판매가능수량</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(product, index) in filteredLists" :key="index"
                  :id="'row-' + index"
                  @dblclick="addProductToList(product)"
                  @mouseenter="highlightRow(index)"
                  @mouseleave="resetRowColor(index)"
                  style="cursor: pointer;"
                  class="allpost">
                <td>{{ product.franchiseWarehouseCode }}</td>
                <td>{{ product.product.productName }}</td>
                <td>{{ product.franchiseWarehouseTotal }}</td>
                <td>{{ product.franchiseWarehouseEnable }}</td>
                <td>{{ product.franchiseWarehouseCount }}</td>
              </tr>
            </tbody>
          </table>
      </div>
        <br>
          <div class="divvv-title" style="height: 30px;">선택된 상품 리스트 새 로 고 침 넣 자</div>
          <div class="table-container">
            <table class="table">
              <thead>
              <tr class="header1">
                  <th>상품 코드</th>
                  <th>상품 이름</th>
                  <th>상품 수량</th>
                  <th>반품/폐기</th>
                  <th>수량</th>
                  <th>선택</th>
                </tr>
              </thead>
              <tr v-for="(selectedProduct, index) in selectedProducts" :key="index"
                  class="allpost"
              >
                <td>{{ selectedProduct.franchiseWarehouseCode }}</td>
                <td>{{ selectedProduct.product.productName }}</td>
                <td>{{ selectedProduct.franchiseWarehouseEnable }}</td>
                <td align="center">
                  <select v-model="selectedProduct.exchangeProductStatus">
                  <option value="교환">교환</option>
                  <option value="폐기">폐기</option>
                </select>
              </td>
                <td><input type="number" v-model="selectedProduct.quantity" min="1" @change="calculateTotalPrice" /></td>
                <td><button class="button2" @click="removeProductFromList(index)">취소</button></td>
              </tr>
            </table>
          </div>
    </div>
      <div style="display: flex; justify-content: right; gap: 10px">
        <button @click="exportExchange">반품신청</button>
        <button class="close" @click="showPopup">돌아가기</button>
      </div>
      </div>
    </div>

  </template>

<script setup>
  import { ref } from "vue";
  import { useStore } from 'vuex';
  import FranchiseExchangePage from "@/components/exchange/FranchiseExchangePage.vue";
  import Swal from "sweetalert2"; // Vuex store 임포트
  const store = useStore(); // Vuex store 사용e

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
        ? item.productName.toLowerCase().includes(filter.value.toLowerCase())
        : true;
      return matchesFilter;
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
      const response = await fetch(`http://localhost:5000/franchise/warehouse/list`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error("네트워크 오류 발생");
      }
      const data = await response.json();

      products.value = data;
      filteredLists.value = products.value;
    } catch (error) {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "잘못된 요청입니다.",
        showConfirmButton: false,
        timer: 1500
      });
      console.error("오류 발생:", error);
    }
  };
  getProducts();

  const selectedProducts = ref([]);
  const totalPrice = ref(0);

  const addProductToList = (product) => {
    if (!selectedProducts.value.some((p) => p.franchiseWarehouseCode === product.franchiseWarehouseCode)) {
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


  const exportExchange = async () => {
  console.log("exportExchange");

  // selectedProducts 배열에서 필요한 데이터 추출
  const productsData = selectedProducts.value.map((product) => ({
    productCode: product.product.productCode,
    exchangeProductCount: product.quantity,
    exchangeProductStatus: product.exchangeProductStatus
  }));

  const exchangeData = {

    exchangeStatus: "반송신청",
    products: productsData
  };

  try {
    const accessToken = store.state.accessToken;
      if (!accessToken) {
        throw new Error('No access token found');
      }
    const response = await fetch(`http://localhost:5000/franchise/exchange`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exchangeData)
    });

    if (!response.ok) {
      throw new Error("네트워크 오류 발생");
    }
    const result = await response.json();
    console.log("주문 성공:", result);
    await Swal.fire({
      position: "center",
      icon: "success",
      title: "반품 신청 완료되었습니다.",
      showConfirmButton: false,
      timer: 1500
    });
    props.showPopup();

    location.reload(FranchiseExchangePage);

  } catch (error) {
    await Swal.fire({
      position: "center",
      icon: "error",
      title: "잘못된 요청입니다.",
      showConfirmButton: false,
      timer: 1500
    });
    console.error("주문 오류 발생:", error);
  }
};


  </script>


<style scoped>
  @import "../../assets/css/order.css" ;
  @import "../../assets/css/popup.css" ;
</style>
