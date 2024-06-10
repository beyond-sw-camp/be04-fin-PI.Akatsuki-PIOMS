<template>
  <div class="popup-overlay" @click.self="showPostPopup">
    <div class="popup-content">
      <div class="popup-header">
        <h4>상품 등록</h4>
      </div>
      <div class="popup-body">
        <div class="insert-section">
          <div class="table-wrapper">
            <table class="insert-table">
              <tr>
                <td class="insert-label">상품명</td>
                <td class="insert-input">
                  <input type="text" v-model="insertProductName" class="textInput-name" placeholder="상품명을 입력하세요."/>
                </td>
                <td class="insert-label">재고량</td>
                <td class="insert-input">
                  <input type="number" v-model="insertProductCount" class="textInput" placeholder="재고량을 입력하세요.">
                </td>
                <td class="insert-label">가격</td>
                <td class="insert-input">
                  <input type="number" v-model="insertProductPrice" class="textInput" placeholder="상품 가격을 입력하세요.">
                </td>
              </tr>
              <tr>
                <td class="insert-label">상품상태</td>
                <td class="insert-input">
                  <select v-model="insertStatus" class="textInput">
                    <option value="">전체 상태</option>
                    <option value="공급가능">공급가능</option>
                    <option value="일시제한">일시제한</option>
                    <option value="단종">단종</option>
                    <option value="품절">품절</option>
                  </select>
                </td>
                <td class="insert-label">상품노출상태</td>
                <td class="insert-input">
                  <select v-model="selectedExposureStatus" class="textInput">
                    <option value="">전체 노출상태</option>
                    <option value="true">노출</option>
                    <option value="false">미노출</option>
                  </select>
                </td>
                <td class="insert-label">색상</td>
                <td class="insert-input">
                  <select v-model="insertColor" class="textInput">
                    <option value="">전체 색상</option>
                    <option value="빨간색">빨간색</option>
                    <option value="주황색">주황색</option>
                    <option value="노란색">노란색</option>
                    <option value="초록색">초록색</option>
                    <option value="파란색">파란색</option>
                    <option value="남색">남색</option>
                    <option value="보라색">보라색</option>
                  </select>
                </td>
                <td class="insert-label">사이즈</td>
                <td class="insert-input">
                  <select v-model="insertSize" class="textInput">
                    <option value="">전체 사이즈</option>
                    <option value="90">90</option>
                    <option value="95">95</option>
                    <option value="100">100</option>
                    <option value="105">105</option>
                    <option value="110">110</option>
                  </select>
                </td>
              </tr>
            </table>
            <table class="second-insert-table">
              <tr>
                <td class="second-insert-label">
                  <div class="second-insert-label0">카테고리 구분</div>
                </td>
                <td class="second-insert-input">
                  <select v-model="selectedFirstCategory" @change="fetchCategories('second')" class="categories">
                    <option value="">대분류</option>
                    <option v-for="category in firstCategories" :key="category.categoryFirstCode" :value="category.categoryFirstCode">
                      {{ category.categoryFirstName }}
                    </option>
                  </select>
                  <select class="categories-g" v-model="selectedSecondCategory" @change="fetchCategories('third')">
                    <option value="">중분류</option>
                    <option v-for="category in secondCategories" :key="category.categorySecondCode" :value="category.categorySecondCode">
                      {{ category.categorySecondName }}
                    </option>
                  </select>
                  <select class="categories-g" v-model="selectedThirdCategory">
                    <option value="">소분류</option>
                    <option v-for="category in thirdCategories" :key="category.categoryThirdCode" :value="category.categoryThirdCode">
                      {{ category.categoryThirdName }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td class="second-insert-label"><div class="second-insert-label0">상세정보</div></td>
                <td class="second-insert-input">
                  <textarea type="text" style="width: 99%; height: 150px; resize: none" v-model="insertContent" class="textInput" placeholder="상품의 상세 정보를 입력해주세요." >
                  </textarea>
                </td>
              </tr>
              <tr>
                <td class="second-insert-label1">
                  <div class="label-content">
                    이미지<br>
                  </div>
                </td>
                <td class="second-insert-input1">
                  <div class="imgForm">
                    <form @submit.prevent="uploadImage">
                      <input id="imgUpload" type="file" @change="previewImage" hidden />
                      <button v-if="imagePreview !== imageSrc && imgOn" @click="resetImage" class="img-close-button">X</button>
                      <label for="imgUpload">
                        <img class="img" v-if="!imgOn" :src="imageSrc" style="width: 100px;height: 100px" />
                        <img class="img" v-if="imgOn" :src="imagePreview" />
                      </label>
                      <br />
                    </form>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div style="display: flex; gap: 10px; float: right; padding-top: 2%">
          <button class="post-button" @click="uploadAndSaveProduct">등록</button>
          <button class="action-button" @click="closePopup">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineEmits, ref } from 'vue';
import imageSrc from '@/assets/icon/picture.png';
import { useStore } from 'vuex';
import ProductList from "@/components/admin/product/ProductList.vue";
import Swal from "sweetalert2";

const store = useStore();
const accessToken = store.state.accessToken;

const emit = defineEmits(['close']);
const imagePreview = ref(imageSrc);
const imgOn = ref(false);
const insertProductName = ref('');
const insertProductCount = ref('');
const insertProductPrice = ref('');
const insertStatus = ref('');
const selectedExposureStatus = ref('');
const insertColor = ref('');
const insertSize = ref('');
const insertContent = ref('');
const firstCategories = ref([]);
const secondCategories = ref([]);
const thirdCategories = ref([]);
const selectedFirstCategory = ref('');
const selectedSecondCategory = ref('');
const selectedThirdCategory = ref('');
let imageUrl = '';

const fetchCategories = async (level) => {
  let url = '';
  switch (level) {
    case 'first':
      url = 'http://api.pioms.shop/admin/category/first';
      break;
    case 'second':
      url = `http://api.pioms.shop/admin/category/second/list/detail/categoryfirst/${selectedFirstCategory.value}`;
      break;
    case 'third':
      url = `http://api.pioms.shop/admin/category/third/list/detail/categorysecond/${selectedSecondCategory.value}`;
      break;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`${level} 카테고리를 불러오는 데 실패했습니다.`);
    }
    const data = await response.json();
    switch (level) {
      case 'first':
        firstCategories.value = data;
        break;
      case 'second':
        secondCategories.value = data;
        thirdCategories.value = [];
        selectedSecondCategory.value = '';
        break;
      case 'third':
        thirdCategories.value = data;
        break;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
const resetImage = () => {
  imagePreview.value = imageSrc;
  imgOn.value = false;
};
const previewImage = (event) => {
  const file = event.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.value = reader.result;
      imgOn.value = true;
    };
    reader.readAsDataURL(file);
  }
};
const uploadImage = async () => {
  const fileInput = document.querySelector('input[type="file"]');
  const file = fileInput.files[0];
  if (!file) {
    await saveProduct('');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`http://api.pioms.shop/admin/product/image`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    const data = await response.json();
    console.log('이미지 URL:', data);
    imageUrl = data.imgUrl;
    await saveProduct(imageUrl);
  } catch (error) {
    console.error('오류:', error);
  }
};
const saveProduct = async (imageUrl) => {
  const requestData = {
    productName: insertProductName.value,
    productCount: insertProductCount.value,
    productPrice: insertProductPrice.value,
    productStatus: insertStatus.value,
    productExposureStatus: selectedExposureStatus.value === 'true',
    productColor: insertColor.value,
    productSize: insertSize.value,
    productContent: insertContent.value,
    categoryFirstCode: selectedFirstCategory.value,
    categorySecondCode: selectedSecondCategory.value,
    categoryThirdCode: selectedThirdCategory.value,
    url: imageUrl
  };

  console.log('Request Data:', requestData);

  try {
    const response = await fetch('http://api.pioms.shop/admin/product/create?requesterAdminCode=1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`상품 등록에 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorText}`);
    }

    console.log('상품이 성공적으로 등록되었습니다.');
    emit('close');
  } catch (error) {
    console.error('오류:', error);
  }
};
const closePopup = () => {
  emit('close');
};
const showPostPopup = () => {
  emit('close');
}
onMounted(() => {
  const numberInputs = document.querySelectorAll('input[type="number"]');
  numberInputs.forEach(input => {
    input.addEventListener('keypress', (event) => {
      if (event.key.length === 1 && !/\d/.test(event.key)) {
        event.preventDefault();
      }
    });

    input.addEventListener('input', (event) => {
      input.value = input.value.replace(/[^0-9]/g, '');
    });
  });
  fetchCategories('first');
});

const uploadAndSaveProduct = async () => {
  if(!insertProductName.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '상품명 항목 누락',
      text: '상품명을 입력해주세요.',
    });
    return;
  }
  if(!insertProductCount.value) {
    await Swal.fire({
      icon: 'warning',
      title: '재고량 항목 누락',
      text: '재고량을 입력해주세요.',
    });
    return;
  }
  if(!insertProductPrice.value) {
    await Swal.fire({
      icon: 'warning',
      title: '가격 항목 누락',
      text: '가격을 입력해주세요.',
    });
    return;
  }
  if(!insertStatus.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '상품상태 항목 누락',
      text: '상품 상태를 정해주세요.',
    });
    return;
  }
  if(!selectedExposureStatus.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '상품 노출 상태 항목 누락',
      text: '상품 노출 상태를 정해주세요.',
    });
    return;
  }
  if(!insertColor.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '색상 항목 누락',
      text: '색상을 정해주세요.',
    });
    return;
  }
  if(!insertSize.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '사이즈 항목 누락',
      text: '사이즈를 정해주세요.',
    });
    return;
  }
  if(!selectedFirstCategory.value) {
    await Swal.fire({
      icon: 'warning',
      title: '대분류 카테고리 항목 누락',
      text: '대분류 카테고리를 정해주세요.',
    });
    return;
  }
  if(!selectedSecondCategory.value) {
    await Swal.fire({
      icon: 'warning',
      title: '중분류 카테고리 항목 누락',
      text: '중분류 카테고리를 정해주세요.',
    });
    return;
  }
  if(!selectedThirdCategory.value) {
    await Swal.fire({
      icon: 'warning',
      title: '소분류 카테고리 항목 누락',
      text: '소분류 카테고리를 정해주세요.',
    });
    return;
  }
  if(!insertContent.value.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: '상세정보 항목 누락',
      text: '상품 상세정보를 입력해주세요.',
    });
    return;
  }
  const fileInput = document.querySelector('input[type="file"]');
  const file = fileInput.files[0];

  const formData = new FormData();

  if(!file) {
    await Swal.fire({
      icon: 'warning',
      title: '상품 이미지 누락',
      text: '이미지를 첨부해주세요.',
    });
    return;
  }

  if (file) {
    formData.append('file', file);
  }

  formData.append('productName', insertProductName.value);
  formData.append('productCount', insertProductCount.value);
  formData.append('productPrice', insertProductPrice.value);
  formData.append('productStatus', insertStatus.value);
  formData.append('productExposureStatus', selectedExposureStatus.value === 'true');
  formData.append('productColor', insertColor.value);
  formData.append('productSize', insertSize.value);
  formData.append('productContent', insertContent.value);
  formData.append('categoryFirstCode', selectedFirstCategory.value);
  formData.append('categorySecondCode', selectedSecondCategory.value);
  formData.append('categoryThirdCode', selectedThirdCategory.value);

  try {
    const response = await fetch('http://api.pioms.shop/admin/product/image', {
      method: 'POST',
      credentials: 'include',
      body: formData,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`상품 등록에 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorText}`);
    }

    const data = await response.json();
    await Swal.fire({
      icon: 'success',
      title: '상품 등록 성공!',
      text: '상품 등록에 성공하였습니다.',
    });
    location.reload(ProductList);
    emit('close');
  } catch (error) {
    console.error('오류:', error);
  }
};
</script>
<style scoped>
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
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 60%;
  height: 65%;
  overflow-y: auto;
  max-height: 84vh;
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
  width: 95%;
}

.popup-body {
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

.second-insert-label {
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  width: 10%;
  background-color: #D9D9D9;
  border: 1px solid #ddd;
}

.second-insert-label0 {
  text-align: center;
  font-size: 12px;
}

.second-insert-input {
  width: 1400px;
  border: 1px solid lightgray;
  border-right: none;
}

.label-content {
  text-align: center;
  font-size: 12px;
}

.second-insert-label1 {
  font-weight: bold;
  text-align: center;
  width: 33px;
  height: 300px;
  background-color: #D9D9D9;
  border: 1px solid #ddd;
}

.imgForm {
  text-align: center;
  width: 100%;
}

.img-close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #333;
}
.img-close-button:hover {
  background-color: #00ff0000;
  color: #ff0000;
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

.categories {
  border: 1px solid rgba(217, 217, 217, 0.7);
  border-radius: 5px;
}

.categories-g {
  border: 1px solid rgba(217, 217, 217, 0.7);
  border-radius: 5px;
  margin-left: 1%;
}
.img{
  width: 200px;
  height:200px;
}

</style>

