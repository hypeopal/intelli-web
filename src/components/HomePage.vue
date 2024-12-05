<template>
  <div class="container">
    <header class="status-bar">
      <div class="header-left">
        <button @click="toggleSidebar" class="toggle-sidebar-btn">≡</button>
        <div class="logo" style="cursor: pointer;user-select: none" @click="goToHomePage">Intelli Home</div>
      </div>
      <div class="date-info">
        <div v-if="weather" style="display: flex;flex-direction: row;align-items: center;">
          <div class="weather-tag">{{ t('weatherNow') }}：</div>
          <i :class="iconId" @click="updateWeather" style="cursor: pointer;margin-right: 5px;" :title="t('updateWeather')"></i>
          {{ weather }}
        </div>
        <div class="hide">
          {{ t('time') }}：{{ currentDate }}
        </div>
        <button @click="handleLogout" class="logout-button"><span>{{ t('logout') }}</span></button>
      </div>
    </header>

    <div class="content-wrapper">
      <transition name="slide">
        <aside class="sidebar" v-if="isSidebarVisible"
               :class="{ visible: isSidebarVisible, hidden: !isSidebarVisible }"
               @click.stop
        >
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
      <main class="main-content" @click="autoHideSidebar">
        <el-scrollbar max-height="84vh">
          <router-view/>
        </el-scrollbar>
      </main>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, provide, onUnmounted} from 'vue';
import {useRouter} from 'vue-router';
import {getCityId, getWeatherNow} from "../js/GetWeather";
import api from "../js/request.js";
import 'qweather-icons/font/qweather-icons.css'
import {useI18n} from "vue-i18n";
import {ElMessage} from "element-plus";

const {t} = useI18n();

const currentUser = ref(localStorage.getItem('username'));
const currentDate = ref('');
const weather = ref('');
const weatherIcon = ref('100');
const isSidebarVisible = ref(true);
const router = useRouter();
let iconId = '';
let today = new Date();
let lastRenderTime = 0;

// 处理登出
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('lastUpdate');
  localStorage.removeItem('username');
  localStorage.removeItem("device");
  localStorage.removeItem("cityId");
  router.push('/auth/login');
};

// 更新日期
const updateDate = (timestamp) => {
  if (timestamp - lastRenderTime >= 1000) {
    lastRenderTime = timestamp;
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const hh = String(today.getHours()).padStart(2, '0');
    const min = String(today.getMinutes()).padStart(2, '0');
    const ss = String(today.getSeconds()).padStart(2, '0');
    currentDate.value = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    today = new Date();
  }
  requestAnimationFrame(updateDate);
};

// 导航到主页
const goToHomePage = () => {
  router.push('/');
};

// 切换侧边栏显示
const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const autoHideSidebar = () => {
  if (window.innerWidth <= 768 && isSidebarVisible.value) {
    isSidebarVisible.value = false;
  }
}

// 更新天气
const updateWeather = async () => {
  const city = await getCity();
  if(city !== '') {
    const cityId = await getCityId(city);
    const weatherNow = await getWeatherNow(cityId);
    weather.value = `${weatherNow.weather} ${weatherNow.temp}°C |`;
    weatherIcon.value = `${weatherNow.icon}`;
    iconId = "qi-" + weatherIcon.value;
    ElMessage({
      message: t('updateSuccess'),
      type: 'success'
    });
  } else {
    weather.value = '';
    iconId = '';
    ElMessage({
      message: t('updateError'),
      type: 'error'
    });
  }
};

const getCity = async () => {
  try {
    const response = await api.get('/api/userinfo');
    return response.data.city;
  } catch (e) {
    return '';
  }
};
const handleResize = () => {
  isSidebarVisible.value = window.innerWidth > 768;
};

provide('updateWeather', updateWeather);
provide('handleLogout', handleLogout);

// 组件挂载时执行
onMounted(async () => {
  handleResize();
  try {
    await api.get('/api/auth');
  } catch (e) {
    alert(t('loginOut'));
    handleLogout();
    return;
  }
  requestAnimationFrame(updateDate);
  await updateWeather();
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
@import "../css/home.css";
</style>