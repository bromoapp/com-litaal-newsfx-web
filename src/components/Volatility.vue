<template>
  <div v-if="showPanel">
    <table style="border-spacing: 3px" class="sr-table-panel">
      <tr>
        <td style="width: 50%">
          <span class="sr-large-font"
            ><b
              >A. This event's volatility
              <span class="sr-small-font">(pips)</span></b
            ></span
          >
        </td>
        <td>
          <span class="sr-large-font"
            ><b
              >B. Avg volatility in the last
              {{ config.inquiry.avg_volatility_size }} occurrences
              <span class="sr-small-font">(pips)</span></b
            ></span
          >
        </td>
      </tr>
      <tr>
        <td style="width: 50%">
          <table class="sr-table-panel">
            <tr class="bg-grey-5">
              <th style="width: 20%" class="sr-small-font">1 M</th>
              <th style="width: 20%" class="sr-small-font">5 M</th>
              <th style="width: 20%" class="sr-small-font">15 M</th>
              <th style="width: 20%" class="sr-small-font">30 M</th>
            </tr>
            <tr v-if="volatility.main != null">
              <td v-if="volatility.main.m1" class="text-center">
                <b>{{ volatility.main.m1 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.main.m5" class="text-center">
                <b>{{ volatility.main.m5 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.main.m15" class="text-center">
                <b class="sr-small-font sr-small-font">{{
                  volatility.main.m15
                }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.main.m30" class="text-center">
                <b class="sr-small-font sr-small-font">{{
                  volatility.main.m30
                }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
            </tr>
            <tr v-else>
              <td colspan="5" class="text-center">N/A</td>
            </tr>
            <tr class="bg-grey-5">
              <th style="width: 20%" class="sr-small-font">1 H</th>
              <th style="width: 20%" class="sr-small-font">2 H</th>
              <th style="width: 20%" class="sr-small-font">3 H</th>
              <th style="width: 20%" class="sr-small-font">4 H</th>
            </tr>
            <tr v-if="volatility.main != null">
              <td v-if="volatility.main.h1" class="text-center">
                <b>{{ volatility.main.h1 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.main.h2" class="text-center">
                <b>{{ volatility.main.h2 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.main.h3" class="text-center">
                <b>{{ volatility.main.h3 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.main.h4" class="text-center">
                <b>{{ volatility.main.h4 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
            </tr>
            <tr v-else>
              <td colspan="5" class="text-center">N/A</td>
            </tr>
          </table>
        </td>
        <td>
          <table class="sr-table-panel">
            <tr class="bg-grey-5">
              <th style="width: 20%" class="sr-small-font">1 M</th>
              <th style="width: 20%" class="sr-small-font">5 M</th>
              <th style="width: 20%" class="sr-small-font">15 M</th>
              <th style="width: 20%" class="sr-small-font">30 M</th>
            </tr>
            <tr v-if="volatility.average != null">
              <td v-if="volatility.average.value.m1" class="text-center">
                <b>{{ volatility.average.value.m1 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.average.value.m5" class="text-center">
                <b>{{ volatility.average.value.m5 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.average.value.m15" class="text-center">
                <b>{{ volatility.average.value.m15 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.average.value.m30" class="text-center">
                <b>{{ volatility.average.value.m30 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
            </tr>
            <tr v-else>
              <td colspan="5" class="text-center">N/A</td>
            </tr>
            <tr class="bg-grey-5">
              <th style="width: 20%" class="sr-small-font">1 H</th>
              <th style="width: 20%" class="sr-small-font">2 H</th>
              <th style="width: 20%" class="sr-small-font">3 H</th>
              <th style="width: 20%" class="sr-small-font">4 H</th>
            </tr>
            <tr v-if="volatility.average != null">
              <td v-if="volatility.average.value.h1" class="text-center">
                <b>{{ volatility.average.value.h1 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.average.value.h2" class="text-center">
                <b>{{ volatility.average.value.h2 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.average.value.h3" class="text-center">
                <b>{{ volatility.average.value.h3 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="volatility.average.value.h4" class="text-center">
                <b>{{ volatility.average.value.h4 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
            </tr>
            <tr v-else>
              <td colspan="5" class="text-center">N/A</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <line-chart
      class="sr-volatility-chart"
      ref="volatilityChartRef"
      :option="option"
    ></line-chart>
  </div>
  <div v-else style="height: 100%">
    <span class="absolute-center">{{ emptyText }}</span>
  </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, inject, ref, getCurrentInstance } from "vue";
import { VolatilityLineOption } from "../scripts/volatility-line-option.js";
import { Util } from "../scripts/util.js";
import ECharts from "vue-echarts";

//--- Importing constants ---
import config from "../assets/config.json";
import options from "../assets/options.json";

export default defineComponent({
  name: "Volatility",
  components: {
    "line-chart": ECharts,
  },
  props: {
    id: String,
  },
  methods: {
    forceUpdate(data) {
      this.volatility = data;
      this.showPanel = true;
    },
  },
  setup(props, { expose }) {
    const util = Util;
    const volatilityObj = ref({});
    const showPanelVal = ref(false);
    const eventBus = inject("evbus");
    const volatilityChartRef = ref(null);
    const instance = getCurrentInstance();
    const emptyTextVal = ref("Loading...");
    const option = new VolatilityLineOption();

    const renderChart = function (data) {
      const _option = new VolatilityLineOption();
      setTimeout(() => {
        data.times.forEach((o) => {
          let time = util.parseDateOnly(o);
          _option.xAxis.data.push(time);
        });

        _option.series[0].data = data.m1Values;
        _option.series[1].data = data.m5Values;
        _option.series[2].data = data.m15Values;
        _option.series[3].data = data.m30Values;
        _option.series[4].data = data.h1Values;
        volatilityChartRef.value?.setOption(_option, "start-force");
      }, 500);
    };

    expose({
      renderData(data) {
        if (data) {
          instance.ctx.forceUpdate(data);
          renderChart(data);
        } else {
          emptyTextVal.value = "NO DATA";
        }
      },
    });

    //--- Setup events bus listeners ---
    const eventName = options.eventbus.RENDER_VOLATILITY + "_" + props.id;
    eventBus.on(eventName, (data) => {
      if (data) {
        volatilityObj.value = data;
        showPanelVal.value = true;
        renderChart(data);
      } else {
        emptyTextVal.value = "NO DATA";
      }
    });
    return {
      config,
      option,
      elId: props.id,
      volatilityChartRef,
      showPanel: showPanelVal,
      emptyText: emptyTextVal,
      volatility: volatilityObj,
    };
  },
});
</script>
