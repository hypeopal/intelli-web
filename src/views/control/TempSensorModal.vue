<template>
  <div style="margin-bottom: 10px;">
    <el-radio-group v-model="model" @change="changeModel">
      <el-radio-button :label="t('now')" value="now"/>
      <el-radio-button :label="t('historyData')" value="history"/>
    </el-radio-group>
  </div>
  <div ref="sensorChart" style="width: 400px; height: 300px;" v-if="model === 'history'">
    <div v-if="message" class="message">{{ message }}</div>
  </div>
  <div v-if="model === 'now'">
    <el-descriptions border direction="vertical">
      <el-descriptions-item :label="t('airTemp')">{{ sensorData.temp }} °C</el-descriptions-item>
      <el-descriptions-item :label="t('humidity')">{{ sensorData.humidity }} %</el-descriptions-item>
    </el-descriptions>
  </div>
  <div v-if="timeString">{{timeString}}</div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from "vue";
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
import {useTheme} from "../../js/UseTheme.js";
import api from "../../js/request.js";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const {theme} = useTheme();
const props = defineProps({
  deviceId: Number
});

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

const sensorChart = ref(null);

const temperatureData = [22, 25, 28, 31, 29, 26, 24];
const humidityData = [60, 65, 70, 72, 68, 63, 58];
const message = ref('');
const model = ref('now');
const sensorData = ref({
  temp: '-',
  humidity: '-'
});
const timeString = ref('');

const changeModel = () => {
  if (model.value === 'history') initChart();
}
const initChart = () => {
  const chart = echarts.init(sensorChart.value, theme.value);

  const option = {
    title: {
      text: 'Temperature',
      textStyle: {
        fontSize: 20,
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      bottom: 15,
      textStyle: {
        fontSize: 15,
      }
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        magicType: {type: ['line', 'bar']},
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: [
      {
        type: 'value',
        min: function (value) {
          return value.min - 1;
        },
        axisLabel: {
          formatter: '{value}°C'
        }
      },
      {
        type: 'value',
        min: function (value) {
          return value.min - 1;
        },
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: 'temp',
        type: 'line',
        color: '#3fb1e3',
        yAxisIndex: 0,
        data: temperatureData,
      },
      {
        name: 'humidity',
        type: 'line',
        color: '#6be6c1',
        yAxisIndex: 1,
        data: humidityData,
      }
    ]
  };

  chart.setOption(option);
  window.addEventListener('resize', () => {
    chart.resize();
  })
};
const getDeviceData = async () => {
  await api.get(`/api/my/device/${props.deviceId}/status`).then((response) => {
    let value = response.data.temperature.toFixed(2);
    sensorData.value.temp = value.toString();
    value = response.data.humidity.toFixed(2);
    sensorData.value.humidity = value.toString();
    let time = new Date(response.timestamp * 1000);
    timeString.value = `${t('updateTime')}:` + time.getHours() + ':' + time.getMinutes();
  });
}
onMounted(async () => {
  await getDeviceData();
});
onUnmounted(() => {
  if (sensorChart.value) {
    sensorChart.value.dispose();
  }
});
</script>

<style scoped>

</style>