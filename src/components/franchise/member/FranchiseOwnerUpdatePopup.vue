<template>
  <div v-if="isOpen" class="popup-overlay">
    <section class="owner-info">
      <header class="header">
        <div class="logo-section">
          <h1 class="owner-title">점주 정보 수정</h1>
        </div>
        <div class="controls">
          <button class="btn cancel-btn" @click="closePopup" style="cursor: pointer">취소</button>
          <button class="btn confirm-btn" @click="updateOwnerInfo" style="cursor: pointer">수정완료</button>
        </div>
      </header>
      <section class="info-section">
        <div class="info-row">
          <label class="info-label">점주명</label>
          <p class="info-value">{{ ownerInfo.franchiseOwnerName }}</p>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label">ID</label>
          <p class="info-value">{{ ownerInfo.franchiseOwnerId }}</p>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="ownerPwd">PWD</label>
          <input type="password" v-model="ownerInfo.franchiseOwnerPwd" id="ownerPwd" class="info-value input-field" />
          <button class="btn reset-btn" @click="resetPassword(ownerInfo.franchiseOwnerCode)" style="cursor: pointer">비밀번호 재설정</button>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="ownerPhone">전화번호</label>
          <input type="text" v-model="ownerInfo.franchiseOwnerPhone" id="ownerPhone" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="ownerEmail">이메일</label>
          <input type="email" v-model="ownerInfo.franchiseOwnerEmail" id="ownerEmail" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="ownerStatus">점주 상태</label>
          <select v-model="ownerInfo.franchiseOwnerStatus" id="ownerStatus" class="info-value input-field">
            <option :value="true">활성화</option>
            <option :value="false">비활성화</option>
          </select>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';

const props = defineProps({
  isOpen: Boolean,
  franchiseOwnerCode: [String, Number],
});

const emit = defineEmits(['close', 'refresh']);

const store = useStore();
const ownerInfo = ref({
  franchiseOwnerName: '',
  franchiseOwnerId: '',
  franchiseOwnerEmail: '',
  franchiseOwnerPhone: '',
  franchiseOwnerPwd: '',
  franchiseOwnerStatus: true,
});

const fetchOwnerInfo = async () => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://localhost:5000/admin/franchise/owner/detail/${props.franchiseOwnerCode}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Owner info fetched:', data);
    ownerInfo.value = { ...data, franchiseOwnerStatus: data.franchiseOwnerStatus };
  } catch (error) {
    console.error('Error fetching owner info:', error);
  }
};

const updateOwnerInfo = async () => {
  try {
    const accessToken = store.state.accessToken;
    console.log('Sending owner info:', ownerInfo.value);
    const response = await fetch(`http://localhost:5000/admin/franchise/owner/update/${props.franchiseOwnerCode}`, {
      method: 'PUT',
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
      title: '수정 완료',
      text: '점주 정보가 성공적으로 수정되었습니다.',
    });
    emit('refresh');
    closePopup();
  } catch (error) {
    console.error('Error updating owner info:', error);
    Swal.fire({
      icon: 'error',
      title: '수정 실패',
      text: error.message || '점주 정보 수정에 실패했습니다. 다시 시도하세요.',
    });
  }
};

const resetPassword = async (franchiseOwnerCode) => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://localhost:5000/admin/franchise/owner/reset-password/${franchiseOwnerCode}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    Swal.fire({
      icon: 'success',
      title: '비밀번호 재설정 완료',
      text: '비밀번호가 성공적으로 재설정되었습니다.',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    Swal.fire({
      icon: 'error',
      title: '재설정 실패',
      text: '비밀번호 재설정에 실패했습니다. 다시 시도하세요.',
    });
  }
};

const closePopup = () => {
  emit('close');
};

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    fetchOwnerInfo();
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
