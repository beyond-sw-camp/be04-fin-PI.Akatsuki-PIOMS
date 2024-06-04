<template>
  <!-- 배송기사 header -->
  <header class="header">
    <img class="logo" src="@/assets/icon/PIOMS_로고.png" alt="Logo"/>
    <section class="header_info">
      <div class="Delivery">
        <img class="Delivery_icon" src="@/assets/icon/Delivery.png" alt="Delivery"/>
        <h5><u>{{ username }}</u>님 정보</h5>
      </div>
      <div class="dictionary" @click="pdfDownload" style="cursor: pointer;">
        <img class="dictionary_icon" src="@/assets/icon/Dictionary.png" alt="Dictionary"/>
        <h5>배송기사 메뉴얼</h5>
      </div>
      <div>
        <button class="cta" @click="logout">
          <span>Logout</span>
          <svg width="15px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        </button>
      </div>
    </section>
  </header>
  <hr class="hr1"/>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();
const store = useStore();
const username = ref('');

const fetchUsernameFromToken = () => {
  const token = store.state.accessToken;
  if (token) {
    const decoded = jwtDecode(token);
    username.value = decoded.username;
  }
};

const pdfDownload = async () => {
  try {
    const response = await fetch('http://localhost:5000/driver/pdfdownload/driver-pdf', {
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
    await router.push('/');
  } catch (error) {
    console.error('로그아웃 오류:', error);
  }
};

onMounted(() => {
  store.dispatch('initializeAuth');
  fetchUsernameFromToken();

  const labels = document.querySelectorAll('.label');
  let hideTimeout;

  labels.forEach(label => {
    const submenu = label.nextElementSibling;

    label.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
      if (submenu) submenu.style.display = 'block';
    });

    label.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        if (!submenu.matches(':hover')) submenu.style.display = 'none';
      }, 300);
    });

    if (submenu) {
      submenu.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
      });

      submenu.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => {
          submenu.style.display = 'none';
        }, 300);
      });
    }
  });
});
</script>

<style scoped>
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
  bottom: 9px;
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

ctca:hover svg {
  transform: translateX(0);
}

.cta:active {
  transform: scale(0.95);
}

hr.hr1 {
  padding: 0;
  width: 100%;
  border: 0;
  height: 0;
  border-top: 0.5px solid #B9B9B9;
}

hr.hr2 {
  padding: 0;
  width: 100%;
  height: 0;
  border-top: 0.5px solid #B9B9B9;
  margin: 25px;
  position: relative;
}
hr.hr3 {
  padding: 0;
  margin: 5px 0px 0px 0px;
  width: 190px;
  border: 0;
  height: 0;
  border-top: 0.5px solid #B9B9B9;
}

.header_rootAdmin {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 20px;
  position: relative;
  top: 10px;
}

.dashboard {
  width: 25px;
  height: 25px;
  position: relative;
  left: 7px;
  top: 0;
}

.label {
  width: 170px;
  height: 9px;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #444444;
  line-height: 10px;
  display: inline; /* 리스트 아이템을 인라인으로 표시 */
  position: relative;
  top: -1px;
}

.label_box.show {
  display: block; /* 보이도록 변경 */
}

.nav_header .label li a {
  display: inline;
  color: #444444;
  margin-right: 60px;
  text-align: center;
  padding: 10px 20px;
  text-decoration: none;
}
.nav_header {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex; /* 수평으로 맞추기 */
  justify-content: space-between;
}
.nav_header > il {
  position: relative;
}
.label:hover {
  position: relative;
  top: -1px;
  background-color: #D9D9D9;
  border-radius: 10px;
}
.dashboard:hover {
  position: relative;
  top: -10px;
  background-color: #D9D9D9;
  border-radius: 10px;
}
.nav_header li a {
  display: flex;
  color: #444444;
  text-align: center;
  padding: 10px 20px;
  text-decoration: none;
  justify-content: space-evenly;
}
.dashboard,
.label {
  margin-right: 100px;
}

</style>
