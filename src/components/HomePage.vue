<template>
  <div class="container">
    <header class="status-bar">
      <div class="header-left">
        <button @click="toggleSidebar" class="toggle-sidebar-btn">≡</button>
        <div class="logo" style="cursor: pointer" @click="goToHomePage">Intelli Home</div>
      </div>
      <div class="date-info">
        当前天气：
<!--        <img :src="require(`qweather-icons/icons/${weatherIcon}.svg`)" alt="icon" @click="updateWeather" style="cursor: pointer" title="刷新天气"/>-->
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

<script>
//import {getCityId, getWeatherNow} from "../js/GetWeather";
//import axios from "axios";
//import {serverAddress} from "../../global";

export default {
  name: 'HomePage',
  data() {
    return {
      currentUser: localStorage.getItem('username'),
      currentDate: '',
      weather: '晴 25°C',
      weatherIcon: '100',
      isSidebarVisible: true,
    };
  },
  async created() {
    // try {
    //   await axios.get(serverAddress + 'api/auth', {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token'),
    //     }
    //   });
    // } catch (error) {
    //   alert("登录过期，请重新登录");
    //   this.handleLogout();
    // }
    this.updateWeather();
    this.updateDate();
    setInterval(this.updateDate, 1000);
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
      this.$router.push('/auth/login');
    },
    updateDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const hh = String(today.getHours()).padStart(2, '0');
      const min = String(today.getMinutes()).padStart(2, '0');
      const ss = String(today.getSeconds()).padStart(2, '0');
      this.currentDate = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    },
    goToHomePage() {
      this.$router.push('/');
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    updateWeather() {
      // const cityId = await getCityId('成都');
      // const weatherNow = await getWeatherNow(cityId);
      // this.weather = `${weatherNow.weather} ${weatherNow.temp}°C`;
      // this.weatherIcon = `${weatherNow.icon}`;
    }
  }
};
</script>

<style scoped>
@import "../css/home.css";
</style>