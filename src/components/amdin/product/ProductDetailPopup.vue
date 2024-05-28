<template>
  <div class="popup-overlay" @click.self="closePopup">
    <div class="popup-content">
      <div class="popup-header">
        <button class="close-button" @click="closePopup">×</button>
        <h4>상품 수정</h4>
      </div>
      <div class="popup-body">
        <div class="insert-section">
          <div class="table-wrapper">
            <table class="insert-table">
              <tr>
                <td class="insert-label">상품명</td>
                <td class="insert-input">
                  <input type="text" v-bind:value="currentProductName" v-on:input="updateProductName= $event.target.value" class="textInput"/>
<!--                  <input type="text" v-model="updateProductName" class="textInput"/>-->
                </td>
                <td class="insert-label">재고량</td>
                <td class="insert-input">
<!--                  <input type="number" v-model="updateProductCount" class="textInput"/>-->
                  <input type="text" v-bind:value="currentProductCount" v-on:input="updateProductCount= $event.target.value" class="textInput"/>
                </td>
                <td class="insert-label">가격</td>
                <td class="insert-input">
<!--                  <input type="number" v-model="updateProductPrice" class="textInput"/>-->
                  <input type="text" v-bind:value="currentProductPrice" v-on:input="updateProductPrice= $event.target.value" class="textInput"/>
                </td>
              </tr>
              <tr>
                <td class="insert-label">상품상태</td>
                <td class="insert-input">
                  <select v-model="updateStatus" class="textInput">
<!--                  <select class="textInput" v-bind:value="currentProductStatus" v-on:select="updateStatus= $event.target.value">-->
                    <option value="공급가능">공급가능</option>
                    <option value="일시제한">일시제한</option>
                    <option value="단종">단종</option>
                    <option value="품절">품절</option>
                  </select>
                </td>
                <td class="insert-label">상품노출상태</td>
                <td class="insert-input">
                  <select v-model="updateExposureStatus" class="textInput">
<!--                  <select  class="textInput" v-bind:value="currentProductExposureStatus" v-on:select="updateExposureStatus= $event.target.value">-->
                    <option value="true">노출</option>
                    <option value="false">미노출</option>
                  </select>
                </td>
                <td class="insert-label">색상</td>
                <td class="insert-input">
                  <select v-model="updateColor" class="textInput">
<!--                    <select  class="textInput" v-bind:value="currentProductColor" v-on:select="updateColor= $event.target.value">-->
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
<!--                  <select v-model="updateSize" class="textInput">-->
                    <select  class="textInput" v-bind:value="currentProductSize" v-on:select="updateSize= $event.target.value">
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
                <td class="second-insert-label"><div class="second-insert-label0">카테고리 구분</div></td>
                <td class="second-insert-input">
                  <select v-model="updateFirstCategory" @change="fetchCategories('second')" class="categories">
                    <option value="">대분류</option>
                    <option v-for="category in firstCategories" :key="category.categoryFirstCode" :value="category.categoryFirstCode">
                      {{ category.categoryFirstName }}
                    </option>
                  </select>
                  <select class="categories-g" v-model="updateSecondCategory" @change="fetchCategories('third')">
                    <option value="">중분류</option>
                    <option v-for="category in secondCategories" :key="category.categorySecondCode" :value="category.categorySecondCode">
                      {{ category.categorySecondName }}
                    </option>
                  </select>
                  <select class="categories-g" v-model="updateThirdCategory">
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
                  <input type="text" v-bind:value="currentProductContent" v-on:input="updateContent= $event.target.value" class="textInput"/>
<!--                  <input type="text" style="width: 99%; height: 150px" v-model="updateContent" class="textInput">-->
                </td>
              </tr>
              <tr>
                <td class="second-insert-label1">
                  <div class="label-content">
                    이미지<br>
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
        <button class="action-button" @click="closePopup">취소</button>
        <button class="post-button" @click="saveProduct">수정</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, defineEmits, ref, defineProps} from 'vue';
import imageSrc from '@/assets/icon/picture.png';

const emit = defineEmits(['close']);
const imagePreview = ref(imageSrc);
const imgOn = ref(false);
const updateProductName = ref('');
const updateProductCount = ref('');
const updateProductPrice = ref('');
const updateStatus = ref('');
const updateExposureStatus = ref('true');
const updateColor = ref('');
const updateSize = ref('');
const updateContent = ref('');
const firstCategories = ref([]);
const secondCategories = ref([]);
const thirdCategories = ref([]);
const updateFirstCategory = ref('');
const updateSecondCategory = ref('');
const updateThirdCategory = ref('');
let imageUrl = '';
const fetchCategories = async (level) => {
  let url = '';
  switch (level) {
    case 'first':
      url = '/api/admin/category/first';
      break;
    case 'second':
      url = `/api/admin/category/second/list/detail/categoryfirst/${updateFirstCategory.value}`;
      break;
    case 'third':
      url = `/api/admin/category/third/list/detail/categorysecond/${updateSecondCategory.value}`;
      break;
  }

  try {
    const response = await fetch(url, {method: 'GET'});
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
    await saveProduct(''); // 이미지가 없는 경우 saveProduct 호출
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`/api/admin/product/image`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    const data = await response.json();
    console.log('이미지 URL:', data);
    imageUrl = data.imgUrl; // 이미지 URL 저장
    await saveProduct(imageUrl); // saveProduct 호출 시 이미지 URL 전달
  } catch (error) {
    console.error('오류:', error);
  }
};

const props = defineProps({
  currentProductCode: {
    type: String,
    required: true
  },
  currentProductName: String,
  currentProductCount: String,
  currentProductPrice: String,
  currentProductSize: String,
  currentProductContent: String,
});
const saveProduct = async (imageUrl) => {
  const requestData = {
    productName: updateProductName.value,
    productCount: updateProductCount.value,
    productPrice: updateProductPrice.value,
    productStatus: updateStatus.value,
    productExposureStatus: updateExposureStatus.value === 'true',
    productColor: updateColor.value,
    productSize: updateSize.value,
    productContent: updateContent.value,
    categoryFirstCode: updateFirstCategory.value,
    categorySecondCode: updateSecondCategory.value,
    categoryThirdCode: updateThirdCategory.value,
    url: imageUrl

  };

  console.log('Request Data:', requestData);

  try {
    const response = await fetch(`/api/admin/product/update/${props.currentProductCode}?requesterAdminCode=1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`상품 수정에 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorText}`);
    }

    console.log('상품이 성공적으로 수정되었습니다.');
    emit('close');
  } catch (error) {
    console.error('오류:', error);
  }
};

const closePopup = () => {
  emit('close');
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
