<template>
  <div ref="weatherChart" class="chart"></div>
</template>

<script setup>
import * as echarts from 'echarts/core';
import {LineChart, BarChart} from 'echarts/charts';
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

import {LabelLayout, UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import {getCityId, getTemp} from "../js/GetWeather";
import {onMounted, ref} from "vue";

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
  if (localStorage.getItem('lastModified') === DateList.value[0].toString()) {
    try {
      HighestTemp.value = JSON.parse(localStorage.getItem('highTemp')) || HighestTemp.value;
      LowestTemp.value = JSON.parse(localStorage.getItem('lowTemp')) || LowestTemp.value;
    } catch (e) {
      console.log('读取本地数据出错', e);
    }
  } else {
    try {
      const cityId = await getCityId(City.value);
      const tempList = await getTemp(cityId);
      console.log("更新气温");
      HighestTemp.value = tempList.map(day => day[0]);
      LowestTemp.value = tempList.map(day => day[1]);

      localStorage.setItem('highTemp', JSON.stringify(HighestTemp.value));
      localStorage.setItem('lowTemp', JSON.stringify(LowestTemp.value));
      localStorage.setItem('lastModified', DateList.value[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const chart = echarts.init(weatherChart.value);
  const option = {
    title: {
      text: `${City.value}气温 `,
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
      name: '日期',
      boundaryGap: false,
      data: DateList.value,
    },
    yAxis: {
      type: 'value',
      name: '温度',
      min: function (value) {
        return value.min - 2;
      },
      axisLabel: {
        formatter: '{value} °C'
      }
    },
    series: [
      {
        name: '最高气温',
        type: 'line',
        data: HighestTemp.value,
        markLine: {
          data: [{type: 'average', name: 'Avg'}],
          lineStyle: {
            width: 1.5
          },
          emphasis: {
            lineStyle: {
              width: 2,
            },
            label: {
              show: true
            }
          },
          label: {
            position: 'middle',
            formatter: '平均高温: {c} °C',
            show: false,
          },
          symbol: ['circle', 'none'],
        }
      },
      {
        name: '最低气温',
        type: 'line',
        data: LowestTemp.value,
        markLine: {
          data: [
            {
              type: 'average',
              name: 'Avg',
            },
          ],
          lineStyle: {
            width: 1.5
          },
          emphasis: {
            lineStyle: {
              width: 2,
            },
            label: {
              show: true
            }
          },
          label: {
            position: 'middle',
            formatter: '平均低温: {c} °C',
            show: false,
          },
          symbol: ['circle', 'none'],
        }
      }
    ]
  };
  chart.setOption(option);

  window.addEventListener('resize', () => {
    chart.resize();
  });
};

onMounted(() => {
  initChart();
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