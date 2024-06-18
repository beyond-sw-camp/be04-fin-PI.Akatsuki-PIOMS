<template>
  <div class="fb__header-info">
    <router-link to="/franchise/home" class="link-page">
      <a><img class="logo" src="@/assets/icon/PIOMS_로고.png" alt="Logo" /></a>
    </router-link>
    <section class="header_info">
      <div class="crown" style="cursor: pointer" @click="openModal">
        <img class="crown_icon" src="@/assets/icon/smile.png" alt="User Role Icon" />
        <h5><u>{{ username }}</u>&nbsp;님</h5>
      </div>
      <div class="dictionary" style="cursor: pointer">
        <img class="dictionary_icon" src="@/assets/icon/Dictionary.png" alt="Dictionary" />
        <h5 @click="pdfDownload">점주 매뉴얼</h5>
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
  </div>

  <FranchiseInfoPopup v-if="isModalOpen" @close="closeModal" />

  <div class="fb__header-btn">
    <nav class="header_rootAdmin">
      <ul class="nav_header">
        <li>
          <a class="label">창고 조회 및 재고 관리</a>
          <div class="submenu_box" style="height: 250px">
            <ul class="submenu">
              <li>
                <a class="depth1" style="cursor: default"><h4 id="depth1_title">창고 조회</h4></a>
                <ul class="submenu_sub">
                  <li><router-link to="/franchise/product/list" class="depth2">본사 창고 조회</router-link></li>
                  <li><router-link to="/franchise/warehouse/list" class="depth2">가맹 창고 조회</router-link></li>
                </ul>
                <hr class="hr3" />
              </li>
              <li>
                <a class="depth1" style="cursor: default"><h4 id="depth1_title">즐겨찾기 관리</h4></a>
                <ul class="submenu_sub">
                  <li><router-link to="/franchise/favorite/list" class="depth2">즐겨찾기 상품 관리</router-link></li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <a class="label">발주 및 교환 관리</a>
          <div class="submenu_box" style="height: 200px">
            <ul class="submenu">
              <li>
                <a class="depth1" style="cursor: default"><h4 id="depth1_title">발주 관리</h4></a>
                <ul class="submenu_sub">
                  <li><router-link to="/franchise/order/list" class="depth2">발주내역 조회 및 관리</router-link></li>
                </ul>
                <hr class="hr3" />
              </li>
              <li>
                <a class="depth1" style="cursor: default"><h4 id="depth1_title">교환/반품 관리</h4></a>
                <ul class="submenu_sub">
                  <li><router-link to="/franchise/exchange/list" class="depth2">교환/반품 관리</router-link></li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <a class="label">공지 및 문의 관리</a>
          <div class="submenu_box" style="height: 200px">
            <ul class="submenu">
              <li>
                <a class="depth1" style="cursor: default"><h4 id="depth1_title">공지사항</h4></a>
                <ul class="submenu_sub">
                  <li><router-link to="/franchise/notice/list" class="depth2">공지사항 목록</router-link></li>
                </ul>
                <hr class="hr3" />
              </li>
              <li>
                <a class="depth1" style="cursor: default"><h4 id="depth1_title">문의사항 관리</h4></a>
                <ul class="submenu_sub">
                  <li><router-link to="/franchise/ask/list" class="depth2">문의사항 관리 및 조회</router-link></li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import FranchiseInfoPopup from '@/components/franchise/member/FranchiseInfoPopup.vue';

const store = useStore();
const accessToken = store.state.accessToken;
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
    const response = await fetch('http://api.pioms.shop/franchise/pdfdownload/frowner-pdf', {
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
  isModalOpen.value = true;
  store.commit('setModalOpen', true); // 모달 열기 상태를 Vuex에 저장
};

const closeModal = () => {
  isModalOpen.value = false;
  store.commit('setModalOpen', false); // 모달 닫기 상태를 Vuex에 저장
};

watch(() => store.state.isModalOpen, (newValue) => {
  isModalOpen.value = newValue;
});

onMounted(() => {
  store.dispatch('initializeAuth');
  fetchUsernameFromToken();

  const labels = document.querySelectorAll('.label');

  labels.forEach(label => {
    const submenu = label.nextElementSibling;

    label.addEventListener('mouseenter', () => {
      if (submenu) {
        submenu.style.display = 'block';
      }
    });

    label.addEventListener('mouseleave', () => {
      if (submenu) {
        submenu.style.display = 'none';
      }
    });

    if (submenu) {
      submenu.addEventListener('mouseenter', () => {
        submenu.style.display = 'block';
      });

      submenu.addEventListener('mouseleave', () => {
        submenu.style.display = 'none';
      });
    }
  });
});
</script>

<style scoped>
.fb__header-info {
  position: relative;
  z-index: 4;
  height: 50px;
  background: #FFFFFF;
  border-bottom: solid black 1px;
}

.fb__header-logo {
  display: inline-block;
  width: 180px;
  height: 30px;
  vertical-align: middle;
  background: url('@/assets/icon/PIOMS_로고.png') no-repeat 0 0 / 30% auto;
  text-indent: -9999px;
}
.fb__header-title {
  position: absolute;
  top: 11px;
  left: 26px;
  margin: 0;
  color: #fff;
  font-size: 17px;
}

.fb__header__my-relation relation {
  position: absolute;
  top: 0;
  right: 0;
}
.relation__name {
  display: block;
  float: left;
  color: #fff;
  font-size: 12px;
  line-height: 50px;
}

.fb__header .relation__btn {
  position: relative;
  display: inline-block;
  line-height: 50px;
}
.fb__header .relation__name, .fb__header .relation a {
  display: block;
  float: left;
  color: #fff;
  font-size: 12px;
  line-height: 50px;
}

.fb__header .relation__search, .fb__header .relation__favorites {
  float: left;
  position: relative;
}
div {
  display: block;
  unicode-bidi: isolate;
}
.fb__header .relation__btn {
  position: relative;
  display: inline-block;
  line-height: 50px;
}
.fb__header__my-relation {
  position: absolute;
  top: 0;
  right: 0;
}
a {
  color: #000;
  text-decoration: none;
}
h1, h2, h3, h4 {
  margin: 0;
  font-size: 14px;
}
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
div {
  display: block;
  unicode-bidi: isolate;
}
a {
  background-color: transparent;
}


.fb__header .relation__name, .fb__header .relation a {
  display: block;
  float: left;
  color: #fff;
  font-size: 12px;
  line-height: 50px;
}

.fb__header .relation__btn--log, .fb__header .relation__btn--mypage {
  margin-left: 20px;
}

.relation__btn--log adm-manual {
  display: block;
  float: left;
  color: #fff;
  font-size: 12px;
  line-height: 50px;
}

.fb__header .relation__name, .fb__header .relation a {
  display: block;
  float: left;
  color: #fff;
  font-size: 12px;
  line-height: 50px;
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
.header_info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
}

.header_info .crown,
.header_info .dictionary,
.header_info > div:last-child {
  display: flex;
  align-items: center;
}

.header_info .dictionary_icon {
  margin-right: 5px;
}

.header_info .cta {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.header_info .cta svg {
  margin-left: 5px;
}

.logo {
  width: 100px;
  height: 50px;
  position: relative;
  left: 7px;
  cursor: pointer;
}
.crown {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 50px;
}
.crown_icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
}
.admin_icon {
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
  left: -5px;
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

.navigation-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

hr.hr1, hr.hr2 {
  padding: 0;
  width: 100%;
  border: 0;
  height: 0;
  border-top: 0.5px solid #B9B9B9;
  position: relative;
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
  top: 100px;
}

.label {
  width: 180px;
  height: 9px;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #444444;
  line-height: 10px;
  display: inline; /* 리스트 아이템을 인라인으로 표시 */
  position: relative;
  top: -4px;
  cursor: pointer;
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
  gap: 80px;
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex; /* 수평으로 맞추기 */
}

.nav_header > li {
  position: relative;
}
.label:hover {
  position: relative;
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
}
.dashboard {
  width: 18px;
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
  /*top: 10px;*/
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

.submenu .depth1 li a {
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

.submenu_box {
  display: none;
  position: relative;
  bottom: 3px;
  margin: 0;
  border-radius: 7px;
  border: 1px solid #B9B9B9;
  background-color: #fff;
  width: 220px;
  z-index: 9999;
}

.submenu_box {
  height: 320px;
}
.submenu_box1 {
  height: 250px;
}
.submenu_box2 {
  height: 300px;
}
.submenu_box3 {
  height: 200px;
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

/* :hover 상태를 이용해 서브메뉴 박스 표시 */
.label:hover + .submenu_box,
.submenu_box:hover,
.label:hover + .submenu .submenu_box:hover {
  display: block;
}
/* .show 클래스가 추가되면 하위 메뉴 표시 */
.show {
  display: block;
}

.fb__header-btn {
  position: relative;
  background: #FFFFFF;
  height: 48px;
  border-bottom: solid black 1px;

}
.fb__header .main-nav {
  position: relative;
}
nav {
  display: block;
  unicode-bidi: isolate;
}
ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
  unicode-bidi: isolate;
}
</style>
