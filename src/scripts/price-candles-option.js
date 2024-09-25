/* eslint-disable */
export class PriceCandlesOption {
  constructor () {
      this.title = {
        text: "PAIR TF",
        left: 0,
      },
      this.tooltip = {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      this.legend = {
        data: ["candles"],
      },
      this.grid = {
        left: "8%",
        right: "8%",
        bottom: "0%",
      },
      this.xAxis = {
        type: "category",
        data: [],
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: true },
        min: "dataMin",
        max: "dataMax",
      },
      this.yAxis = {
        scale: true,
        splitArea: {
          show: true,
        },
      },
      // this.dataZoom = [
      //   {
      //     type: "inside",
      //     start: 0,
      //     end: 100,
      //   },
      // ],
      this.series = [
        {
          name: "candles",
          type: "candlestick",
          data: [],
          itemStyle: {
            color: "#4B6F44",
            color0: "#DB2D43",
            borderColor: "#4B6F44",
            borderColor0: "#DB2D43",
          },
          markLine: null,
        },
      ]
    }
}
