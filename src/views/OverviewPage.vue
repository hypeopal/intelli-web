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
              <i class="i-house"></i>
              <div style="margin-left: 10px;">{{ house.house_name }}</div>
            </button>
          </div>
        </el-scrollbar>
      </div>
      <div class="cart">
        <strong style="margin: 5px 10px 5px;font-size: 20px;">{{ t('myFavorite') }}</strong>
        <div v-if="favoriteMessage" class="message">{{ favoriteMessage }}</div>
        <el-scrollbar style="height: 80%;">
          <div style="display: flex;flex-wrap: wrap;gap: 10px;padding: 20px;">
            <div v-for="device in favorites" :key="device.device_id" class="display-item" @click="">
              <i :class="`di-${device.device_type.type_name}-32`"></i>
              <div style="margin-left: 10px;">{{ device.house_name }}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="cart">
        789
      </div>
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

const {t} = useI18n();
const router = useRouter();

const houses = ref([]);
const favorites = ref([]);
const houseMessage = ref('');
const favoriteMessage = ref('');

const openHouse = (houseId) => {
  router.push({path: '/home/device', query: {id: houseId}});
};
const getInfo = (type) => {
  return api
      .get(`/api/my/${type}`)
      .then((response) => {
        return response; // 返回成功的数据
      })
      .catch((error) => {
        return { data: [] }; // 返回空
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
