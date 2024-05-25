<template>
  <div>
    <h2>Franchise Login</h2>
    <form @submit.prevent="login">
      <label for="username">Username:</label>
      <input type="text" v-model="username" id="username">
      <label for="password">Password:</label>
      <input type="password" v-model="password" id="password">
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      // 로그인 로직
    },
  },
};
</script>
