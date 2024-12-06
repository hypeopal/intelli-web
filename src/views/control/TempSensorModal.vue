<template>
  <div ref="sensorChart" style="width: 100%; height: 100%;">
    <div v-if="message" class="message">{{ message }}</div>
  </div>

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

const initChart = () => {
  const chart = echarts.init(sensorChart.value, theme.value);

  const option = {
    backgroundColor: 'transparent',
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
        name: 'humanity',
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

onMounted(async () => {
  initChart();
});

onUnmounted(() => {
  if (sensorChart.value) {
    sensorChart.value.dispose();
  }
});
</script>

<style scoped>

</style>