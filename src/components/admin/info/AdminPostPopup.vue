<template>
  <div v-if="isOpen" class="popup-overlay">
    <section class="admin-info">
      <header class="header">
        <div class="logo-section">
          <h1 class="admin-title">관리자 등록</h1>
        </div>
        <div class="controls">
          <button class="btn cancel-btn" @click="closePopup" style="cursor: pointer">취소</button>
          <button class="btn confirm-btn" @click="registerAdmin" style="cursor: pointer">등록완료</button>
        </div>
      </header>
      <section class="info-section">
        <div class="info-row">
          <label class="info-label" for="adminName">관리자명</label>
          <input type="text" v-model="adminInfo.adminName" id="adminName" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="adminId">ID</label>
          <input type="text" v-model="adminInfo.adminId" id="adminId" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="adminPwd">PWD</label>
          <input type="password" v-model="adminInfo.adminPwd" id="adminPwd" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="adminPhone">전화번호</label>
          <input type="text" v-model="adminInfo.adminPhone" id="adminPhone" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="adminEmail">이메일</label>
          <input type="email" v-model="adminInfo.adminEmail" id="adminEmail" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="adminRole">역할</label>
          <select v-model="adminInfo.adminRole" id="adminRole" class="info-value input-field">
            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            <option value="ROLE_ROOT">ROLE_ROOT</option>
          </select>
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
const adminInfo = ref({
  adminName: '',
  adminId: '',
  adminPwd: '',
  adminPhone: '',
  adminEmail: '',
  adminRole: 'ROLE_ADMIN',
});

const registerAdmin = async () => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch('http://localhost:5000/admin/register', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminInfo.value),
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text);
    }
    Swal.fire({
      icon: 'success',
      title: '등록 완료',
      text: '관리자가 성공적으로 등록되었습니다.',
    });
    closePopup();
    emit('refresh');
  } catch (error) {
    console.error('Error registering admin:', error);
    Swal.fire({
      icon: 'error',
      title: '등록 실패',
      text: error.message || '관리자 등록에 실패했습니다. 다시 시도하세요.',
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

.admin-info {
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

.admin-title {
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
