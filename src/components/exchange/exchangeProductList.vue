<template>
    <div>
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index">{{ header.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, rowIndex) in lists" :key="rowIndex">
            <td v-for="(header, colIndex) in headers" :key="colIndex">
              {{ item[header.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const lists = ref([]);
  const headers = ref([
    /*{ key: 'requestProductCode', label: '상품 코드' },*/
    { key: 'productName', label: '상품명' },
    { key: 'requestProductCount', label: '요청 수량' },
    { key: 'requestProductGetCount', label: '수령 수량' },
  ]);
  
  const getMemberId = async () => {
    try {
      const response = await fetch('/api/admin/1/orders', {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('네트워크 오류 발생');
      }
  
      const data = await response.json();
      if (data.length > 0 && data[0].orderProductList) {
        // 모든 orderProductList 항목을 합쳐서 lists에 넣습니다.
        lists.value = data.flatMap(order => order.orderProductList);
        console.log(lists);
      } else {
        lists.value = [];
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };
  
  getMemberId();
  </script>
  
  <style scoped>
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
  </style>
  