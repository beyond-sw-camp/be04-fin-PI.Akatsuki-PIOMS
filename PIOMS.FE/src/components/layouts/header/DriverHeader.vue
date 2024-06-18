<template>
  <header class="header">
    <img class="logo" src="@/assets/icon/PIOMS_로고.png" alt="Logo" />
    <section class="header_info">
      <div class="Delivery" @click="openModal" style="cursor: pointer">
        <img class="Delivery_icon" src="@/assets/icon/Delivery.png" alt="Delivery" />
        <h5><u>{{ username }}</u>님 정보</h5>
      </div>
      <div class="dictionary" @click="pdfDownload" style="cursor: pointer;">
        <img class="dictionary_icon" src="@/assets/icon/Dictionary.png" alt="Dictionary" />
        <button class="pdfDownload" style="cursor: pointer" @click="pdfDownload">배송기사 매뉴얼</button>
      </div>
      <div>
        <button class="cta" @click="confirmLogout">
          <span>Logout</span>
          <svg width="15px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        </button>
      </div>
    </section>
  </header>
  <hr class="hr1" />
  <DriverInfoPopup v-if="isModalOpen" @close="closeModal" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import DriverInfoPopup from "@/components/driver/info/DriverInfoPopup.vue";

const store = useStore();
const router = useRouter();
const username = ref('');
const isModalOpen = ref(false);

const fetchUsernameFromToken = () => {
  const token = store.state.accessToken;
  if (token) {
    const decoded = jwtDecode(token);
    username.value = decoded.username;
  }
};

const pdfDownload = async () => {
  try {
    const response = await fetch('http://api.pioms.shop/driver/pdfdownload/driver-pdf', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${store.state.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DriverManual.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
};

const logout = async () => {
  try {
    await store.dispatch('logout');
    Swal.fire({
      icon: 'success',
      title: '로그아웃이 정상적으로 완료되었습니다.',
      confirmButtonText: '확인'
    }).then(() => {
      router.push('/');
    });
  } catch (error) {
    console.error('로그아웃 오류:', error);
  }
};

const confirmLogout = async () => {
  Swal.fire({
    icon: 'warning',
    title: '로그아웃 하시겠습니까?',
    showCancelButton: true,
    confirmButtonText: '예',
    cancelButtonText: '아니오'
  }).then((result) => {
    if (result.isConfirmed) {
      logout();
    }
  });
};

const openModal = () => {
  console.log(`${username.value}님이 정보 팝업을 열었습니다.`);
  store.commit('setModalOpen', true); // 모달 열기 상태를 Vuex에 저장
};

const closeModal = () => {
  store.commit('setModalOpen', false); // 모달 닫기 상태를 Vuex에 저장
};

watch(() => store.state.isModalOpen, (newValue) => {
  isModalOpen.value = newValue;
  console.log(`isModalOpen state changed to: ${newValue}`);
});

onMounted(() => {
  store.dispatch('initializeAuth');
  fetchUsernameFromToken();
});
</script>

<style scoped>
.pdfDownload {
  font-weight: bold;
  font-size: 12px;
  border: none;
  padding: 0;
  margin-left: 5px;
  background-color: #FFFFFF;
}

header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 35px;
}

.header_info {
  display: flex;
  justify-content: center;
  height: 50px;
  position: absolute;
  top: 0;
  right: 0;
}

.logo {
  width: 100px;
  height: 50px;
  position: relative;
  bottom: 2px;
  left: 7px;
}

.Delivery {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 50px;
}

.Delivery_icon {
  width: 20px;
  height: 18px;
  margin-right: 5px;
}

.dictionary {
  display: flex;
  align-items: center;
  width: 110px;
  height: 50px;
  margin-right: 15px;
}

.dictionary_icon {
  margin-left: 1px;
  margin-right: 2px;
  width: 17px;
  height: 17px;
}

.cta {
  position: relative;
  margin-right: 5px;
  padding: 15px 18px;
  transition: all 0.2s ease;
  border: none;
  background: none;
  cursor: pointer;
}

.cta:before {
  content: "";
  position: absolute;
  top: 18%;
  left: 0;
  display: block;
  border-radius: 50px;
  background: #B9B9B9;
  width: 30px;
  height: 30px;
  transition: all 0.3s ease;
}

.cta span {
  position: relative;
  font-family: "Ubuntu", sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #394CA9;
}

.cta svg {
  position: relative;
  top: 0;
  margin-left: 10px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #234567;
  stroke-width: 2;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}

.cta:hover:before {
  width: 100%;
  background: #FFCD4B;
}

.cta:hover svg {
  transform: translateX(0);
}

.cta:active {
  transform: scale(0.95);
}

hr.hr1 {
  position: relative;
  bottom: -5px;
  width: 100%;
  border: 0;
  height: 0;
  border-top: 0.5px solid #B9B9B9;
}
</style>
