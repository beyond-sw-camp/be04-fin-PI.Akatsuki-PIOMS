<template>
  <div class="popup-overlay" @click.self="closeEdit">
    <div class="popup-content">
      <div class="popup-header">
        <button class="close-button" @click="closeEdit">×</button>
        <h4>상품 수정</h4>
      </div>
      <div class="popup-body">
        <div class="insert-section">
          <div v-if="productData" class="table-wrapper">
            <table class="insert-table">
              <tr>
                <td class="insert-label">상품명</td>
                <td class="insert-input">
                  <input type="text" id="name" v-model="name" class="textInput" />
                </td>
                <td class="insert-label">재고량</td>
                <td class="insert-input">
                  <input type="number" id="count" v-model="count" class="textInput" />
                </td>
                <td class="insert-label">가격</td>
                <td class="insert-input">
                  <input type="number" id="price" v-model="price" class="textInput" />
                </td>
              </tr>
              <tr>
                <td class="insert-label">상품상태</td>
                <td class="insert-input">
                  <select id="status" v-model="status" class="textInput">
                    <option value="공급가능">공급가능</option>
                    <option value="일시제한">일시제한</option>
                    <option value="단종">단종</option>
                    <option value="품절">품절</option>
                  </select>
                </td>
                <td class="insert-label">상품노출상태</td>
                <td class="insert-input">
                  <select id="exposureStatus" v-model="exposureStatus" class="textInput">
                    <option value="true">노출</option>
                    <option value="false">미노출</option>
                  </select>
                </td>
                <td class="insert-label">색상</td>
                <td class="insert-input">
                  <select id="color" v-model="color" class="textInput">
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
                  <select id="size" v-model="size" class="textInput">
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
                  <select id="firstCategory" v-model="firstCategory" @change="fetchCategories('second')" class="categories">
                    <option value="">대분류</option>
                    <option v-for="category in firstCategories" :key="category.categoryFirstCode" :value="category.categoryFirstCode">
                      {{ category.categoryFirstName }}
                    </option>
                  </select>
                  <select id="secondCategory" class="categories-g" v-model="secondCategory" @change="fetchCategories('third')">
                    <option value="">중분류</option>
                    <option v-for="category in secondCategories" :key="category.categorySecondCode" :value="category.categorySecondCode">
                      {{ category.categorySecondName }}
                    </option>
                  </select>
                  <select id="thirdCategory" class="categories-g" v-model="thirdCategory">
                    <option value="">소분류</option>
                    <option v-for="category in thirdCategories" :key="category.categoryThirdCode" :value="category.categoryThirdCode">
                      {{ category.categoryThirdName }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td class="second-insert-label">
                  <div class="second-insert-label0">상세정보</div>
                </td>
                <td class="second-insert-input">
                  <textarea id="content" v-model="content" class="textInput" style="width: 99%; height: 150px"></textarea>
                </td>
              </tr>
              <tr>
                <td class="second-insert-label1">
                  <div class="label-content">
                    이미지<br />
                    (최대 3장)
                  </div>
                </td>
                <td class="second-insert-input1">
                  <div class="imgForm">
                    <form @submit.prevent="uploadImage">
                      <input id="imgUpload" type="file" @change="previewImage" hidden />
                      <button v-if="imagePreview !== imageSrc && imgOn" @click="resetImage" class="img-close-button">X</button>
                      <label for="imgUpload">
                        <img class="img" v-if="!imgOn" :src="imageSrc" />
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
        <button class="action-button" @click="closeEdit">취소</button>
        <button class="post-button" @click="submitProduct">수정</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps } from 'vue';
import imageSrc from '@/assets/icon/picture.png';

const imagePreview = ref(imageSrc);
const imgOn = ref(false);
const firstCategories = ref([]);
const secondCategories = ref([]);
const thirdCategories = ref([]);
const productData = ref(null);
const name = ref('');
const count = ref('');
const price = ref('');
const status = ref('');
const exposureStatus = ref('');
const color = ref('');
const size = ref('');
const firstCategory = ref('');
const secondCategory = ref('');
const thirdCategory = ref('');
const content = ref('');
const imageUrl = ref('');

const props = defineProps({
  productCode: Object,
  closeEdit: Function
});

const fetchProductData = async () => {
  const productCode = props.productCode.productCode;
  if (!productCode) {
    console.error('그런거 없다.');
    return;
  }
  try {
    const response = await fetch(`http://localhost:5000/admin/product/list/detail/${productCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`못불러옴: ${response.statusText}`);
    }

    const data = await response.json();
    productData.value = data;
    name.value = data.productName || '';
    count.value = data.productCount || '';
    price.value = data.productPrice || '';
    status.value = data.productStatus || '';
    exposureStatus.value = data.productExposureStatus || '';
    color.value = data.productColor || '';
    size.value = data.productSize || '';
    firstCategory.value = data.categoryFirstCode || '';
    secondCategory.value = data.categorySecondCode || '';
    thirdCategory.value = data.categoryThirdCode || '';
    content.value = data.productContent || '';
  } catch (error) {
    console.error('못불러옴:', error);
  }
};

const submitProduct = async () => {
  const productCode = props.productCode.productCode;
  if (!productCode) {
    console.error('그런거 없다');
    return;
  }
  try {
    const response = await fetch(`http://localhost:5000/admin/product/update/${productCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName: name.value,
        productCount: count.value,
        productPrice: price.value,
        productStatus: status.value,
        productExposureStatus: exposureStatus.value,
        productColor: color.value,
        productSize: size.value,
        categoryFirstCode: firstCategory.value,
        categorySecondCode: secondCategory.value,
        categoryThirdCode: thirdCategory.value,
        productContent: content.value,
        productImageUrl: imageUrl.value
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`수정 실패: ${errorMessage}`);
    }

    props.closeEdit();
  } catch (error) {
    console.error('수정 실패:', error);
  }
};

const fetchCategories = async (level) => {
  let url = '';
  switch (level) {
    case 'first':
      url = 'http://localhost:5000/admin/category/first';
      break;
    case 'second':
      url = `http://localhost:5000/admin/category/second/list/detail/categoryfirst/${firstCategory.value}`;
      break;
    case 'third':
      url = `http://localhost:5000/admin/category/third/list/detail/categorysecond/${secondCategory.value}`;
      break;
  }

  try {
    const response = await fetch(url, { method: 'GET' });
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
        secondCategory.value = '';
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
  if (file) {
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
    await submitProduct();
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`http://localhost:5000/admin/product/image`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    const data = await response.json();
    console.log('이미지 URL:', data);
    imageUrl.value = data.imgUrl;
    await submitProduct();
  } catch (error) {
    console.error('오류:', error);
  }
};

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
  fetchProductData();
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
.post-button {
  background-color: rgba(220, 20, 60, 0.8);
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
.second-insert-label0 {
  text-align: center;
  font-size: 12px;
}
</style>
