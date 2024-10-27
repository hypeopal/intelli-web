<template>
  <div class="container">
    <header class="status-bar">
      <div class="header-left">
        <button @click="toggleSidebar" class="toggle-sidebar-btn">≡</button>
        <div class="logo" style="cursor: pointer;user-select: none" @click="goToHomePage">Intelli Home</div>
      </div>
      <div class="date-info">
        当前天气：
        <i :class="iconId" @click="updateWeather" style="cursor: pointer" title="刷新天气"></i>
        {{ weather }} | 当前时间：{{ currentDate }}
        <button @click="handleLogout" class="logout-button">登出</button>
      </div>
    </header>

    <div class="content-wrapper">
      <transition name="slide">
        <aside class="sidebar" v-if="isSidebarVisible">
          <ul class="menu-functions">
            <li>
              <router-link to="/home/overview" active-class="active-link"><span class="sidebar-text">概览</span></router-link>
            </li>
            <li>
              <router-link to="/home/scene" active-class="active-link"><span class="sidebar-text">场景</span></router-link>
            </li>
            <li>
              <router-link to="/home/device" active-class="active-link"><span class="sidebar-text">设备</span></router-link>
            </li>
          </ul>
          <div class="user-info-section">
            <hr class="menu-divider" />
            <ul class="menu-options">
              <li><router-link to="/home/profile" active-class="active-link"><span class="sidebar-text">个人中心</span></router-link></li>
              <li><router-link to="/home/setting" active-class="active-link"><span class="sidebar-text">设置</span></router-link></li>
            </ul>
            <div class="user-info">
              <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="user" style="height: 40px; border-radius: 50%; margin-right: 5px">
              {{ currentUser }}
            </div>
          </div>
        </aside>
      </transition>
        <main class="main-content">
          <router-view/>
        </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getCityId, getWeatherNow } from "../js/GetWeather";
import axios from "axios";
import { serverAddress } from "../../global";
import 'qweather-icons/font/qweather-icons.css'

const currentUser = ref(localStorage.getItem('username'));
const currentDate = ref('');
const weather = ref('晴 25°C');
const weatherIcon = ref('100');
const isSidebarVisible = ref(true);
const router = useRouter();
let iconId = '';

// 处理登出
const handleLogout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  router.push('/auth/login');
};

// 更新日期
const updateDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const hh = String(today.getHours()).padStart(2, '0');
  const min = String(today.getMinutes()).padStart(2, '0');
  const ss = String(today.getSeconds()).padStart(2, '0');
  currentDate.value = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

// 导航到主页
const goToHomePage = () => {
  router.push('/');
};

// 切换侧边栏显示
const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

// 更新天气
const updateWeather = async () => {
  // const cityId = await getCityId('成都');
  // const weatherNow = await getWeatherNow(cityId);
  // weather.value = `${weatherNow.weather} ${weatherNow.temp}°C`;
  // weatherIcon.value = `${weatherNow.icon}`;
  iconId = "qi-" + weatherIcon.value;
};

// 组件挂载时执行
onMounted(async () => {
  try {
    await axios.get(`${serverAddress}/api/auth`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    });
    await updateWeather();
  } catch (error) {
    alert("登录过期，请重新登录");
    handleLogout();
    return;
  }

  updateDate();
  setInterval(updateDate, 1000);
});
</script>

<style scoped>
@import "../css/home.css";
</style>