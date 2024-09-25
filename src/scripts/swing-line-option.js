/* eslint-disable */
export class SwingLineOption {
  constructor(title) {
    this.title = {
      text: title,
      left: 6,
      textStyle: {
        fontSize: 12
      }
    },
    this.tooltip = {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    this.legend = {
      data: ["1M", "5M", "15M", "30M", "1H"],
    },
    this.grid = {
      left: "2%",
      right: "5%",
      bottom: "2%",
      containLabel: true
    },
    this.xAxis = {
      type: "category",
      boundaryGap: false,
      data: []
    },
    this.yAxis = {
      type: "value"
    },
    this.series = [
      {
        name: '1M',
        type: 'line',
        data: []
      },
      {
        name: '5M',
        type: 'line',
        data: []
      },
      {
        name: '15M',
        type: 'line',
        data: []
      },
      {
        name: '30M',
        type: 'line',
        data: []
      },
      {
        name: '1H',
        type: 'line',
        data: []
      },
    ]
  }
}
