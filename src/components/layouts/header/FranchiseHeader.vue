<template>
  <!-- 점주 header -->
  <header class="header">
    <img class="logo" src="@/assets/icon/PIOMS_로고.png" alt="Logo"/>
    <section class="header_info">
      <div class="smile">
        <img class="smile_icon" src="@/assets/icon/smile.png" alt="smile"/>
        <h5><u>{{ username }}</u>님 정보</h5>
      </div>
      <div class="dictionary">
        <img class="dictionary_icon" src="@/assets/icon/Dictionary.png" alt="Dictionary"/>
        <button @click="pdfDownload">점주 매뉴얼</button>
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

  <!-- 카테고리 -->
  <nav class="header_rootAdmin">
    <ul class="nav_header">
      <router-link to="/franchise/home" style="align-items: center; display: flex">
        <a href="#" class="dashboard" >
          <img src="@/assets/icon/dashboard.png"/>
        </a>
      </router-link>

      <li>
        <a href="#" class="label">가맹점 관리</a>
        <div class="submenu_box">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">가맹점 관리</h4></a>
              <ul class="submenu_sub">
                <li><router-link to="/franchise/store/list" class="depth2">가맹점 정보 관리</router-link></li>
              </ul>
            </li>
          </ul>
        </div>
      </li>

      <li>
        <a href="#" class="label">상품 및 재고 관리</a>
        <div class="submenu_box1">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">상품 관리</h4></a>
              <ul class="submenu_sub">
                <li><router-link to="/franchise/product/list" class="depth2">상품 등록 및 관리</router-link></li>
                <li><router-link to="/franchise/product/favorites" class="depth2">즐겨찾기 상품 관리</router-link></li>
              </ul>
              <hr class="hr3">
            </li>
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">재고 관리</h4></a>
              <ul class="submenu_sub">
                <li><router-link to="/franchise/stock/alerts" class="depth2">재고 알림 관리</router-link></li>
              </ul>
            </li>
          </ul>
        </div>
      </li>

      <li>
        <a href="#" class="label">발주 및 교환 관리</a>
        <div class="submenu_box2">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">발주 관리</h4></a>
              <ul class="submenu_sub">
                <li><router-link to="/franchise/order/list" class="depth2">발주내역 조회 및 관리</router-link></li>
              </ul>
              <hr class="hr3">
            </li>
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">교환/반품 관리</h4></a>
              <ul class="submenu_sub">
                <li><router-link to="/franchise/exchange/list" class="depth2">교환/반품 관리</router-link></li>
              </ul>
            </li>
          </ul>
        </div>
      </li>

      <li>
        <a href="#" class="label">공지 및 문의 관리</a>
        <div class="submenu_box3">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">공지사항 관리</h4></a>
              <ul class="submenu_sub">
                <li><router-link to="/franchise/notice/list" class="depth2">공지사항 처리</router-link></li>
              </ul>
              <hr class="hr3">
            </li>
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">문의사항 관리</h4></a>
              <ul class="submenu_sub">
                <li><router-link to="/franchise/ask" class="depth2">문의사항 관리 및 조회</router-link></li>
              </ul>
            </li>
          </ul>
        </div>
      </li>

      <li>
        <a href="#" class="label">통계 관리</a>
        <div class="submenu_box">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">통계 관리</h4></a>
              <ul class="submenu_sub">
                <li><router-link to="/franchise/statistics" class="depth2">통계(미정) 관리</router-link></li>
              </ul>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
  <hr class="hr2"/>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { jwtDecode } from 'jwt-decode';

const store = useStore();
const accessToken = store.state.accessToken;
const router = useRouter();
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
    const response = await fetch('http://api.pioms.shop/franchise/pdfdownload/fraowner-pdf', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
    link.download = 'FrOwnerManual.pdf';
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
  width: 2100px;
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
.smile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 50px;
}
.smile_icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
}
.dictionary {
  display: flex;
  align-items: center;
  width: 110px;
  height: 50px;
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
  padding: 0;
  width: 2100px;
  border: 0;
  height: 0;
  border-top: 0.5px solid #B9B9B9;
  position: relative;
}

hr.hr2 {
  padding: 0;
  width: 2100px;
  height: 0;
  border: 0;
  border-top: 0.5px solid #B9B9B9;
  position: relative;
  top: 22px;
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
  width: 2100px;
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
  margin-right: 150px;
}
.dashboard {
  width: 20px;
  height: 18px; /* 아이콘 크기 조정 */
  vertical-align: middle;
  position: relative;
  top: -10px;
  right: 3px;
}

/* 여기서부터 헤더 카테고리 css */
/* 기본적으로 하위 메뉴 숨기기 */
.submenu, .submenu_sub {
  display: none;
}

/* .show 클래스가 추가되면 하위 메뉴 표시 */
.nav_header li:hover .submenu,
.submenu:hover,
.submenu_sub:hover {
  display: block;
}

.submenu {
  position: relative;
  top: 10px;
  right: 25px;
  list-style-type: none;
  height: 20px;
  text-align: center;
  margin: 0;
}

.submenu_sub {
  display: flex;
  padding: 0;
  margin: 0;
  list-style-type: none;
  flex-direction: column;
}
.submenu .depth1 li a{
  width: 120px !important;
  height: 20px !important;
}
#depth1_title {
  display: flex;
  position: relative;
  top: 3px;
  justify-content: center;
  align-items: center;
  margin: 0;
  height: 20px;
  font-size: 13px;
  font-weight: bold;
  color: #ffffff;
  background-color: #394CA9;
  border-radius: 15px;
  width: 150px;
  height: 30px;
}
.submenu_box
,.submenu_box1
,.submenu_box2
,.submenu_box3 {
  display: none;
  position: relative;
  top: 10px;
  margin: 0;
  border-radius: 15px;
  border: 1px solid #B9B9B9;
  background-color: #fff;
  width: 220px;
  z-index: 9999;
}
.submenu_box {
  height: 100px;
}
.submenu_box1 {
  height: 250px;
}
.submenu_box2 {
  height: 330px;
}
.submenu_box3 {
  height: 210px;
}
.depth2 {
  display: flex;
  margin: 0;
  height: 20px;
  font-size: 13px;
}
.depth2:hover {
  color: #394CA9;
  background-color: #D9D9D9;
  border-radius: 12px;
  height: 12px;
}
/* .show 클래스가 추가되면 하위 메뉴 표시 */
.show {
  display: block;
}

</style>
