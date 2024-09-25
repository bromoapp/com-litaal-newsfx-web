<template>
  <div v-if="showChart">
    <candle
      ref="priceCandlesChartReff"
      class="sr-prices-candle-chart"
      :option="priceCandlesOption"
    ></candle>
    <volume
      ref="volumeBarChartReff"
      :option="priceVolumesOption"
      class="sr-vol-bar-chart"
    ></volume>
    <delta
      v-if="showDelta"
      ref="deltaBarChartReff"
      :option="deltaVolumesOption"
      class="sr-delta-bar-chart"
    ></delta>
  </div>
  <div style="height: 439px" v-else>
    <q-btn flat label="NO DATA" style="font-size: 24px" disable />
  </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref, inject } from "vue";
import { ApiService } from "../services/api-service.js";
import { PriceDeltaVolumesOption } from "../scripts/price-deltavolumes-option.js";
import { PriceVolumesOption } from "../scripts/price-volumes-option.js";
import { PriceCandlesOption } from "../scripts/price-candles-option.js";
import { Util } from "../scripts/util.js";
import ECharts from "vue-echarts";

//--- Importing constants ---
import options from "../assets/options.json";

export default defineComponent({
  name: "PriceCandlesChart",
  components: {
    candle: ECharts,
    volume: ECharts,
    delta: ECharts,
  },
  props: {
    pair: String,
    timeframe: String,
    event: Object,
  },
  setup(props) {
    //-- Necessary objects & constants --
    const utilObj = Util;
    const eventBus = inject("evbus");
    const apiService = new ApiService(eventBus);
    const priceCandlesChartReff = ref(null);
    const volumeBarChartReff = ref(null);
    const deltaBarChartReff = ref(null);
    const showChart = ref(false);
    const showDelta = ref(false);
    const inquiryArgs = ref({
      pair: props.pair,
      timeframe: props.timeframe,
      time: props.event.date,
    });
    const priceCandlesOption = new PriceCandlesOption();
    const priceVolumesOption = new PriceVolumesOption();
    const deltaVolumesOption = new PriceDeltaVolumesOption();

    //--- Callbacks functions ---
    const onPairPricesInquirySucceed = function (resp) {
      if (resp) {
        //------------------ CANDLE CHART --------------------
        const _priceCandlesOption = new PriceCandlesOption();
        const _candleMarkLine = ref({});
        const _chartCategories = [];
        const _prices = [];
        let _showCandles = false;

        try {
          const _candleTitle =
            inquiryArgs.value.pair + " " + inquiryArgs.value.timeframe;
          _candleMarkLine.value = {
            data: [
              {
                name: "start",
                xAxis: utilObj.parseTimeOnly(resp.mark.time),
                lineStyle: {
                  color: "green",
                },
                symbol: "none",
                symbolSize: 0,
              },
            ],
          };

          resp.categories.forEach((e) => {
            _chartCategories.push(utilObj.parseTimeOnly(e));
          });

          resp.prices.forEach((e) => {
            _prices.push(e);
          });

          _priceCandlesOption.title.text = _candleTitle;
          _priceCandlesOption.xAxis.data = _chartCategories;
          _priceCandlesOption.series[0].data = _prices;
          _priceCandlesOption.series[0].markLine = _candleMarkLine.value;

          _showCandles = true;
        } catch (err) {
          console.log("ON CANDLE ERROR", err);
        }

        //------------------ VOL BAR CHART --------------------
        const _priceVolumesOption = new PriceVolumesOption();
        const _barMarkLine = ref({});
        const _volumes = [];
        let _showVolBars = false;

        try {
          _barMarkLine.value = {
            symbol: "none",
            data: [
              {
                name: "start",
                xAxis: utilObj.parseTimeOnly(resp.mark.time),
                lineStyle: {
                  color: "green",
                },
                symbol: "none",
                symbolSize: 0,
              },
            ],
          };

          resp.volumes.forEach((e) => {
            _volumes.push(e);
          });

          _priceVolumesOption.xAxis.data = _chartCategories;
          _priceVolumesOption.series[0].data = _volumes;
          _priceVolumesOption.series[0].markLine = _barMarkLine.value;
          _showVolBars = true;
        } catch (err) {
          console.log("ON VOL BAR ERROR", err);
        }

        //------------------ DELTA VOL BAR CHART --------------------
        const _deltaVolumesOption = new PriceDeltaVolumesOption();
        const _asks = [];
        const _bids = [];
        let _showDeltaVolBars = false;

        try {
          resp.asks.forEach((e) => {
            _asks.push(e);
          });

          resp.bids.forEach((e) => {
            _bids.push(e);
          });

          _deltaVolumesOption.xAxis.data = _chartCategories;
          _deltaVolumesOption.series[0].data = _asks;
          _deltaVolumesOption.series[1].data = _bids;
          _deltaVolumesOption.series[1].markLine = _barMarkLine.value;
          _showDeltaVolBars = true;
        } catch (err) {
          console.log("ON DELTA BAR ERROR", err);
        }

        if (_showCandles && _showVolBars) {
          const resizeCandleNVolumeChart = function () {
            if (priceCandlesChartReff.value && volumeBarChartReff.value) {
              priceCandlesChartReff.value.resize();
              volumeBarChartReff.value.resize();
            }
          };

          setTimeout(() => {
            if (priceCandlesChartReff.value && volumeBarChartReff.value) {
              priceCandlesChartReff.value.setOption(
                _priceCandlesOption,
                "start-force"
              );
              volumeBarChartReff.value.setOption(
                _priceVolumesOption,
                "start-force"
              );
              window.addEventListener("resize", resizeCandleNVolumeChart);
            }
          }, 1000);
          showChart.value = true;
        }
        if (_showDeltaVolBars) {
          const resizeDeltaVolumeChart = function () {
            if (deltaBarChartReff.value) {
              deltaBarChartReff.value.resize();
            }
          };
          setTimeout(() => {
            if (deltaBarChartReff.value) {
              deltaBarChartReff.value.setOption(
                _deltaVolumesOption,
                "start-force"
              );
              window.addEventListener("resize", resizeDeltaVolumeChart);
            }
          }, 1000);
          showDelta.value = true;
        }
      }
    };

    //--- Execute inquiry to API service
    const executePairPricesInquiry = function (value) {
      let pair = value.pair;
      let timeframe = value.timeframe;
      let time = value.time;
      if (pair && timeframe && time) {
        apiService.queryPricesByEventTime(
          pair,
          timeframe,
          time,
          onPairPricesInquirySucceed
        );
      }
    };

    //--- Setup events bus listeners ---
    eventBus.on(options.eventbus.CHART_MESSAGE, (tf) => {
      inquiryArgs.value.timeframe = tf;
      setTimeout(() => {
        const _priceCandlesOption = new PriceCandlesOption();
        const _priceVolumesOption = new PriceVolumesOption();
        const _deltaVolumesOption = new PriceDeltaVolumesOption();
        if (priceCandlesChartReff.value) {
          priceCandlesChartReff.value.setOption(
            _priceCandlesOption,
            "start-force"
          );
        }
        if (volumeBarChartReff.value) {
          volumeBarChartReff.value.setOption(
            _priceVolumesOption,
            "start-force"
          );
        }
        if (deltaBarChartReff.value) {
          deltaBarChartReff.value.setOption(_deltaVolumesOption, "start-force");
        }
        executePairPricesInquiry(inquiryArgs.value);
      }, 100);
    });

    setTimeout(() => {
      executePairPricesInquiry(inquiryArgs.value);
    }, 100);

    return {
      showChart,
      showDelta,
      priceCandlesOption,
      priceCandlesChartReff,
      priceVolumesOption,
      volumeBarChartReff,
      deltaVolumesOption,
      deltaBarChartReff,
    };
  },
});
</script>
