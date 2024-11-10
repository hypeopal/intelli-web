<template>
  <div ref="weatherChart" class="chart">
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getCityId, getTemp} from "../js/GetWeather";
import {GetChartOption} from "../js/ChartOption.js"
import * as echarts from 'echarts/core';
import {BarChart, LineChart} from 'echarts/charts';
import {
  DatasetComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components';
import {LabelLayout, UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import {useTheme} from "../js/UseTheme.js";
import axios from "axios";
import {useI18n} from "vue-i18n";

const {t} =useI18n();
const {theme} = useTheme();

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  ToolboxComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  DataZoomComponent,
]);

const HighestTemp = ref([24, 18, 19, 19, 24, 22, 23]);
const LowestTemp = ref([17, 15, 14, 13, 13, 14, 16]);
const DateList = ref([]);
const City = ref('');
const weatherChart = ref(null);
const message = ref('');

const generateDayList = () => {
  const today = new Date();
  return Array.from({length: 7}, (_, i) => {
    let futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);
    return futureDate.getDate();
  });
};

const initChart = async () => {
  DateList.value = generateDayList();
  try {
    if ((new Date().getTime()) - parseInt(localStorage.getItem('lastUpdate')) < 3600000) { //距上次登录不到一小时，不刷新气温
      HighestTemp.value = JSON.parse(localStorage.getItem('highTemp')) || HighestTemp.value;
      LowestTemp.value = JSON.parse(localStorage.getItem('lowTemp')) || LowestTemp.value;
    } else {
      const cityId = await getCityId(City.value);
      const tempList = await getTemp(cityId);
      HighestTemp.value = tempList.map(day => day[0]);
      LowestTemp.value = tempList.map(day => day[1]);

      localStorage.setItem('highTemp', JSON.stringify(HighestTemp.value)); //缓存气温
      localStorage.setItem('lowTemp', JSON.stringify(LowestTemp.value));
      localStorage.setItem("lastUpdate", JSON.stringify(new Date().getTime()));
    }
  } catch (e) {
    console.log(e)
  }

  const chart = echarts.init(weatherChart.value, theme.value);
  let option = GetChartOption(City.value, DateList.value, HighestTemp.value, LowestTemp.value)
  chart.setOption(option);

  window.addEventListener('resize', () => {
    chart.resize();
  });
};

const getCity = async () => {
  try {
    const response = await axios.get('/api/userinfo', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    City.value = response.data.data.city;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await getCity();
  if (City.value !== '') {
    await initChart();
  } else {
    message.value = t('noCity');
  }
});
</script>

<style scoped>
.chart {
  width: 30%;
  height: 240px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 10px 10px 0;
  margin-top: 5px;
}
.message {
  color: red;
  text-align: center;
  vertical-align: center;
  margin-top: 25%;
}
</style>