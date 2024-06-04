<template>
  <div class="popup-overlay" @click.self="closeEdit">
    <div class="popup-content">
      <div class="popup-header">
        <button class="close-button" @click="closeEdit">×</button>
        <h4>상품 수정</h4>
      </div>
      <div class="popup-body">
        <div class="insert-section">
          <div class="table-wrapper">
            <table class="top-table">
              <tr>
                <td class="second-insert-label">
                  <div class="second-insert-label0">카테고리 구분</div>
                </td>
                <td class="second-insert-input">
                  <select v-model="updateFirst" @change="fetchCategories('second')" class="categories">
                    <option value="">{{ getCategoryFirstName(props.currentCategoryFirstCode) }}</option>
                    <option v-for="category in firstCategories" :key="category.categoryFirstCode" :value="category.categoryFirstCode">
                      {{ category.categoryFirstName }}
                    </option>
                  </select>
                  <select v-model="updateSecond" @change="fetchCategories('third')" class="categories-g">
                    <option value="">{{ getCategorySecondName(props.currentCategorySecondCode) }}</option>
                    <option v-for="category in secondCategories" :key="category.categorySecondCode" :value="category.categorySecondCode">
                      {{ category.categorySecondName }}
                    </option>
                  </select>
                  <select v-model="updateThird" class="categories-g">
                    <option value="">{{ getCategoryThirdName(props.currentCategoryThirdCode) }}</option>
                    <option v-for="category in thirdCategories" :key="category.categoryThirdCode" :value="category.categoryThirdCode">
                      {{ category.categoryThirdName }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td class="insert-label">상품명</td>
                <td class="insert-input-name">
                  <input type="text" :value="currentProductName" @input="updateName = $event.target.value" class="textInput" />
                </td>
                <td class="insert-label">재고량</td>
                <td class="insert-input">
                  <input type="number" :value="currentProductCount" @input="updateCount = $event.target.value" class="textInput" />
                </td>
              </tr>
            </table>
            <table class="top-table">
              <tr>
                <td class="insert-label">색상</td>
                <td class="insert-input">
                  <select :value="currentProductColor" @change="updateColor = $event.target.value" class="textInput">
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
                  <select :value="currentProductSize" @change="updateSize = $event.target.value" class="textInput">
                    <option value="90">90</option>
                    <option value="95">95</option>
                    <option value="100">100</option>
                    <option value="105">105</option>
                    <option value="110">110</option>
                  </select>
                </td>

              </tr>
            </table>
            <table class="insert-table">
              <tr>

                <td class="insert-label">가격</td>
                <td class="insert-input">
                  <input type="number" :value="currentProductPrice" @input="updatePrice = $event.target.value" class="textInput" />
                </td>
                <td class="insert-label">상품상태</td>
                <td class="insert-input">
                  <select :value="currentProductStatus" @change="updateStatus = $event.target.value" class="textInput">
                    <option value="공급가능">공급가능</option>
                    <option value="일시제한">일시제한</option>
                    <option value="단종">단종</option>
                    <option value="품절">품절</option>
                  </select>
                </td>
              </tr>
            </table>
            <table class="second-insert-table">
              <tr>
                <td class="second-insert-label">
                  <div class="second-insert-label0">상세정보</div>
                </td>
                <td class="second-insert-input">
                  <textarea :value="currentProductContent" @input="updateContent = $event.target.value" class="textInput" style="width: 99%; height: 150px"></textarea>
                </td>
              </tr>
              <tr>
                <td class="second-insert-input1">
                  <div class="imgForm">
                    <form>
                      <input id="imgUpload" type="file" @change="previewImage" hidden />
                      <button v-if="imagePreview !== imageSrc && imgOn" @click="resetImage" class="img-close-button">X</button>
                      <label for="imgUpload">
                        <!-- Display current product image if available -->
                        <img class="img" v-if="props.currentProductImgUrl" :src="props.currentProductImgUrl" />
                        <!-- Display default image if current product image is not available -->
                        <img class="img" v-else :src="imageSrc" />
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
          <button class="action-button" @click="closeEdit">취소</button>
          <button class="post-button" @click="submitProduct">수정</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, defineProps, watch} from 'vue';
import { useStore } from 'vuex';
import ProductList from "@/components/amdin/product/ProductList.vue";
import imageSrc from "@/assets/icon/picture.png";

const store = useStore();
const accessToken = store.state.accessToken;

const imagePreview = ref(imageSrc);
const imgOn = ref(false);

const firstCategories = ref([]);
const secondCategories = ref([]);
const thirdCategories = ref([]);
const categoryFirstMap = ref({});
const categorySecondMap = ref({});
const categoryThirdMap = ref({});

const updateName = ref('');
const updateCount = ref('');
const updatePrice = ref('');
const updateStatus = ref('');
const updateColor = ref('');
const updateSize = ref('');
const updateFirst = ref('');
const updateSecond = ref('');
const updateThird = ref('');
const updateContent = ref('');
const props = defineProps({
  currentProductCode: String,
  currentProductName: String,
  currentProductCount: String,
  currentProductPrice: String,
  currentProductStatus: String,
  currentProductColor: String,
  currentProductSize: String,
  currentCategoryFirstCode: String,
  currentCategorySecondCode: String,
  currentCategoryThirdCode: String,
  currentProductContent: String,
  currentProductImgUrl: String,
  closeEdit: Function
});

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
const submitProduct = async () => {
  const fileInput = document.querySelector('input[type="file"]');
  const file = fileInput.files[0];

  const formData = new FormData();

  if(!file) {
    alert('상품의 사진을 첨부해주세요.');
    return;
  }

  // 이미지 파일 추가
  if (file) {
    formData.append('file', file);
  }

  // 상품 정보 추가
  formData.append('productName', updateName.value !== '' ? updateName.value : props.currentProductName);
  formData.append('productCount', updateCount.value !== '' ? updateCount.value : props.currentProductCount);
  formData.append('productPrice', updatePrice.value !== '' ? updatePrice.value : props.currentProductPrice);
  formData.append('productStatus', updateStatus.value !== '' ? updateStatus.value : props.currentProductStatus);
  formData.append('productColor', updateColor.value !== '' ? updateColor.value : props.currentProductColor);
  formData.append('productSize', updateSize.value !== '' ? updateSize.value : props.currentProductSize);
  formData.append('categoryFirstCode', updateFirst.value !== '' ? updateFirst.value : props.currentCategoryFirstCode);
  formData.append('categorySecondCode', updateSecond.value !== '' ? updateSecond.value : props.currentCategorySecondCode);
  formData.append('categoryThirdCode', updateThird.value !== '' ? updateThird.value : props.currentCategoryThirdCode);
  formData.append('productContent', updateContent.value !== '' ? updateContent.value : props.currentProductContent);
  console.log(formData.values());
  try {
    const response = await fetch(`http://localhost:5000/admin/product/update/image/${props.currentProductCode}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }
    console.log('드디어 수정 성공!');
    location.reload(ProductList);
    props.closeEdit();
  } catch (error) {
    console.error('수정 실패:', error);
  }
};

const fetchCategories = async (level) => {
  let url = '';
  switch (level) {
    case 'first':
      url = 'http://api.pioms.shop/admin/category/first';
      break;
    case 'second':
      url = `http://api.pioms.shop/admin/category/second/list/detail/categoryfirst/${updateFirst.value}`;
      break;
    case 'third':
      url = `http://api.pioms.shop/admin/category/third/list/detail/categorysecond/${updateSecond.value}`;
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
        data.forEach(category => {
          categoryFirstMap.value[category.categoryFirstCode] = category.categoryFirstName;
        });
        break;
      case 'second':
        secondCategories.value = data;
        data.forEach(category => {
          categorySecondMap.value[category.categorySecondCode] = category.categorySecondName;
        });
        thirdCategories.value = [];
        updateSecond.value = '';
        break;
      case 'third':
        thirdCategories.value = data;
        data.forEach(category => {
          categoryThirdMap.value[category.categoryThirdCode] = category.categoryThirdName;
        });
        break;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
const getCategoryFirstName = (code) => {
  return categoryFirstMap.value[code] || '';
};
const getCategorySecondName = (code) => {
  return categorySecondMap.value[code] || '';
};
const getCategoryThirdName = (code) => {
  return categoryThirdMap.value[code] || '';
};

onMounted(async () => {
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

  await fetchCategories('first');

  if (props.currentCategoryFirstCode) {
    updateFirst.value = props.currentCategoryFirstCode;
    await fetchCategories('second');
  }
  if (props.currentCategorySecondCode) {
    updateSecond.value = props.currentCategorySecondCode;
    await fetchCategories('third');
  }
});

watch(updateFirst, async (newVal) => {
  if (newVal) {
    await fetchCategories('second');
  }
});
watch(updateSecond, async (newVal) => {
  if (newVal) {
    await fetchCategories('third');
  }
});
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
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 50%;
  max-width: 2000px;
  height: 73%;
  overflow-y: auto;
  max-height: 90vh;
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
  //border-radius: 5px;
  //margin-bottom: 20px;;
}

.popup-body {
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
  justify-content: center;
  width: 100%;
}

.insert-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  border-top: none;
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
  min-width: 100px;
  max-width: 100px;
  background-color: #D9D9D9;
  border: 1px solid #ddd;
  height: 50px;
}

.insert-input {
  width: 100%;
  min-width: 200px;
  max-width: 200px;
  text-align: left;
  border: 1px solid lightgray;
  border-right: none;
  height: 30px;
}
.insert-input-name {
  width: 100%;
  min-width: 200px;
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
  min-width: 100px;
  max-width: 100px;
  background-color: #D9D9D9;
  border: 1px solid #ddd;
  height: 50px;
}

.second-insert-input {
  width: 100%;
  border: 1px solid lightgray;
  border-right: none;
  text-align: left;

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
  //margin-left: 80%;
  //margin-top: 2%;
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
