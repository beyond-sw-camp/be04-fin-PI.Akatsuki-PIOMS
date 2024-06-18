<template>
  <div class="popup-overlay" @click.self="closeEdit">
    <div class="popup-content">
      <div class="popup-header">
        <button class="close-button" @click="closeEdit">×</button>
        <h4>상품 조회</h4>
      </div>
      <div class="popup-body">
        <div class="insert-section">
          <div class="table-wrapper">
            <table class="category-table">
              <tr>
                <td class="second-insert-label">
                  <div class="second-insert-label0">카테고리 구분</div>
                </td>
                <td class="second-insert-input">
                  <p class="categories">{{ props.currentCategoryFirstName }} </p>
                  <p class="categories-g"> {{ props.currentCategorySecondName }} </p>
                  <p class="categories-g"> {{ props.currentCategoryThirdName }} </p>
                </td>
                <td class="insert-label">상품명</td>
                <td class="insert-input-name">
                  <p class="textInput">{{ props.currentProductName }}</p>
                </td>
              </tr>
            </table>
            <table class="top-table">
              <tr>
                <td class="insert-label">색상</td>
                <td class="insert-input">
                  <p class="textInput">{{ props.currentProductColor }}</p>
                </td>
                <td class="insert-label">사이즈</td>
                <td class="insert-input">
                  <p class="textInput">{{ props.currentProductSize }}</p>
                </td>
              </tr>
            </table>
            <table class="insert-table">
              <tr>
                <td class="insert-label">재고량</td>
                <td class="insert-input">
                  <p class="textInput">{{ props.currentProductCount }}</p>
                </td>
                <td class="insert-label">가격</td>
                <td class="insert-input">
                  <p class="textInput">{{ props.currentProductPrice }}</p>
                </td>
                <td class="insert-label">상품상태</td>
                <td class="insert-input">
                  <p class="textInput">{{ props.currentProductStatus }}</p>
                </td>
              </tr>
            </table>
            <table class="second-insert-table">
              <tr>
                <td class="second-insert-label">
                  <div class="second-insert-label0">상세정보</div>
                </td>
                <td class="second-insert-input">
                  <p class="textInput" style="width: 99%; height: 150px; white-space: pre-wrap;">{{ props.currentProductContent }}</p>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <button class="action-button" @click="closeEdit">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  currentProductCode: String,
  currentProductName: String,
  currentProductCount: String,
  currentProductPrice: String,
  currentProductStatus: String,
  currentProductColor: String,
  currentProductSize: String,
  currentCategoryFirstName: String,
  currentCategorySecondName: String,
  currentCategoryThirdName: String,
  currentProductContent: String,
  closeEdit: Function
});
</script>
<style scoped>
.popup-overlay {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 50%;
  margin-left: -25%;
  height: 300px;
  margin-top: -150px;
  z-index: 1000;
  background: white;
  border: 1px solid #d1d8dd;
  box-shadow: 0 0 6px 1px rgb(0 0 0 / 30%);
}

.popup-content {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  position: relative;
  width: 1200px;
  height: 1200px;
  text-align: center;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 32px;
  right: 80px;
  background: none;
  border: none;
  font-size: 2em;
  cursor: pointer;
  color: #333;
  padding: 0;
  margin: 0;
}

.popup-header {
  display: flex;
  height: 25px;
  justify-content: center;
  align-items: center;
  padding: 15px 30px;
  background-color: #D9D9D9;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: 1063px;
  margin-left: 3.2%;
}

.popup-body {
  padding: 10px;
  padding-top: unset;
}

.close-button:hover {
  background-color: #00ff0000;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.action-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.action-button:hover {
  background-color: #0056b3;
}

.insert-section {
  display: flex;
  justify-content: center;
}

.insert-table {
  border-collapse: collapse;
  border: 1px solid #ddd;
  padding: 10px;
}
.table-wrapper {
  border-radius: 0 !important;
}
.insert-table tr {
  text-align: center;
}

.insert-table td {
  padding: 5px 10px;
}

.insert-label {
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  width: 10%;
  background-color: #D9D9D9;
  border: 1px solid #ddd;
  height: 50px;
}

.insert-input {
  width: 200px;
  text-align: left;
  border: 1px solid lightgray;
  border-right: none;
  height: 30px;

}
.insert-input-name {
  width: 500px;
  text-align: left;
  border: 1px solid lightgray;
  border-right: none;
  height: 30px;
}
.category-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  border-top: none;
}
.second-insert-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  border-top: none;
}
.category-table tr {
  text-align: left;
}
.second-insert-table tr {
  text-align: center;
}

.second-insert-table td {
  padding: 5px 10px;
  text-align: left;
}

.second-insert-label {
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  width: 10%;
  background-color: #D9D9D9;
  border: 1px solid #ddd;

}

.second-insert-input {
  width: 490px;
  border: 1px solid lightgray;
  border-right: none;
}

.textInput {
  border: 1px solid rgba(217, 217, 217, 0.7);
  border-radius: 5px;
}
.categories {
  border: 1px solid rgba(217, 217, 217, 0.7);
  border-radius: 5px;
}
.categories-g {
  border: 1px solid rgba(217, 217, 217, 0.7);
  border-radius: 5px;
  margin-left: 1%;
}
.action-button {
  background-color: #D9D9D9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-left: 80%;
  margin-top: 2%;

}
.action-button:hover {
  background-color: gray;
}
.second-insert-label0 {
  text-align: center;
  font-size: 12px;
}
.top-table {
  border-collapse: collapse;
  border: 1px solid #ddd;
  padding: 10px;
}
.top-table td {
  padding: 5px 10px ;
}
.top-table tr {
  text-align: center;
}
</style>
