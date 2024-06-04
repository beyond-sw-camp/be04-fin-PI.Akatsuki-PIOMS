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
      </div>

    <div align="center">
      <h3>상품 리스트</h3>
      <div class="table-wrapper" align="center">
          <table>
            <thead>
              <tr>
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
                  align="center">
                <td>{{ product.franchiseWarehouseCode }}</td>
                <td>{{ product.product.productName }}</td>
                <td>{{ product.franchiseWarehouseTotal }}</td>
                <td>{{ product.franchiseWarehouseEnable }}</td>
                <td>{{ product.franchiseWarehouseCount }}</td>
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
            <tr align="center">
              <th>상품 코드</th>
              <th>상품 이름</th>
              <th>상품 수량</th>
              <th>반품/폐기</th>
              <th>수량</th>
              <th>선택</th>
            </tr>
          </thead>
          <tr v-for="(selectedProduct, index) in selectedProducts" :key="index" align="center">
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
      <div style="display: flex; justify-content: right;">
        <button @click="exportExchange">반품신청하기</button>
        <button class="close" @click="showPopup" >돌아가기</button>
      </div>
      </div>
    </div>
  </div>

  </template>

<script setup>
  import { ref } from "vue";
  import { useStore } from 'vuex'; // Vuex store 임포트
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
      const response = await fetch(`http://api.pioms.shop/warehouse/list`, {
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
      console.log(products.value);
      console.log(filteredLists.value);

    } catch (error) {
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
    const response = await fetch(`http://api.pioms.shop/franchise/exchange`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exchangeData)
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
  @import "../../assets/css/order.css" ;
</style>
