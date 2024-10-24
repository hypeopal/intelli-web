<template>
  <div ref="weatherChart" class="chart"></div>
</template>

<script>
import * as echarts from 'echarts';
import {getCityId, getTemp} from "../js/GetWeather";

export default {
  name: "WeatherChart",
  data() {
    return {
      HighestTemp: [24, 18, 19, 19, 24, 22, 23],
      LowestTemp: [17, 15, 14, 13, 13, 14, 16],
      DateList: ['18', '19', '20', '21', '22', '23', '24'],
      City: '成都',
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    async initChart() {
      this.DateList = this.generateDayList();
      if (localStorage.getItem('lastModified') === this.DateList[0].toString()) {
        try {
          this.HighestTemp = JSON.parse(localStorage.getItem('highTemp')) || this.HighestTemp;
          this.LowestTemp = JSON.parse(localStorage.getItem('lowTemp')) || this.LowestTemp;
        } catch (e) {
          console.log('读取本地数据出错', e);
        }
      } else {
        try {
          const cityId = await getCityId(this.City);
          const tempList = await getTemp(cityId);
          console.log("更新气温");
          this.HighestTemp = tempList.map(day => day[0]); // 提取最高温
          this.LowestTemp = tempList.map(day => day[1]); // 提取最低温
          //保存数据，每日更新一次
          localStorage.setItem('highTemp', JSON.stringify(this.HighestTemp));
          localStorage.setItem('lowTemp', JSON.stringify(this.LowestTemp));
          localStorage.setItem('lastModified', this.DateList[0]);
        } catch (e) {
          console.log(e);
        }
      }
      const chart = echarts.init(this.$refs.weatherChart);
      const option = {
        title: {
          text: `${this.City}气温 `,
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
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          name: '日期',
          boundaryGap: false,
          data: this.DateList,
        },
        yAxis: {
          type: 'value',
          name: '温度',
          min: function(value) {
            return value.min - 3;
          },
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [
          {
            name: '最高气温',
            type: 'line',
            data: this.HighestTemp,
            markLine: {
              data: [{ type: 'average', name: 'Avg' }],
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
            data: this.LowestTemp,
            markLine: {
              data: [
                {
                  type: 'average',
                  name: 'Avg',
                },
              ],
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
                formatter: '平均低度: {c} °C',
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
    },
    generateDayList() {
      const today = new Date();
      return Array.from({ length: 7 }, (_, i) => {
        let futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        return futureDate.getDate(); // 返回日期部分
      });
    },
  }
};
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