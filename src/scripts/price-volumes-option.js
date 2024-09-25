/* eslint-disable */
export class PriceVolumesOption {
  constructor () {
    this.title = {
      text: "Volume",
      right: 6,
      textStyle: {
        fontSize: 12
      }
    },
    this.tooltip = {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    this.grid = {
      top: "2%",
      left: "8%",
      right: "8%",
      bottom: "0%",
    },
    this.xAxis = {
      type: 'category',
      data: []
    },
    this.yAxis = {},
    // this.dataZoom = [
    //   {
    //     type: "inside",
    //     start: 0,
    //     end: 100,
    //   },
    // ],
    this.series = [
      {
        data: [],
        type: 'bar',
        itemStyle: {
          color: "#9966CC",
        },
        markLine: null,
      }
    ]
  }
}
