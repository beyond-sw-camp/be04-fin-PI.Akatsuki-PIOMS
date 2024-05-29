<template>
  <h2>공지사항 등록</h2>
  <form @submit.prevent="submitNotice">
    <div>
      <label for="noticeTitle">제목</label>
      <input type="text" id="noticeTitle" v-model="newNotice.noticeTitle" required />
    </div>
    <div>
      <label for="noticeContent">내용</label>
      <textarea id="noticeContent" v-model="newNotice.noticeContent" required></textarea>
    </div>
    <button type="submit">등록</button>
    <button type="button" @click="toggleForm">취소</button>
  </form>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>