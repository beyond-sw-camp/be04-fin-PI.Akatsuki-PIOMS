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
    { key: 'orderCode', label: '주문 코드' },
    { key: 'orderDate', label: '주문 날짜' },
    { key: 'orderTotalPrice', label: '총 가격' },
    { key: 'orderCondition', label: '주문 상태' },
    { key: 'orderReason', label: '주문 사유' },
    { key: 'franchiseCode', label: '가맹점 코드' },
    { key: 'franchiseName', label: '가맹점 이름' },
    { key: 'deliveryDate', label: '배송 날짜' },
    { key: 'franchiseOwnerCode', label: '가맹점주 코드' },
    { key: 'franchiseOwnerName', label: '가맹점주 이름' },
    { key: 'franchiseAddress', label: '가맹점 주소' },
    { key: 'exchange', label: '교환 코드' },
    /*{ key: 'adminCode', label: '관리자 코드' },*/
    { key: 'adminName', label: '관리자 이름' },
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
      if (data.length > 0) {
        // orderProductList를 제외한 나머지 데이터를 lists에 넣습니다.
        lists.value = data.map(({ orderProductList, ...rest }) => rest);
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
  