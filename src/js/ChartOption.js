import i18n from "../locales/i18n.js";

export function GetChartOption(cityValue, dateListValue, highestTempValue, lowestTempValue) {
    let textColor = '';
    let bgc = '';
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        textColor = '#eee';
        bgc = '#111'
    } else {
        textColor = '#000';
        bgc = '#eee';
    }
    return {
        title: {
            text: `${cityValue} ${i18n.global.t('temperature')} `,
            textStyle: {
                fontSize: 20,
                color: `${textColor}`,
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: `${bgc}`,
            textStyle: {
                color: `${textColor}`,
            }
        },
        legend: {
            bottom: 15,
            textStyle: {
                fontSize: 15,
                color: `${textColor}`,
            },
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
            },
            iconStyle: {
                borderColor: `${textColor}`,
            }
        },
        xAxis: {
            type: 'category',
            name: `${i18n.global.t('date')}`,
            boundaryGap: false,
            data: dateListValue,
        },
        yAxis: {
            type: 'value',
            name: '°C',
            min: function (value) {
                return value.min - (value.max - value.min) / 5;
            },
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: `${i18n.global.t('highTemp')}`,
                type: 'line',
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
                            show: true,
                            color: `${textColor}`
                        }
                    },
                    label: {
                        position: 'middle',
                        formatter: `${i18n.global.t('avgHighTemp')}` + ': {c} °C',
                        show: false,
                    },
                    symbol: ['circle', 'none'],
                },
                emphasis: {
                    backgroundColor: `${bgc}`,
                }
            },
            {
                name: `${i18n.global.t('lowTemp')}`,
                type: 'line',
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
                            show: true,
                            color: `${textColor}`
                        }
                    },
                    label: {
                        position: 'middle',
                        formatter: `${i18n.global.t('avgLowTemp')}` + ': {c} °C',
                        show: false,
                    },
                    symbol: ['circle', 'none'],
                },
                emphasis: {
                    backgroundColor: `${bgc}`,
                }
            }
        ]
    }
}