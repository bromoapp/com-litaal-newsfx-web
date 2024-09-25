/* eslint-disable */
export class PriceDeltaVolumesOption {
  constructor () {
    this.title = {
      text: "Asks | Bids",
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
      bottom: "25%",
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
          color: "#F19CBB",
        },
        stack: "x",
        markLine: null,
      },
      {
        data: [],
        type: 'bar',
        itemStyle: {
          color: "#9F2B68",
        },
        stack: "x",
      }
    ]
  }
}
