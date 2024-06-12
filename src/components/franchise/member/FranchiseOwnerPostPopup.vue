<template>
  <div v-if="isOpen" class="popup-overlay">
    <section class="owner-info">
      <header class="header">
        <div class="logo-section">
          <h1 class="owner-title">점주 등록</h1>
        </div>
        <div class="controls">
          <button class="btn cancel-btn" @click="closePopup" style="cursor: pointer">취소</button>
          <button class="btn confirm-btn" @click="registerOwner" style="cursor: pointer">등록완료</button>
        </div>
      </header>
      <section class="info-section">
        <div class="info-row">
          <label class="info-label" for="ownerName">점주명</label>
          <input type="text" v-model="ownerInfo.ownerName" id="ownerName" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="ownerId">ID</label>
          <input type="text" v-model="ownerInfo.ownerId" id="ownerId" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="ownerPwd">PWD</label>
          <input type="password" v-model="ownerInfo.ownerPwd" id="ownerPwd" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="ownerPhone">전화번호</label>
          <input type="text" v-model="ownerInfo.ownerPhone" id="ownerPhone" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="ownerEmail">이메일</label>
          <input type="email" v-model="ownerInfo.ownerEmail" id="ownerEmail" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="ownerFranchiseName">가맹점명</label>
          <input type="text" v-model="ownerInfo.ownerFranchiseName" id="ownerFranchiseName" class="info-value input-field" />
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'refresh']);

const store = useStore();
const ownerInfo = ref({
  ownerName: '',
  ownerId: '',
  ownerPwd: '',
  ownerPhone: '',
  ownerEmail: '',
  ownerFranchiseName: '',
});

const registerOwner = async () => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch('http://api.pioms.shop/admin/franchise/owner/register', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ownerInfo.value),
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text);
    }
    Swal.fire({
      icon: 'success',
      title: '등록 완료',
      text: '점주가 성공적으로 등록되었습니다.',
    });
    closePopup();
    emit('refresh');
  } catch (error) {
    console.error('Error registering owner:', error);
    Swal.fire({
      icon: 'error',
      title: '등록 실패',
      text: error.message || '점주 등록에 실패했습니다. 다시 시도하세요.',
    });
  }
};

const closePopup = () => {
  emit('close');
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.owner-info {
  border-radius: 15px;
  background-color: #d9d9d9;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  padding: 20px 30px;
}

.header {
  height: 35px;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  gap: 20px;
}

.logo-section {
  display: flex;
  gap: 16px;
  font-size: 15px;
  color: #444;
  align-items: center;
}

.owner-title {
  font-family: Inter, sans-serif;
  flex-grow: 1;
}

.controls {
  display: flex;
  gap: 12px;
  color: #fff;
  font-size: 12px;
}

.btn {
  border-radius: 3px;
  padding: 7px 8px;
  font-family: Inter, sans-serif;
  text-align: center;
}

.cancel-btn {
  background-color: #9b9b9b;
}

.confirm-btn {
  background-color: rgba(255, 205, 75, 0.9);
}

.info-section {
  border-radius: 10px;
  background-color: #fbfbfb;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 20px 30px;
  color: #444;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  height: 50px;
}

.info-label {
  font-family: Inter, sans-serif;
  font-weight: 700;
}

.info-value {
  border-radius: 3px;
  padding: 9px 12px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  flex-grow: 1;
}

.input-field {
}

.separator {
  border: 1px solid rgba(217, 217, 217, 1);
  background-color: #d9d9d9;
  margin: 0;
}
</style>
