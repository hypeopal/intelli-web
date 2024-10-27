<template>
  <div ref="weatherChart" class="chart"></div>
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
const City = ref('成都');
const weatherChart = ref(null);

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
    if (localStorage.getItem('lastModified') === DateList.value[0].toString()) {
      HighestTemp.value = JSON.parse(localStorage.getItem('highTemp')) || HighestTemp.value;
      LowestTemp.value = JSON.parse(localStorage.getItem('lowTemp')) || LowestTemp.value;
    } else {
      const cityId = await getCityId(City.value);
      const tempList = await getTemp(cityId);
      console.log("更新气温");
      HighestTemp.value = tempList.map(day => day[0]);
      LowestTemp.value = tempList.map(day => day[1]);

      localStorage.setItem('highTemp', JSON.stringify(HighestTemp.value));
      localStorage.setItem('lowTemp', JSON.stringify(LowestTemp.value));
      localStorage.setItem('lastModified', DateList.value[0]);
    }
  } catch (e) {
    // The Error Type is from JSON.parse or localstorage.setItem
    console.log(e)
  }


  const chart = echarts.init(weatherChart.value);
  let option = GetChartOption(City.value, DateList.value, HighestTemp.value, LowestTemp.value)
  chart.setOption(option);

  window.addEventListener('resize', () => {
    chart.resize();
  });
};



onMounted(async () => {
  await initChart();
});
</script>

<style scoped>
.chart {
  width: 30%;
  height: 240px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 15px 15px 0;
  margin-top: 5px;
}
</style>