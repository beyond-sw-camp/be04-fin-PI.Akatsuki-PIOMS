<template>
  <div v-if="isOpen" class="popup-overlay">
    <section class="driver-info">
      <header class="header">
        <div class="logo-section">
          <h1 class="driver-title">배송 기사 정보 수정</h1>
        </div>
        <div class="controls">
          <button class="btn cancel-btn" @click="closePopup">취소</button>
          <button class="btn confirm-btn" @click="updateDriverInfo">수정완료</button>
        </div>
      </header>
      <section class="info-section">
        <div class="info-row">
          <label class="info-label">배송기사명</label>
          <p class="info-value">{{ driverInfo.driverName }}</p>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label">ID</label>
          <p class="info-value">{{ driverInfo.driverId }}</p>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="driverPwd">PWD</label>
          <input type="password" v-model="driverInfo.driverPwd" id="driverPwd" class="info-value input-field" />
          <button class="btn reset-btn" @click="resetPassword(driverInfo.driverCode)">비밀번호 재설정</button>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="driverPhone">전화번호</label>
          <input type="text" v-model="driverInfo.driverPhone" id="driverPhone" class="info-value input-field" />
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="driverStatus">상태</label>
          <select v-model="driverInfo.driverStatus" id="driverStatus" class="info-value input-field">
            <option :value="true">활성화</option>
            <option :value="false">비활성화</option>
          </select>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';

const props = defineProps({
  isOpen: Boolean,
  driverCode: [String, Number],
});

const emit = defineEmits(['close', 'refresh']);

const store = useStore();
const driverInfo = ref({
  driverName: '',
  driverId: '',
  driverPwd: '',
  driverPhone: '',
  driverStatus: true,
});

const fetchDriverInfo = async () => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://localhost:5000/admin/driver/list/detail/${props.driverCode}`, {
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
    driverInfo.value = {...data, driverStatus: data.driverStatus};
  } catch (error) {
    console.error('Error fetching driver info:', error);
  }
};

const updateDriverInfo = async () => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://localhost:5000/admin/driver/update/${props.driverCode}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverInfo.value),
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text);
    }
    Swal.fire({
      icon: 'success',
      title: '수정 완료',
      text: '배송 기사 정보가 성공적으로 수정되었습니다.',
    });
    emit('refresh');
    closePopup();
  } catch (error) {
    console.error('Error updating driver info:', error);
    Swal.fire({
      icon: 'error',
      title: '수정 실패',
      text: error.message || '배송 기사 정보 수정에 실패했습니다. 다시 시도하세요.',
    });
  }
};

const resetPassword = async (driverCode) => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://localhost:5000/admin/driver/reset-password/${driverCode}`, {
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
    fetchDriverInfo();
  }
});

onMounted(() => {
  if (props.isOpen) {
    fetchDriverInfo();
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

.driver-info {
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

.driver-title {
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
