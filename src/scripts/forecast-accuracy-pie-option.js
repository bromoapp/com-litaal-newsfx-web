/* eslint-disable */
export class ForecastAccuracyPieOption {
  constructor () {
    this.title = {
      subtext: 'Accuracy Ratio',
      left: 'center',
    },
    this.tooltip = {
      trigger: 'item'
    },
    this.legend= {
      orient: 'horizontal',
      bottom: 'left'
    },
    this.series = [
      {
        name: 'Accuracy',
        type: 'pie',
        radius: '60%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}
