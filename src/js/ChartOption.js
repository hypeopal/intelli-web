import i18n from "../locales/i18n.js";

export function GetChartOption(cityValue, dateListValue, highestTempValue, lowestTempValue) {
    return {
        backgroundColor: 'transparent',
        title: {
            text: `${cityValue}${i18n.global.t('temperature')} `,
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
            name:  `${i18n.global.t('date')}`,
            nameTruncate: {
              maxWait: 1
            },
            boundaryGap: false,
            data: dateListValue,
        },
        yAxis: {
            type: 'value',
            name: '°C',
            min: function (value) {
                return value.min - 1;
            },
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: `${i18n.global.t('highTemp')}`,
                type: 'line',
                smooth: true,
                data: highestTempValue,
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
                        formatter: `${i18n.global.t('avgHighTemp')}` + ': {c} °C',
                        show: false,
                    },
                    symbol: ['none', 'none'],
                }
            },
            {
                name: `${i18n.global.t('lowTemp')}`,
                type: 'line',
                smooth: true,
                color: '#92cb78',
                data: lowestTempValue,
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
                        formatter: `${i18n.global.t('avgLowTemp')}` + ': {c} °C',
                        show: false,
                    },
                    symbol: ['none', 'none'],
                }
            }
        ]
    }
}