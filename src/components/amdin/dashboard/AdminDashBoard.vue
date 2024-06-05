<template>
  <div align="center">
    <div style="display: flex; padding-top: 1%; width: 1600px; height: 100%; gap: 2%">


      <div  style="width: 40%;height: 750px;">
        <div  style="width:100%;height: 30%; border: 1px solid #9d9d9d; border-radius: 5px; padding: 1%; margin-bottom: 2%">

          <div  style="width:100%;height: 10%; display: block; ">
            <div style="float: left; font-size: 16px; ">
              <img src="@/assets/icon/List.png" style="width:16px;padding-top:5px "/> &nbsp;발주 현황
            </div>
            <div style="font-size: 10px; float:right; padding-top: 18px;"> (단위: 주)</div>
          </div>
          <hr>

          <div  style="width:100%;height: 20%; ">
              <div  style="display: flex; width: 100%; height: 100%">
                <div class="order-title1">
                  <div class="order-title2-1" ><div class="order-title-name1">승인대기</div> </div>
                </div>
                <div class="order-title1">
                  <div class="order-title2-2" ><div class="order-title-name1">승인완료</div> </div>
                </div>
                <div class="order-title1">
                  <div class="order-title2-3" ><div class="order-title-name1">승인반려</div> </div>
                </div>
              </div>
          </div>
          <div  style="width:100%;height: 60%; ">
            <div style="display: flex; width: 100%; height: 100%">
              <div class="order-title1" style="width:33%;height: 100%; ">
                  <div class="order-title2-4" >
                    <div class="order-title-name2">{{ orderStat.waitCnt }}</div>
                  </div>
              </div>
              <div class="order-title1" style="width:33%;height: 100%; ">
                <div class="order-title2-4" >
                  <div class="order-title-name2">{{ orderStat.acceptCnt }}</div>
                </div>
              </div>
              <div class="order-title1" style="width:33%;height: 100%; ">
                <div class="order-title2-4" >
                  <div class="order-title-name2">{{ orderStat.denyCnt }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div  style="width:100%;height: 30%; border: 1px solid #9d9d9d; border-radius: 5px; padding: 1%; margin-bottom: 2%">
          <div  style="width:100%;height: 10%; display: block; ">
            <div style="float: left; font-size: 16px; ">
              <img src="@/assets/icon/List.png" style="width:16px;padding-top:5px "/> &nbsp;반품 및 교환 현황
            </div>
            <div style="font-size: 10px; float:right; padding-top: 18px;"> (단위: 주)</div>
          </div>
          <hr>

          <div  style="width:100%;height: 20%; ">
            <div  style="display: flex; width: 100%; height: 100%">

              <div class="exchange-list">
                <div style="min-height: 140px;">
                  <div class="exchange-info" v-for="(exchange, rowIndex) in paginatedLists">
                    <div class="exchange-title-name1"  style="display: flex; justify-content: space-between;font-size: 16px; ">
                      <div>{{ exchange.franchise.franchiseName }} (신청일: {{exchange.exchangeDate}})
                      </div>
                      <div v-if="exchange.exchangeStatus=='반송신청'" style="background-color: #FF6285;padding: 3px; border-radius: 5px;">{{exchange.exchangeStatus}}</div>
                      <div v-if="exchange.exchangeStatus=='반송중'" style="background-color: #FF6285;padding: 3px; border-radius: 5px;">{{exchange.exchangeStatus}}</div>
                      <div v-if="exchange.exchangeStatus=='처리대기'" style="background-color: #FF6285;padding: 3px; border-radius: 5px;">{{exchange.exchangeStatus}}</div>
                      <div v-if="exchange.exchangeStatus=='처리완료'" style="background-color: #FF6285;padding: 3px; border-radius: 5px;">{{exchange.exchangeStatus}}</div>
                      <div v-if="exchange.exchangeStatus=='반환대기'" style="background-color: #FF6285;padding: 3px; border-radius: 5px;">{{exchange.exchangeStatus}}</div>
                      <div v-if="exchange.exchangeStatus=='반환중'" style="background-color: #FF6285;padding: 3px; border-radius: 5px;">{{exchange.exchangeStatus}}</div>
                      <div v-if="exchange.exchangeStatus=='반환완료'" style="background-color: #FF6285;padding: 3px; border-radius: 5px;">{{exchange.exchangeStatus}}</div>
                    </div>
                    <hr>
                  </div>
                </div>
                <div class="pagination">
                  <button @click="prevPage" :disabled="currentPage === 1">이전</button>
                  <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
                  <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div  style="width:100%;height: 30%; border: 1px solid #9d9d9d; border-radius: 5px; padding: 1%;">
          <div  style="width:100%;height: 10%; display: block; ">
            <div style="float: left; font-size: 16px; ">
              <img src="@/assets/icon/List.png" style="width:16px;padding-top:5px "/> &nbsp;반품 및 교환 현황
            </div>
            <div style="font-size: 10px; float:right; padding-top: 18px;"> (단위: 주)</div>
          </div>
          <hr>

          <div  style="width:100%;height: 20%; ">
            <div  style="display: flex; width: 100%; height: 100%">

              <div class="exchange-list">

                <div class="exchange-info" v-for="(exchange, rowIndex) in paginatedLists">
                  <div class="exchange-title-name1"  style="display: flex; justify-content: space-between; ">
                    <div>{{ exchange.franchise.franchiseName }} (신청일: {{exchange.exchangeDate}})
                    </div>
                    <div>{{exchange.exchangeStatus}}</div>
                  </div>
                  <hr>
                </div>

                <div class="pagination">
                  <button @click="prevPage" :disabled="currentPage === 1">이전</button>
                  <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
                  <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <div  style="width: 40%;height: 750px;">
        <div  style="width:100%; height: 30%;  margin-bottom: 28px">
          <div style="width: 100%; height: 750px;">
            <div style="width: 100%; height: 30%; border: 1px solid #9d9d9d; border-radius: 5px; padding: 1%; margin-bottom: 2%">
              <div style="width: 100%; height: 10%; display: block;">
                <div style="float: left; font-size: 16px;">
                  <img src="@/assets/icon/List.png" style="width: 16px; padding-top: 5px" /> &nbsp;회사 정보
                </div>
              </div>
              <hr>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td colspan="1" style="width:15%;padding: 10px; border-bottom: 1px solid #9d9d9d; ">회사명 </td>
                  <td colspan="2" style="width: 40%; border-bottom: 1px solid #9d9d9d">{{company.companyName}}</td>
                  <td colspan="3" style="width:20%; padding: 10px; border-bottom: 1px solid #9d9d9d; ">대표명 </td>
                  <td colspan="4" style="border-bottom: 1px solid #9d9d9d; width: 30%">{{company.companyCeo}}</td>
                </tr>
                <tr>
                  <td colspan="1" style="width: 15%; padding: 10px; border-bottom: 1px solid #9d9d9d;">주소명 </td>
                  <td colspan="6" style="border-bottom: 1px solid #9d9d9d; width: 100%">{{company.companyAddress}}</td>
                </tr>
                <tr>
                  <td colspan="1" style="width:15%;padding: 10px; border-bottom: 1px solid #9d9d9d; ">전화번호 </td>
                  <td colspan="2" style="width: 40%; border-bottom: 1px solid #9d9d9d">{{company.companyCall}}</td>
                  <td colspan="3" style="width:20%; padding: 10px; border-bottom: 1px solid #9d9d9d; ">사업자번호 </td>
                  <td colspan="4" style="border-bottom: 1px solid #9d9d9d; width: 30%">{{company.companyBusinessNum}}</td>
                </tr>
                <tr>
                  <td colspan="1" style="width:15%;padding: 10px; border-bottom: 1px solid #9d9d9d; ">Fax </td>
                  <td colspan="2" style="width: 40%; border-bottom: 1px solid #9d9d9d">{{company.companyFax}}</td>
                  <td colspan="3" style="width:20%; padding: 10px; border-bottom: 1px solid #9d9d9d; ">Email </td>
                  <td colspan="4" style="border-bottom: 1px solid #9d9d9d; width: 30%">{{company.companyEmail}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>


          <div  style="width:100%;height: 30%; border: 1px solid #9d9d9d; border-radius: 5px; padding: 1%; margin-bottom:10px ">
            <div  style="width:100%;height: 10%; display: block; ">
              <div style="float: left; font-size: 16px; ">
                <img src="@/assets/icon/List.png" style="width:16px;padding-top:5px "/> &nbsp;가맹점
              </div>
              <div style="font-size: 10px; float:right; padding-top: 18px;"> (단위: 주)</div>
            </div>
            <hr>
            <div  style="width:100%;height: 20%; ">
              <div  style="display: flex; width: 100%; height: 100%">
                <div class="exchange-list">
                  <div style="min-height: 130px;">
                    <div class="" v-for="(franchise, rowIndex) in paginatedLists2" style="padding-bottom: 2px;" >
                      <div   style="display: flex; justify-content: space-between; font-size: 12px">
                        <div style="width: 20%">{{ franchise.franchiseName }}
                        </div>
                        <hr style="width: 50%; height: 0px;">
                        <div style="width: 20%">{{franchise.franchiseOwner.franchiseOwnerName}} 관리자님</div>
                      </div>
                    </div>
                  </div>

                  <div class="pagination" >
                    <button @click="prevPage2" :disabled="currentPage2 === 1">이전</button>
                    <span>페이지 {{ currentPage2 }} / {{ totalPages2 }}</span>
                    <button @click="nextPage2" :disabled="currentPage2 === totalPages2">다음</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <div style="width: 102%; height: 30%; display: flex; justify-content: space-between;">
          <div style="display: flex; justify-content: space-between; width: 100%">
            <div  style="width:47%;height: 100%; border: 1px solid #9d9d9d; border-radius: 5px; padding: 1%;">
              <div  style="width:100%;height: 10%; display: block; ">
                <div style="float: left; font-size: 16px; ">
                  <img src="@/assets/icon/List.png" style="width:16px;padding-top:5px "/> &nbsp;가맹점
                </div>
                <div style="font-size: 10px; float:right; padding-top: 15px;"> (단위: 주)</div>
              </div>
              <hr>
              <div  style="width:100%;height: 20%; ">
                <div  style="display: flex; width: 100%; height: 100%">

                  <div class="exchange-list">
                    <div style="min-height: 130px; ">
                      <div class="" v-for="(notice, rowIndex) in paginatedLists3" style="padding-bottom: 2px;  font-size: 1px; " >
                        <div style="float: left;font-size: 11px;">{{ notice.noticeTitle }} </div>
                        <div style="float: right;font-size: 10px;"><br> {{notice.noticeEnrollDate}} </div>
                        <div>
                          <br><br>
                          <br><br>
                          <br><br>
                          <br><br>
                          <br><br>
                          <br><br>
                          <br><br>
                          <br><br>
                          <hr>
                        </div>
                      </div>

                    </div>
                    <div class="pagination">
                      <button @click="prevPage3" :disabled="currentPage3 === 1">이전</button>
                      <span>페이지 {{ currentPage3 }} / {{ totalPages3 }}</span>
                      <button @click="nextPage3" :disabled="currentPage3 === totalPages3">다음</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <div  style="width:47%;height: 100%; border: 1px solid #9d9d9d; border-radius: 5px; padding: 1%;">

            <div  style="width:100%;height: 10%; display: block; ">
              <div style="float: left; font-size: 16px; ">
                <img src="@/assets/icon/List.png" style="width:16px;padding-top:5px "/> &nbsp;문의사항 리스트
              </div>
              <div style="font-size: 10px; float:right; padding-top: 15px;"> (단위: 주)</div>
            </div>
            <hr>

            <div  style="width:100%;height: 100%; ">
              <div  style="display: flex; width: 100%; height: 100%">

                <div class="exchange-list">
                  <div style="min-height: 130px;">
                    <div class="" v-for="(ask, rowIndex) in paginatedLists4" style="padding-bottom: 2px; font-size: 1px; " >
                      <div style="display: flex; justify-content: space-between">
                        <div style="font-size: 11px;">{{ ask.askContent}}</div>
                        <div style="background-color: #FF6285;border-radius: 5px; padding: 2px; font-size: 10px;" v-if="ask.askStatus=='답변대기'">{{ask.askStatus}} </div>
                        <div style="background-color: #FF6285;border-radius: 5px; padding: 2px; font-size: 10px;" v-else-if="ask.askStatus=='답변완료'">{{ask.askStatus}} </div>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <div style="font-size: 10px;">{{ask.franchiseName}} </div>
                        <div style="font-size: 10px;">{{ask.askEnrollDate}} </div>
                      </div>
                      <hr>
                    </div>
                  </div>

                  <div class="pagination">
                    <button @click="prevPage4" :disabled="currentPage4 === 1">이전</button>
                    <span>페이지 {{ currentPage4 }} / {{ totalPages4 }}</span>
                    <button @click="nextPage4" :disabled="currentPage4 === totalPages4">다음</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>

      </div>


    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import axios from 'axios';
import { useStore } from 'vuex'; // Vuex store 임포트
const store = useStore(); // Vuex store 사용
const asks = ref([]);
const company = ref();
const exchanges = ref([]);
const franchises = ref([]);
const notices = ref([]);
const orderStat = ref();
const askList = ref([]);

const getDash = async () => {
  try {
    const accessToken = store.state.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const response = await fetch(`http://localhost:5000/admin/rootDashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    const data = await response.json();
    console.log(data);
    asks.value = data.askList;
    company.value = data.companyVO;
    exchanges.value = data.exchangeList;
    franchises.value = data.franchiseList;
    notices.value = data.noticeList;
    orderStat.value = data.orderStat;

    console.log(askList.asks)
    console.log(company.value)
    console.log(exchanges.value)
    console.log(franchises.value)
    console.log(notices.value)
    console.log(orderStat.value)
    console.log(asks.value)
  } catch (error) {
    console.error('오류 발생:', error);
  }
};
getDash();

const itemsPerPage = 3;
const currentPage = ref(1);

const paginatedLists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return exchanges.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(exchanges.value.length / itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const currentPage2 = ref(1);
const paginatedLists2 = computed(() => {
  const start = (currentPage2.value - 1) * 8;
  const end = start + 8;
  return franchises.value.slice(start, end);
});

const totalPages2 = computed(() => {
  return Math.ceil(franchises.value.length / 8);
});

const nextPage2 = () => {
  if (currentPage2.value < totalPages.value) {
    currentPage2.value++;
  }
};

const prevPage2 = () => {
  if (currentPage2.value > 1) {
    currentPage2.value--;
  }
};

const currentPage3 = ref(1);

const paginatedLists3 = computed(() => {
  const start = (currentPage3.value - 1) * 4;
  const end = start + 4;
  return notices.value.slice(start, end);
});

const totalPages3 = computed(() => {
  return Math.ceil(notices.value.length / 4);
});

const nextPage3 = () => {
  if (currentPage3.value < totalPages.value) {
    currentPage3.value++;
  }
};

const prevPage3 = () => {
  if (currentPage3.value > 1) {
    currentPage3.value--;
  }
};




const currentPage4 = ref(1);

const paginatedLists4 = computed(() => {
  const start = (currentPage4.value - 1) * 4;
  const end = start + 4;
  return asks.value.slice(start, end);
});

const totalPages4 = computed(() => {
  return Math.ceil(asks.value.length / 4);
});

const nextPage4 = () => {
  if (currentPage4.value < totalPages.value) {
    currentPage4.value++;
  }
};

const prevPage4 = () => {
  if (currentPage4.value > 1) {
    currentPage4.value--;
  }
};


</script>

<style scoped>
  .outLine{
    border: 1px solid black;
  }
  .order-title1{
    width:33%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .order-title2-1{
    border-radius: 10px;
    width: 80%;
    height: 80%;
    background-color: #FF6285;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .order-title2-2{
    border-radius: 10px;
    width: 80%;
    height: 80%;
    background-color: #394CA9;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .order-title2-3{
    border-radius: 10px;
    width: 80%;
    height: 80%;
    background-color: #FF6285;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .order-title2-4{
    border-radius: 10px;
    width: 80%;
    height: 80%;
    background-color: #F3F3F3;
    border: 1px solid #9d9d9d;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .order-title-name1{
    font-weight: bold;
    color: white;
  }
  .order-title-name2{
    font-weight: bold;
    font-size: 30px;
  }

  .exchange-list{
    width: 100%;
  }
  .exchange-info{
    //background-color: #9d9d9d;
    height: 100%;
  }
  .exchange-title-name1{
    font-size: 20px;
    font-weight: bold;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .pagination button {
    background-color: #fff;
    color: black;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    padding: 8px 16px;
    font-size: 14px;
    margin: 0 5px;
  }

  .pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .pagination span {
    margin: 0 10px;
    font-weight: bold;
  }
  .company-title-name1{

    font-weight: bold;
    font-size: 14px;
    width: 100%;
  }
</style>