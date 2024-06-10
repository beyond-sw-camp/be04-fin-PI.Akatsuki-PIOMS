<template>
  <div v-if="isOpen" class="popup-overlay">
    <section class="admin-info">
      <header class="header">
        <div class="logo-section">
          <h1 class="admin-title">관리자 정보 수정</h1>
        </div>
        <div class="controls">
          <button class="btn cancel-btn" @click="closePopup" style="cursor: pointer">취소</button>
          <button class="btn confirm-btn" @click="updateAdminInfo" style="cursor: pointer">수정완료</button>
        </div>
      </header>
      <section class="info-section">
        <div class="info-row">
          <label class="info-label" for="adminName">관리자명</label>
          <p class="info-value" id="adminName">{{ adminInfo.adminName }}</p>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="adminId">ID</label>
          <p class="info-value" id="adminId">{{ adminInfo.adminId }}</p>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="adminPwd">PWD</label>
          <input type="password" v-model="adminInfo.adminPwd" id="adminPwd" class="info-value input-field" />
          <button class="btn reset-btn" @click="resetPassword(adminInfo.adminCode)" style="cursor: pointer">비밀번호 재설정</button>
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
          <label class="info-label" for="adminEnrollDate">등록일</label>
          <p class="info-value" id="adminEnrollDate">{{ adminInfo.enrollDate }}</p>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="adminStatus">관리자 상태</label>
          <p class="info-value" id="adminStatus">{{ adminInfo.adminStatus ? '활성화' : '비활성화'  }}</p>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';

const store = useStore();
const adminInfo = ref({});
const isOpen = ref(false); // 팝업 열림 상태

const fetchAdminInfo = async () => {
  try {
    const accessToken = store.state.accessToken;
    const userCode = store.state.userCode; // userCode 가져오기
    const response = await fetch(`http://localhost:5000/admin/list/detail/${userCode}`, {
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
    adminInfo.value = data;
  } catch (error) {
    console.error('Error fetching admin info:', error);
  }
};

const updateAdminInfo = async () => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://localhost:5000/admin/update/${adminInfo.value.adminCode}`, {
      method: 'PUT',
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
      title: '수정 완료',
      text: '관리자 정보가 성공적으로 수정되었습니다.',
    });
    closePopup();
  } catch (error) {
    console.error('Error updating admin info:', error);
    Swal.fire({
      icon: 'error',
      title: '수정 실패',
      text: error.message || '관리자 정보 수정에 실패했습니다. 다시 시도하세요.',
    });
  }
};

const resetPassword = async (adminCode) => {
  try {
    const accessToken = store.state.accessToken;
    await fetch(`http://localhost:5000/admin/reset-password/${adminCode}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
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
  store.commit('setModalOpen', false);
  isOpen.value = false; // 팝업 닫기
};

const openPopup = () => {
  isOpen.value = true; // 팝업 열기
  fetchAdminInfo(); // 관리자 정보 가져오기
};

watch(() => store.state.isModalOpen, (newValue) => {
  if (newValue) {
    openPopup();
  } else {
    isOpen.value = false;
  }
});

onMounted(() => {
  if (store.state.isModalOpen) {
    openPopup(); // 컴포넌트가 마운트될 때 팝업을 열고 정보 가져오기
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

.company-logo {
  width: 30px;
  aspect-ratio: 1.3;
  object-fit: cover;
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
  align-items: center; /* 중앙 정렬 추가 */
  gap: 20px;
  font-size: 14px;
  height: 50px; /* 행의 높이를 고정 */
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
  margin: 0; /* hr 태그의 기본 margin 제거 */
}
</style>
