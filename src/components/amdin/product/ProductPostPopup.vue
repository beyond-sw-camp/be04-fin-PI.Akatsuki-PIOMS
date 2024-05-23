<template>
  <div class="popup-overlay" @click.self="closePopup">
    <div class="popup-content">
      <div class="popup-header">
      <button class="close-button" @click="closePopup">×</button>
        <h4>상품 등록</h4>
      </div>
      <div class="popup-body">
        <div class="insert-section">
          <div class="table-wrapper">
            <table class="insert-table">
              <tr>
                <td class="insert-label">상품명</td>
                <td class="insert-input">
                  <input type="text" v-model="insertProductName" />
                </td>
                <td class="insert-label">재고량</td>
                <td class="insert-input">
                  <input type="number" id="numberInput" v-model="insertProductCount">
                </td>
                <td class="insert-label">최소 알림 수량</td>
                <td class="insert-input">
                  <input type="number" id="numberInput" v-model="insertProductCount">
                </td>
              </tr>
              <tr>
                <td class="insert-label">폐기량</td>
                <td class="insert-input">
                  <input type="number" id="numberInput" v-model="insertProductCount">
                </td>
                <td class="insert-label">가격</td>
                <td class="insert-input">
                  <input type="number" id="numberInput" v-model="insertProductPrice">
                </td>

                <td class="insert-label">본사 총수량</td>
                <td class="insert-input">
                  <input type="number" id="numberInput" v-model="insertProductCount">
                </td>
              </tr>
              <tr>
                <td class="insert-label">상품상태</td>
                <td class="insert-input">
                  <select id="insertStatus" v-model="insertStatus">
                    <option value="공급가능">공급가능</option>
                    <option value="일시제한">일시제한</option>
                    <option value="단종">단종</option>
                    <option value="품절">품절</option>
                  </select>
                </td>
                <td class="insert-label">상품노출상태</td>
                <td class="insert-input">
                  <select id="selectedExposureStatus" v-model="selectedExposureStatus">
                    <option value="노출">노출</option>
                    <option value="미노출">미노출</option>
                  </select>
                </td>
                <td class="insert-label">색상</td>
                <td class="insert-input">
                  <select id="insertColor" v-model="insertColor">
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
                  <select id="insertSize" v-model="insertSize">
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
                <td class="second-insert-label">카테고리 구분</td>
                <td class="second-insert-input">
                  <select id="firstCategory" v-model="selectedFirstCategory" @change="fetchSecondCategories">
                    <option value="">대분류</option>
                    <option v-for="category in firstCategories" :key="category.categoryFirstCode" :value="category.categoryFirstCode">
                      {{ category.categoryFirstName }}
                    </option>
                  </select>
                  <select class="categories" id="secondCategory" v-model="selectedSecondCategory" @change="fetchThirdCategories">
                    <option value="">중분류</option>
                    <option v-for="category in secondCategories" :key="category.categorySecondCode" :value="category.categorySecondCode">
                      {{ category.categorySecondName }}
                    </option>
                  </select>
                  <select class="categories" id="thirdCategory" v-model="selectedThirdCategory">
                    <option value="">소분류</option>
                    <option v-for="category in thirdCategories" :key="category.categoryThirdCode" :value="category.categoryThirdCode">
                      {{ category.categoryThirdName }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td class="second-insert-label">상세정보</td>
                <td class="second-insert-input">
                  <input type="text" style="width: 100%; height: 100px">
                </td>
              </tr>
              <tr>
                <td class="second-insert-label1">
                  <div class="label-content">
                  이미지<br><h6>(최대 3장)</h6>
                  </div>
                </td>
                <td class="second-insert-input1">
                  <div class="imgForm">
                    <form @submit.prevent="uploadImage">
                      <input id="imgUpload" type="file" @change="previewImage" hidden/> <!-- @change 이벤트를 사용하여 파일 선택 시 previewImage 메서드 호출 -->
                      <button v-if="imagePreview !== imageSrc && imgOn" @click="resetImage" class="img-close-button">X</button>
                      <label for="imgUpload">
                        <img class="img" v-if="!imgOn" src="@/assets/icon/picture.png" />
                        <img class="img" :src="imagePreview" /> <!-- 이미지 미리보기 -->
                      </label>
                      <br/>
                    </form>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <button class="action-button" @click="closePopup">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, defineEmits, ref} from 'vue';
import imageSrc from '@/assets/icon/picture.png';

const emit = defineEmits(['close']);

const resetImage = () => {
  imagePreview.value = imageSrc;
};
const imagePreview = ref(null); // 이미지 미리보기 URL
const imgOn = ref(false);
const previewImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.value = reader.result;
    };
    reader.readAsDataURL(file);
    imgOn.value = true;
  }
};

const uploadImage = async(status) => {
  const fileInput = document.querySelector('input[type="file"]');
  const file = fileInput.files[0];
  if(file ==null) {
    saveEditedFeed("",status);
    return;
  }
  const formData = new FormData();
  formData.append('file', file);

  await fetch(`/api/admin/product/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  })
      .then(response => {
        // 서버 응답을 JSON으로 파싱하지 않음
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // 응답 반환
        return response.json();
      })
      .then(data => {
        console.log('Image URL:', data);
        saveEditedFeed(data.imgUrl,status);
      })
      .catch(error => {
        console.error('Error:', error);
      });
};
function closePopup() {
  emit('close');
}


onMounted(() => {
  const numberInput = document.getElementById('numberInput');
  if (numberInput) {
    numberInput.addEventListener('keypress', (event) => {
      if (event.key.length === 1 && !/\d/.test(event.key)) {
        event.preventDefault();
      }
    });

    numberInput.addEventListener('input', (event) => {
      numberInput.value = numberInput.value.replace(/[^0-9]/g, '');
    });
  }
});

</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  padding-top: 40px;
  z-index: 1000;
}

.popup-content {
  background: #fff;
  padding: 0;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  position: relative;
  width: 1200px;
  height: 800px;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #333;
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
}

.popup-body {
  padding: 30px;
  text-align: center;
}

.close-button:hover {
  color: #f00;
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
  margin-bottom: 20px;
}

.insert-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 1200px;
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
  width: 10%;
  background-color: #D9D9D9;
  border: 1px solid #ddd;
}

.insert-input {
  width: 500px;
  text-align: left;
  border: 1px solid lightgray;
  border-right: none;

}
.second-insert-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 1200px;
  border-top: none;
}
.second-insert-table tr {
  text-align: center;
}
.second-insert-table td {
  padding: 5px 10px;
  text-align: left;
}
.categories {
  margin-left: 2%;
}
.second-insert-label {
  font-weight: bold;
  text-align: center;
  width: 10%;
  background-color: #D9D9D9;
  border: 1px solid #ddd;
  font-size: small;

}
.second-insert-input {
  width: 500px;
  border: 1px solid lightgray;
  border-right: none;
}

.label-content h6 {
  margin: 0;
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
  color: #f00;
}
</style>
