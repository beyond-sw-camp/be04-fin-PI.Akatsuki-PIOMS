<template>
  <div class="popup-overlay" >
       <div class="popup-content">
           <span class="close" @click="showDetailPopup">&times;&times;&times;&times;&times;</span>
           
           <br>{{ props.detailItem }}
       </div>
   </div>
</template>

<script setup>
   import { ref } from "vue";
 
 const props = defineProps({
   showDetailPopup: Function,
   popupVisible: Boolean,
   writeActive: Boolean,
   detailItem: Object,
 });

 
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
  