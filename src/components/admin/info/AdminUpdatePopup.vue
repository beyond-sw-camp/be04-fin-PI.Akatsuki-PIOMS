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
          <label class="info-label">관리자명</label>
          <p class="info-value">{{ adminInfo.adminName }}</p>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label">ID</label>
          <p class="info-value">{{ adminInfo.adminId }}</p>
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
          <label class="info-label" for="adminStatus">관리자 상태</label>
          <select v-model="adminInfo.adminStatus" id="adminStatus" class="info-value input-field">
            <option :value="true">활성화</option>
            <option :value="false">비활성화</option>
          </select>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="adminFranchises">가맹점 추가</label>
          <div class="info-value">
            <input type="text" v-model="franchiseSearchText" placeholder="가맹점 코드 또는 이름" />
            &nbsp;
            <button @click="searchAndAddFranchise">추가</button>
          </div>
        </div>
        <hr class="separator" />
        <div class="info-row">
          <label class="info-label" for="existingFranchises">가맹점 목록</label>
          <div class="info-value">
            <ul>
              <li v-for="(franchise, index) in adminInfo.franchises" :key="index">
                {{ franchise.franchiseCode }}: {{ franchise.franchiseName }}
                <button @click="removeFranchise(franchise.franchiseCode)">제거</button>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import { defineEmits } from 'vue';

const emit = defineEmits(['close', 'refresh']);

const props = defineProps({
  isOpen: Boolean,
  adminCode: [String, Number],
});

const store = useStore();
const adminInfo = ref({
  franchises: [], // 초기값을 빈 배열로 설정
});
const franchiseSearchText = ref('');
const franchises = ref([]);
const isPopupOpen = ref(props.isOpen);

const fetchAdminInfo = async () => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://api.pioms.shop/admin/list/detail/${props.adminCode}`, {
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
    console.log('Admin info fetched:', data);

    // 프랜차이즈 이름 목록을 프랜차이즈 객체 목록으로 변환
    const franchiseObjects = data.franchiseNames.map((name, index) => {
      const franchise = franchises.value.find(fr => fr.franchiseName === name);
      return {
        franchiseCode: franchise ? franchise.franchiseCode : index + 1,
        franchiseName: name,
      };
    });

    adminInfo.value = {
      ...data,
      franchises: franchiseObjects || [], // 실제 프랜차이즈 목록을 그대로 사용
    };

    console.log('Updated adminInfo:', adminInfo.value);
    fetchFranchises();
  } catch (error) {
    console.error('Error fetching admin info:', error);
  }
};

const fetchFranchises = async () => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://api.pioms.shop/admin/franchise/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Franchises fetched:', data);
    franchises.value = data.map(franchise => ({
      franchiseCode: franchise.franchiseCode,
      franchiseName: franchise.franchiseName,
    }));
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const searchAndAddFranchise = async () => {
  const query = franchiseSearchText.value.toLowerCase();
  const foundFranchise = franchises.value.find(franchise =>
      franchise.franchiseCode.toString() === query || franchise.franchiseName.toLowerCase() === query
  );
  if (foundFranchise) {
    console.log('Adding franchise:', foundFranchise);
    await addFranchise(foundFranchise);
  } else {
    Swal.fire({
      icon: 'error',
      title: '검색 실패',
      text: '일치하는 가맹점이 없습니다.',
    });
  }
  franchiseSearchText.value = '';
};

const addFranchise = async (franchise) => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://api.pioms.shop/admin/add-franchise/${adminInfo.value.adminCode}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ franchiseCode: franchise.franchiseCode }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    await fetchAdminInfo(); // 추가 후 최신 데이터를 불러오기 위해 fetchAdminInfo 호출
    Swal.fire({
      icon: 'success',
      title: '가맹점 추가 완료',
      text: '가맹점이 성공적으로 추가되었습니다.',
    });
  } catch (error) {
    console.error('Error adding franchise:', error);
    Swal.fire({
      icon: 'error',
      title: '추가 실패',
      text: error.message || '가맹점 추가에 실패했습니다. 다시 시도하세요.',
    });
  }
};

const removeFranchise = async (franchiseCode) => {
  try {
    console.log('Removing franchise code:', franchiseCode);
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://api.pioms.shop/admin/remove-franchise/${adminInfo.value.adminCode}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ franchiseCode: franchiseCode }), // franchiseCode를 전달
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    await fetchAdminInfo(); // 제거 후 최신 데이터를 불러오기 위해 fetchAdminInfo 호출
    Swal.fire({
      icon: 'success',
      title: '가맹점 제거 완료',
      text: '가맹점이 성공적으로 제거되었습니다.',
    });
  } catch (error) {
    console.error('Error removing franchise:', error);
    Swal.fire({
      icon: 'error',
      title: '제거 실패',
      text: error.message || '가맹점 제거에 실패했습니다. 다시 시도하세요.',
    });
  }
};

const updateAdminInfo = async () => {
  try {
    const accessToken = store.state.accessToken;
    const response = await fetch(`http://api.pioms.shop/admin/update/${adminInfo.value.adminCode}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminInfo.value),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    Swal.fire({
      icon: 'success',
      title: '수정 완료',
      text: '관리자 정보가 성공적으로 수정되었습니다.',
    });
    emit('refresh');
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
    const response = await fetch(`http://api.pioms.shop/admin/reset-password/${adminCode}`, {
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
  franchiseSearchText.value = '';
};

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    fetchAdminInfo();
  } else {
    franchiseSearchText.value = '';
  }
});

onMounted(() => {
  if (props.isOpen) {
    fetchAdminInfo();
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
  max-height: 80vh;
  overflow-y: auto;
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

.info-row:last-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  overflow: auto;
  height: auto;
}
</style>
