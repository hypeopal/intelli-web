<template>
  <div class="overview">
    <div style="text-align: center;user-select: none;">
      <h1>{{ t('overview') }}</h1>
    </div>
    <div class="overview-display">
      <weather-chart class="cart"/>
      <div class="cart">
        <strong style="margin: 5px 10px 5px;font-size: 20px;">{{ t('house') }}</strong>
        <div v-if="houseMessage" class="message">{{ houseMessage }}</div>
        <el-scrollbar style="height: 80%;">
          <div style="display: flex;flex-wrap: wrap;gap: 10px;padding:20px;">
            <button v-for="house in houses" :key="house.house_id" class="display-item" @click="openHouse(house.house_id)">
              <i class="i-house" style="margin-right: 10px;"></i>
              {{ house.house_name }}
            </button>
          </div>
        </el-scrollbar>
      </div>
      <div class="cart">
        <strong style="margin: 5px 10px 5px;font-size: 20px;">{{ t('myFavorite') }}</strong>
        <div v-if="favoriteMessage" class="message">{{ favoriteMessage }}</div>
        <el-scrollbar style="height: 80%;">
          <div style="display: flex;flex-wrap: wrap;gap: 10px;padding: 20px;">
            <button v-for="device in favorites" :key="device.device_id" class="display-item" @click="openDevice(device.device_id)">
              <i :class="`di-${device.device_type.type_name}-32`" style="margin-right: 10px;"></i>
              {{ device.house_name }}
            </button>
          </div>
        </el-scrollbar>
      </div>
      <div class="cart">
        789
        <button @click="showModal=true">123</button>
      </div>
      <el-dialog v-model="showModal" width="900" align-center>
        <template #header>直播</template>
        <video-player v-if="showModal" :videoUrl="`http://47.108.27.238:8888/mystream/index.m3u8`"/>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import WeatherChart from "../components/WeatherChart.vue";
import {useI18n} from "vue-i18n";
import api from "../js/request.js";
import '../assets/icon/icon.css';
import {useRouter} from "vue-router";
import VideoPlayer from "./control/VideoPlayer.vue";

const {t} = useI18n();
const router = useRouter();

const houses = ref([]);
const favorites = ref([]);
const houseMessage = ref('');
const favoriteMessage = ref('');
const showModal = ref(false);

const openHouse = (houseId) => {
  router.push({path: '/home/device', query: {houseId: houseId}});
};
const openDevice = (deviceId) => {
  router.push({path: '/home/device', query: {deviceId: deviceId}});
};
const getInfo = (type) => {
  return api
      .get(`/api/my/${type}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return { data: [] };
      });
};
onMounted(async () => {
  try {
    const [housesData, favoritesData] = await Promise.all([
      getInfo('house'),
      getInfo('favorite'),
    ]);
    houses.value = housesData.data;
    houseMessage.value = houses.value.length === 0 ? t('noHome') : '';
    favorites.value = favoritesData.data;
    favoriteMessage.value = favorites.value.length === 0 ? t('noFavorite') : '';
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped>
@import "../css/overview.css";
.message {
  text-align: center;
  vertical-align: center;
  margin-top: 25%;
}
</style>
