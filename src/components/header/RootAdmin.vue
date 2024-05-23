<script setup>
document.querySelectorAll('.nav_header > li').forEach(item => {
  item.addEventListener('mouseover', () => {
    let submenu = item.querySelector('.submenu');
    if (submenu) {
      submenu.style.display = 'block';
    }
  });
  item.addEventListener('mouseout', (event) => {
    let submenu = item.querySelector('.submenu');
    if (submenu && !submenu.contains(event.relatedTarget)) {
      submenu.style.display = 'none';
    }
    ;
  });
});

document.querySelectorAll('.submenu > li').forEach(item => {
  item.addEventListener('mouseover', () => {
    let submenuSub = item.querySelector('.submenu_sub');
    if (submenuSub) {
      submenuSub.style.display = 'block';
    }
  });
  item.addEventListener('mouseout', (event) => {
    let submenuSub = item.querySelector('.submenu_sub');
    if (submenuSub && !submenuSub.contains(event.relatedTarget)) {
      submenuSub.style.display = 'none';
    }
    ;
  });
});
</script>

<template>
  <!-- root 관리자 header -->
  <header class="header">
    <img class="logo" src="/PIOMS_image/png/PIOMS_로고.png" alt="Logo"/>
    <section class="header_info">
      <div class="crown">
        <img class="crown_icon" src="/PIOMS_image/png/root/Crown.png" alt="Crown"/>
        <h5><u>Akatsuki</u>님 정보</h5>
      </div>
      <div class="dictionary">
        <img class="dictionary_icon" src="/PIOMS_image/png/root/Dictionary.png" alt="Dictionary"/>
        <h5>관리자 메뉴얼</h5>
      </div>
      <div>
        <button class="cta">
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

  <!-- 카테고리 nav -->
  <nav class="header_rootAdmin">
    <ul class="nav_header">
      <li><a href="#" class="dashboard" style="display: flex;"><img src="/PIOMS_image/png/root/dashboard.png"></a></li>

      <li><a href="#" class="label">가맹점 및 직원 관리</a>
        <ul class="submenu">
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">가맹점 및 점주 관리</h4></a>
            <ul class="submenu_sub">

              <li><a href="#" class="depth2">가맹점 및 점주 전체조회</a></li>
              <li><a href="#" class="depth2">가맹점 관리</a></li>
              <li><a href="#" class="depth2">점주 관리</a></li>
              <hr>
            </ul>
          </li>
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">배송기사 관리</h4></a>
            <ul class="submenu_sub">

              <li><a href="#" class="depth2">배송기사 전체조회</a></li>
              <li><a href="#" class="depth2">배송기사 관리</a></li>
            </ul>
          </li>
        </ul>
      </li>

      <li><a href="#" class="label">상품 및 상품 카테고리 관리</a>
        <ul class="submenu">
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">상품 관리</h4></a>
            <ul class="submenu_sub">
              <li><a href="#" class="depth2">상품 전체조회 및 관리</a></li>
              <hr>
            </ul>
          </li>
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">상품 카테고리 관리</h4></a>
            <ul class="submenu_sub">
              <li><a href="#" class="depth2">상품 카테고리 전체조회</a></li>
              <li><a href="#" class="depth2">상품 카테고리 등록 관리</a></li>
            </ul>
          </li>
        </ul>
      </li>

      <li><a href="#" class="label">배송 및 발주 관리</a>
        <ul class="submenu">
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">배송 관리</h4></a>
            <ul class="submenu_sub">

              <li><a href="#" class="depth2">배송상태 조회 및 관리</a></li>
              <hr>
            </ul>
          </li>
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">발주 관리</h4></a>
            <ul class="submenu_sub">
              <li><a href="#" class="depth2">발주 목록 조회 및 승인</a></li>
              <li><a href="#" class="depth2">명세서 조회</a></li>
            </ul>
          </li>
        </ul>
      </li>

      <li><a href="#" class="label">반품 및 교환 관리</a>
        <ul class="submenu">
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">반품 및 교환 상태 관리</h4></a>
            <ul class="submenu_sub">
              <li><a href="#" class="depth2">반품 및 교환 상태 처리</a></li>
              <hr>
            </ul>
          </li>
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">반품 관리</h4></a>
            <ul class="submenu_sub">
              <li><a href="#" class="depth2">반품 상품 조회</a></li>
              <hr>
            </ul>
          </li>
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">교환 관리</h4></a>
            <ul class="submenu_sub">
              <li><a href="#" class="depth2">교환 상품 조회</a></li>
            </ul>
          </li>
        </ul>
      </li>

      <li><a href="#" class="label">공지 및 문의 관리</a>
        <ul class="submenu">
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">공지 관리</h4></a>
            <ul class="submenu_sub">
              <li><a href="#" class="depth2">공지사항 조회 및 관리</a></li>
              <hr>
            </ul>
          </li>
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">문의 관리</h4></a>
            <ul class="submenu_sub">
              <li><a href="#" class="depth2">문의사항 조회 및 관리</a></li>
            </ul>
          </li>
        </ul>
      </li>

      <li><a href="#" class="label">통계 및 이력 관리</a>
        <ul class="submenu">
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">통계 관리</h4></a>
            <ul class="submenu_sub">
              <li><a href="#" class="depth2"> 전체 통계 관리</a></li>
              <hr>
            </ul>
          </li>
          <li>
            <a href="#" class="depth1"><h4 id="depth1_title">이력 관리</h4></a>
            <ul class="submenu_sub">
              <li><a href="#" class="depth2"> 전체 이력 관리</a></li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
  <hr class="hr2"/>

  <!-- 사이드바 -->
  <article id="sidebar">
    <section class="sidebar_content">
      <div class="sidebar_title_Box">
        <img class="sider_dashBoard" src="/PIOMS_image/png/root/dashboard.png">
        <h2 class="sidebar_title">Dash Board</h2>
      </div>
    </section>
  </article>

  <!-- footer -->
  <footer class="footer">
    <p class="footer_text">
      회사명: PIOMS 솔루션 | 대표명: 김용승 | 사업자등록번호: 478-34-23344 | 주소: 서울특별시 동작구 보라매로 87, 3~5층 플레이데이터 © FORBIZKOREA x NAVER Cloud
      CO.LTD. All Rights Reserved.
    </p>
  </footer>
</template>

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

.crown {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 50px;
}

.crown_icon {
  width: 18px;
  height: 15px;
  margin-right: 2px;
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
  width: 99%;
  border: 0;
  height: 0;
  border-top: 0.5px solid #6C6C6C;
}

hr.hr2 {
  padding: 0;
  width: 99%;
  height: 0;
  border-top: 0.5px solid #6C6C6C;
  margin: 25px;
  position: relative;
  right: 15px;
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

.nav_header {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex; /* 수평으로 맞추기 */
  justify-content: space-between;
}

.label {
  width: 100%;
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

.nav_header li a:hover {
  background-color: #D9D9D9;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav_header li a {
  display: inline;
  color: #444444;
  margin-right: 60px;
  text-align: center;
  padding: 10px 20px;
  text-decoration: none;
}

.dashboard {
  width: 20px;
  height: 18px; /* 아이콘 크기 조정 */
  vertical-align: middle;
  position: relative;
  top: -10px;
  right: 3px;
}

.sidebar_title_Box {
  align-items: left;
  position: relative;
  top: 10px;
  left: 10px;
  width: 130px;
  height: 75px;
  border: 1px solid #D9D9D9;
  border-radius: 10px;
  background-color: #D9D9D9;
  color: #444444;
  padding-top: 20px;
  padding-left: 20px;
}

.sider_dashBoard {
  width: 25px;
  height: 23px; /* 아이콘 크기 조정 */
  vertical-align: middle;
  position: relative;
  left: 40px;
}

.sidebar_title {
  margin-top: 15px;
  margin-bottom: 10px;
  margin-right: 12px;
  font-size: 23px;
  font-weight: bold;
}

.sidebar_content, #sidebar {
  width: 200px;
  height: 700px;
}

/* footer css */
.footer {
  width: 100%;
  height: 30px;
  position: fixed;
  bottom: 10px;
  left: 0;
  padding: 10px 20px; /* 상하 좌우 여백 */
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1); /* 약간의 그림자 효과 */
  display: flex;
  justify-content: flex-end;
}

.footer_text {
  font-size: 12px;
  color: #B9B9B9;
  position: relative;
  right: 400px;
  top: 10px;
  display: inline-flex;
  text-align: right;
}

/* 여기서부터 헤더 카테고리 css */

.submenu {
  display: flex;
  position: relative;
  width: 10px;
  height: 200px;
  left: 0;
  z-index: 4;
  width: calc(100% + 80px);
  width: calc(100% + 80px);
}

.submenu, .submenu_sub {
  position: absolute;
  display: none;
  list-style: none;
  padding-left: 20px;
  margin: 0;
  width: 180px;
  height: inherit;
  z-index: 1000;
}

.submenu li a, .submenu_sub li a {
  display: block;
  padding: 8px 15px;
  text-decoration: none;
  color: #666;
}

.nav_header > li:hover > .submenu,
.submenu li:hover > .submenu_sub {
  /* display: block; 부모 요소에 커서가 올려지면 서브메뉴 표시 */
  position: relative;
}

.depth1 {
  display: block;
  width: 150px;
  height: 25px;
  line-height: 38px;
  background: #394CA9;
  border-radius: 15px;
  padding: 20px;
}

.depth1:hover {
  background-color: #e8e8e8;
  color: #394CA9;
  border-radius: 15px;
  transition: all 0.5s ease;
  margin: 0px 80px 0px 0px;
  z-index: 10;
}

#depth1_title {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  position: relative;
  bottom: 25px;
}

hr {
  width: 90%;
  border: 0.1px solid #D9D9D9;
}

.depth2 {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  line-height: 30px;
  padding: 15px;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.5s ease;
  width: 150px; /* 원하는 너비로 설정 */
  white-space: nowrap; /* 텍스트가 한 줄로 유지되도록 설정 */
  text-overflow: inherit;
}

.depth2:hover {
  background-color: transparent; /* 기존 배경색 제거 */
  color: #394CA9;
  border-radius: 15px;
  transition: all 0.5s ease;
}
</style>