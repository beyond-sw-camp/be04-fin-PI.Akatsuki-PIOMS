<template>
  <!-- root 관리자 header -->
  <header class="header">
<!--    <img class="logo" src="@/assets/icon/PIOMS_로고.png" alt="Logo"/>-->
    <section class="header_info">
      <div class="crown">
<!--        <img class="crown_icon" src="@/assets/icon/root/Crown.png" alt="Crown"/>-->
        <h5><u>Akatsuki</u>님 정보</h5>
      </div>
      <div class="dictionary">
<!--        <img class="dictionary_icon" src="@/assets/icon/Dictionary.png" alt="Dictionary"/>-->
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

  <!-- 카테고리 -->
  <nav class="header_rootAdmin">
    <ul class="nav_header">
<!--      <li><a href="#" class="dashboard" style= "display: flex;"><img src="@/assets/icon/dashboard.png"></a></li>-->

      <li><a href="#" class="label">가맹점 및 직원 관리</a>
        <container class="submenu_box">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">가맹점 및 점주 관리</h4></a>
              <ul class="submenu_sub">

                <li><a href="#" class="depth2">가맹점 및 점주 전체조회</a></li>
                <li><a href="#" class="depth2">가맹점 관리</a></li>
                <li><a href="#" class="depth2">점주 관리</a></li>
              </ul>
              <hr class="hr3">
            </li>
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">배송기사 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2">배송기사 전체조회</a></li>
                <li><a href="#" class="depth2">배송기사 관리</a></li>
              </ul>
            </li>
          </ul>
        </container>
      </li>

      <li><a href="#" class="label">상품 및 상품 카테고리 관리</a>
        <container class="submenu_box1">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">상품 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2">상품 전체조회 및 관리</a></li>
              </ul>
              <hr class="hr3">
            </li>
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">상품 카테고리 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2">상품 카테고리 전체조회</a></li>
                <li><a href="#" class="depth2">상품 카테고리 등록 관리</a></li>
              </ul>
            </li>
          </ul>
        </container>
      </li>

      <li><a href="#" class="label">배송 및 발주 관리</a>
        <container class="submenu_box1">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">배송 관리</h4></a>
              <ul class="submenu_sub">

                <li><a href="#" class="depth2">배송상태 조회 및 관리</a></li>
              </ul>
              <hr class="hr3">
            </li>
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">발주 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2">발주 목록 조회 및 승인</a></li>
                <li><a href="#" class="depth2">명세서 조회</a></li>
              </ul>
            </li>
          </ul>
        </container>
      </li>

      <li><a href="#" class="label">반품 및 교환 관리</a>
        <container class="submenu_box2">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">반품 및 교환 상태 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2">반품 및 교환 상태 처리</a></li>
              </ul>
              <hr class="hr3">
            </li>
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">반품 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2">반품 상품 조회</a></li>
              </ul>
              <hr class="hr3">
            </li>
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">교환 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2">교환 상품 조회</a></li>
              </ul>
            </li>
          </ul>
        </container>
      </li>

      <li><a href="#" class="label">공지 및 문의 관리</a>
        <container class="submenu_box3">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">공지 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2">공지사항 조회 및 관리</a></li>
              </ul>
              <hr class="hr3">
            </li>
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">문의 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2">문의사항 조회 및 관리</a></li>
              </ul>
            </li>
          </ul>
        </container>
      </li>

      <li><a href="#" class="label">통계 및 이력 관리</a>
        <container class="submenu_box3">
          <ul class="submenu">
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">통계 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2"> 전체 통계 관리</a></li>
              </ul>
              <hr class="hr3">
            </li>
            <li>
              <a href="#" class="depth1"><h4 id="depth1_title">이력 관리</h4></a>
              <ul class="submenu_sub">
                <li><a href="#" class="depth2"> 전체 이력 관리</a></li>
              </ul>
            </li>
          </ul>
        </container>
      </li>
    </ul>
  </nav>
  <hr class="hr2"/>

</template>

<script setup>


  document.addEventListener('DOMContentLoaded', function() {
  // 모든 .label 요소를 선택합니다.
  var labels = document.querySelectorAll('.label');

  // 타이머를 위한 변수
  var hideTimeout;

  // 각 .label 요소에 이벤트 리스너를 추가합니다.
  labels.forEach(function(label) {
  var submenu = label.nextElementSibling;
  label.addEventListener('mouseenter', function() {
  clearTimeout(hideTimeout);
  // 하위 메뉴를 표시합니다.
  if (submenu) {
  submenu.style.display = 'block';
  }
  });

    label.addEventListener('mouseleave', function() {
    // 마우스가 .submenu_box 안으로 이동할 때 타이머를 해제합니다.
    submenu.addEventListener('mouseenter', function() {
    clearTimeout(hideTimeout);
  });

    // 일정 시간이 지난 후 하위 메뉴를 숨깁니다.
    hideTimeout = setTimeout(function() {
    if (submenu) {
    submenu.style.display = 'none';
  }
  }, 100);
  });

    submenu.addEventListener('mouseleave', function() {
    // 마우스가 .label 안으로 이동할 때 타이머를 해제합니다.
    label.addEventListener('mouseenter', function() {
    clearTimeout(hideTimeout);
  });

    // 일정 시간이 지난 후 하위 메뉴를 숨깁니다.
    hideTimeout = setTimeout(function() {
    if (submenu) {
    submenu.style.display = 'none';
  }
  }, 100);
  });
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
    border-top: 0.5px solid #B9B9B9;
  }

  hr.hr2 {
    padding: 0;
    width: 99%;
    height: 0;
    border-top: 0.5px solid #B9B9B9;
    margin: 25px;
    position: relative;
    right: 15px;
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
    z-index: 10000;
  }
  .submenu_box{
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
  /* .show 클래스가 추가되면 하위 메뉴 표시 */
  .show {
    display: block;
  }
  </style>
