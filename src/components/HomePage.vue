<template>
  <div class="container">
    <header class="status-bar">
      <div class="header-left">
        <button @click="toggleSidebar" class="toggle-sidebar-btn">≡</button>
        <div class="logo" style="cursor: pointer;user-select: none" @click="goToHomePage">Intelli Home</div>
      </div>
      <div class="date-info">
        {{ t('weatherNow') }}：
        <i :class="iconId" @click="updateWeather" style="cursor: pointer" :title="t('updateWeather')"></i>
        {{ weather }} | {{ t('time') }}：{{ currentDate }}
        <button @click="handleLogout" class="logout-button">{{ t('logout') }}</button>
      </div>
    </header>

    <div class="content-wrapper">
      <transition name="slide">
        <aside class="sidebar" v-if="isSidebarVisible">
          <ul class="menu-functions">
            <li>
              <router-link to="/home/overview" active-class="active-link"><span
                  class="sidebar-text">{{ t('overview') }}</span></router-link>
            </li>
            <li>
              <router-link to="/home/scene" active-class="active-link"><span
                  class="sidebar-text">{{ t('scene') }}</span></router-link>
            </li>
            <li>
              <router-link to="/home/device" active-class="active-link"><span
                  class="sidebar-text">{{ t('device') }}</span></router-link>
            </li>
          </ul>
          <div class="user-info-section">
            <hr class="menu-divider"/>
            <ul class="menu-options">
              <li>
                <router-link to="/home/profile" active-class="active-link"><span
                    class="sidebar-text">{{ t('profile') }}</span></router-link>
              </li>
              <li>
                <router-link to="/home/setting" active-class="active-link"><span
                    class="sidebar-text">{{ t('setting') }}</span></router-link>
              </li>
            </ul>
            <div class="user-info">
              <img src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="user"
                   style="height: 40px; border-radius: 50%; margin-right: 5px">
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
import {ref, onMounted, provide} from 'vue';
import {useRouter} from 'vue-router';
import {getCityId, getWeatherNow} from "../js/GetWeather";
import axios from "axios";
import 'qweather-icons/font/qweather-icons.css'
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const currentUser = ref(localStorage.getItem('username'));
const currentDate = ref('');
const weather = ref('');
const weatherIcon = ref('100');
const isSidebarVisible = ref(true);
const router = useRouter();
let iconId = '';

// 处理登出
const handleLogout = () => {
  localStorage.removeItem('token');
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
  weather.value = t('sunny') + ' 25°C';
  // const cityId = await getCityId('成都');
  // const weatherNow = await getWeatherNow(cityId);
  // weather.value = `${weatherNow.weather} ${weatherNow.temp}°C`;
  // weatherIcon.value = `${weatherNow.icon}`;
  iconId = "qi-" + weatherIcon.value;
};

provide('updateWeather', updateWeather);

// 组件挂载时执行
onMounted(async () => {
  try {
    await axios.get(`/api/auth`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    });
  } catch (error) {
    alert(t('loginOut'));
    handleLogout();
    return;
  }
  await updateWeather();
  updateDate();
  setInterval(updateDate, 1000);
});
</script>

<style scoped>
@import "../css/home.css";
</style>