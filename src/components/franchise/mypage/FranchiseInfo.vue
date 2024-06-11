<template>
  <div align="center" style="">

    <div class="headerTitlee"  style="float: left;">
      <p class="product-titlee"><img src="@/assets/icon/List.png" style="width: 20px;height: 20px">가맹점 관리 > 가맹점 정보 관리</p>
    </div>

    <div class="popup-content2" >
      <div class="info" >
        <h1 align="center" style="font-size: 25px;">가맹점 정보</h1>

        <div style="display:flex;" align="center">
          <div class="divvv" style="width: 100%;">
            <div class="divvv2" >
              <div class="divvv3-title">
                점포명
              </div>
              <div class="divvv3">
                {{franchise.franchiseName}}
              </div>
            </div>
            <div class="divvv2">
              <div class="divvv3-title">
                점포주소
              </div>
              <div class="divvv3">
                {{franchise.franchiseAddress}}
              </div>
            </div>
            <div class="divvv2">
              <div class="divvv3-title">
                점포전화번호
              </div>
              <div class="divvv3">
                {{franchise.franchiseCall}}
              </div>
            </div>
            <div class="divvv2">
              <div class="divvv3-title">
                사업자번호
              </div>
              <div class="divvv3">
                {{franchise.franchiseBusinessNum}}
              </div>
            </div>
            <div class="divvv2">
              <div class="divvv3-title">
                점포배송일
              </div>
              <div class="divvv3">
                {{franchise.franchiseDeliveryDate}}
              </div>
            </div>
            <div class="divvv2">
              <div class="divvv3-title">
                담당 관리자
              </div>
              <div class="divvv3">
                {{franchise.adminName}}
              </div>
            </div>
            <div class="divvv2">
              <div class="divvv3-title">
                담당 배송기사
              </div>
              <div class="divvv3">
                {{franchise.deliveryDriver.driverName}}<br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></div>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios';
import { useStore } from 'vuex'; // Vuex store 임포트
import Swal from "sweetalert2";
const store = useStore(); // Vuex store 사용

const franchise = ref(null);

const getMyFranchise = async () => {
  try {
    const accessToken = store.state.accessToken;
    const userRole = store.state.userRole;
    const userId = store.state.userCode;

    const response = await fetch(`http://localhost:5000/franchise/myInfo`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch franchise owners');
    }

    const data = await response.json();
    console.log(data);
    franchise.value = data;

  } catch (error) {
    console.error('Failed to fetch franchise owners:', error);
  }
};
getMyFranchise();


</script>


<style scoped>
@import "../../../assets/css/popup.css" ;
@import "../../../assets/css/order.css" ;


.popup-content2 {

  padding: 20px;
  width: 55%;
  max-width: 2000px;
  height: 73%;
  max-height: 90vh;
  //display: flex;

}

.headerTitlee img {
  width: 10px;
  height: 10px;
}
.headerTitlee p {
  font-size: 20px;
  font-weight: bold;
}
</style>
