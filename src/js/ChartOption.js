export function GetChartOption(cityValue, dateListValue, highestTempValue, lowestTempValue) {
    return {
        title: {
            text: `${cityValue}气温 `,
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
            data: dateListValue,
        },
        yAxis: {
            type: 'value',
            name: '温度 °C',
            min: function (value) {
                return value.min - (value.max - value.min) / 5;
            },
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: '最高气温',
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
                        formatter: '平均低温: {c} °C',
                        show: false,
                    },
                    symbol: ['circle', 'none'],
                }
            }
        ]
    }
}