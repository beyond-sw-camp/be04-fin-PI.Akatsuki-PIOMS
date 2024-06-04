<template>
  <div class="popup-overlay" @click.self="showPostPopup">
    <div class="popup-content">
      <div class="popup-header">
        <button class="close-button" @click="showPostPopup">×</button>
        <h4>관리자 등록</h4>
      </div>
      <div class="popup-body">
        <div class="insert-section">
          <div class="table-wrapper">
            <table class="insert-table">
              <tr>
                <td class="insert-label">이름</td>
                <td class="insert-input">
                  <input type="text" v-model="insertAdminName" class="textInput-name" placeholder="관리자명을 입력하세요."/>
                </td>
                <td class="insert-label">이메일</td>
                <td class="insert-input">
                  <input type="text" v-model="insertAdminEmail" class="textInput" placeholder="재고량을 입력하세요.">
                </td>
                <td class="insert-label">휴대 전화</td>
                <td class="insert-input">
                  <input type="number" v-model="insertAdminPhone" class="textInput" placeholder="상품 가격을 입력하세요.">
                </td>
              </tr>
            </table>
          </div>
        </div>
        <button class="action-button" @click="closePopup">취소</button>
        <button class="post-button" @click="saveAdmin">등록</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue';

const emit = defineEmits(['close']);

const insertAdminName = ref('');
const insertAdminEmail = ref('');
const insertAdminPhone = ref('');
const insertAdminRole = ref('');

const closePopup = () => {
  emit('close');
};
const showPostPopup = () => {
  emit('close');
}
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
  overflow-y: auto; /* 내용이 많을 경우 스크롤 추가 */
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
  padding: 0; /* 추가 */
  margin: 0; /* 추가 */
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

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.insert-section {
  display: flex;
  justify-content: center;
}

.table-wrapper {
  border-radius: 0 !important;
  height: 100%;
}

.insert-table {
  border-collapse: collapse;
  border: 1px solid #ddd;
  padding: 10px;
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
}

.insert-input {
  width: 500px;
  text-align: left;
  border: 1px solid lightgray;
  border-right: none;
  height: 30px;
}

.insert-input input {}

.second-insert-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  border-top: none;
}

.second-insert-table tr {
  text-align: center;
}

.second-insert-table td {
  padding: 5px 10px;
  text-align: left;
}

.close-button:hover{
  background-color: #00ff0000;
}

.post-button {
  background-color: rgba(248, 155, 0, 0.8);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
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

.textInput-name {
  border: 1px solid rgba(217, 217, 217, 0.7);
  border-radius: 5px;
  height: 20px;
}

.textInput {
  border: 1px solid rgba(217, 217, 217, 0.7);
  border-radius: 5px;
}
</style>
