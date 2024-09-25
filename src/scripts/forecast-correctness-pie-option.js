/* eslint-disable */
export class ForecastCorrectnessPieOption {
  constructor () {
    this.title = {
      subtext: 'Correctness Ratio',
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
        name: 'Correctness',
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
