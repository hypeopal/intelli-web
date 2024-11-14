<template>
  <div class="overview">
    <div>
      <h2>{{ t('overview') }}</h2>
    </div>
    <div class="overview-display">
      <weather-chart class="cart"/>
      <div class="cart">
        <strong style="margin: 5px 10px 5px;font-size: 20px;">{{ t('house') }}</strong>
        <el-scrollbar style="height: 80%;">
          <div style="display: flex;flex-wrap: wrap;gap: 10px;">
            <div v-for="house in houses" :key="house.house_id" class="house-item" @click="openHouse(house.house_id)">
              <i class="i-house"></i>
              <div style="margin-left: 10px;">{{ house.house_name }}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="cart">
        <strong style="margin: 5px 10px 5px;font-size: 20px;">{{ t('myFavorite') }}</strong>

      </div>
      <div class="cart">789</div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import WeatherChart from "../components/WeatherChart.vue";
import {useI18n} from "vue-i18n";
import axios from "axios";
import '../assets/icon/icon.css';
import {useRouter} from "vue-router";

const {t} = useI18n();
const router = useRouter();

const houses = ref([]);
const favorites = ref([]);

const getInfo = async (type) => {
  try {
    const response = await axios.get(`/api/my/${type}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
  }
};
const openHouse = (houseId) => {
  router.push({path: '/home/device', query: {id: houseId}});
};
onMounted(() => {
  getInfo('house').then(res => {
    houses.value = res.data;
  });
});
</script>

<style >
@import "../css/overview.css";
</style>
