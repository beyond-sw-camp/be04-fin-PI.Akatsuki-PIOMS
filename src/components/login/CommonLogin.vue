<template>
  <div class="login-container">
    <div class="logo">
      <span><img src="@/assets/icon/PIOMS_로고.png" alt="PIOMS Logo"></span>
    </div>
    <div class="cards">
      <div class="card red" @click="changeRouter('admin/login')">
        <p class="tip">Admin</p>
        <p class="second-text">Login</p>
      </div>
      <div class="card blue" @click="changeRouter('franchise/login')">
        <p class="tip">Franchise</p>
        <p class="second-text">Login</p>
      </div>
      <div class="card yellow" @click="changeRouter('delivery/login')">
        <p class="tip">Delivery</p>
        <p class="second-text">Login</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const changeRouter = (route) => {
  router.push(route);
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.logo {
  display: flex;
  font-size: 2rem;
  margin-bottom: 20px;
}

.logo span {
  display: inline-block;
  margin: 0 5px;
}

.logo .icon {
  font-size: 2rem;
  margin: 0 5px;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cards .red {
  background-color: #FC6F86;
}

.cards .blue {
  background-color: #394CA9;
}

.cards .yellow {
  background-color: #FFCD4B;
}

.cards .card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 100px;
  width: 250px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: 400ms;
}

.cards .card p.tip {
  font-size: 1em;
  font-weight: 700;
}

.cards .card p.second-text {
  font-size: .7em;
}

.cards .card:hover {
  transform: scale(1.1, 1.1);
}

.cards:hover > .card:not(:hover) {
  filter: blur(10px);
  transform: scale(0.9, 0.9);
}
</style>
