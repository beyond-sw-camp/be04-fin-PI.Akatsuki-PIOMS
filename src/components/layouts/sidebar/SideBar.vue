<script setup>
// /* 경로에 따라 다른 사이드바 내용을 렌더링 */
//   export default {
//     computed: {
//       currentRoute() {
//         return this.$route.name;
//       }
//     }
//   };
</script>

<template>
  <!-- 사이드바 -->
  <article id="sidebar">
    <section class="sidebar_content">
      <div class="sidebar_title_Box">
        <img class="sidebar_dashBoard" src="@/assets/icon/dashboard.png"/>
        <h2 class="sidebar_title">Dash Board</h2>
      </div>
    </section>
  </article>
</template>

<style scoped>
#sidebar {
  display: flex;
}
  .sidebar_title_Box {
    position: sticky;
    left: 60px;
    width: 130px;
    height: 75px;
    border: 1px solid #D9D9D9;
    border-radius: 10px;
    background-color: #D9D9D9;
    color: #444444;
    padding-top: 20px;
    padding-left: 16px;
    z-index: 100;
  }
  .sidebar_dashBoard {
    width: 25px;
    height: 23px; /* 아이콘 크기 조정 */
    vertical-align: middle;
    position: relative;
    left: 45px;
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
    position: relative;
    bottom: 540px;
    left: 12px;
  }
</style>
