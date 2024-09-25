<template>
  <div v-if="showPanel">
    <table style="border-spacing: 3px" class="sr-table-panel">
      <tr>
        <td colspan="2">
          <span class="sr-large-font"
            ><b>
              &nbsp;Forecast's correctness &#38; accuracy ratio in the last
              {{ config.inquiry.avg_forecast_size }} occurrences</b
            ></span
          >
        </td>
      </tr>
      <tr>
        <td style="width: 50%">
          <pie-correctness
            ref="correctnessRef"
            :option="correctnessOpt"
            class="sr-forecast-chart"
          />
        </td>
        <td style="width: 50%">
          <pie-accuracy
            ref="accuracyRef"
            :option="accuracyOpt"
            class="sr-forecast-chart"
          />
        </td>
      </tr>
    </table>
  </div>
  <div v-else style="height: 100%">
    <span class="absolute-center">{{ emptyText }}</span>
  </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref, inject, getCurrentInstance } from "vue";
import { ForecastCorrectnessPieOption } from "../scripts/forecast-correctness-pie-option.js";
import { ForecastAccuracyPieOption } from "../scripts/forecast-accuracy-pie-option.js";
import ECharts from "vue-echarts";

//--- Importing constants ---
import config from "../assets/config.json";
import options from "../assets/options.json";

export default defineComponent({
  name: "Forecast",
  components: {
    "pie-correctness": ECharts,
    "pie-accuracy": ECharts,
  },
  props: {
    id: String,
  },
  methods: {
    forceUpdate(data) {
      this.forecast = data;
      this.showPanel = true;
    },
  },
  setup(props, { expose }) {
    const forecastObj = ref({});
    const accuracyRef = ref(null);
    const showPanelVal = ref(false);
    const correctnessRef = ref(null);
    const eventBus = inject("evbus");
    const instance = getCurrentInstance();
    const emptyTextVal = ref("Loading...");
    const accuracyOptObj = new ForecastAccuracyPieOption();
    const correctnessOptObj = new ForecastCorrectnessPieOption();

    const renderChart = function (data) {
      const _correctnessOptObj = new ForecastCorrectnessPieOption();
      const _accuracyOptObj = new ForecastAccuracyPieOption();
      setTimeout(() => {
        _correctnessOptObj.series[0].data.push({
          name: "correct " + asPercent(data.correct, data.total),
          value: data.correct,
        });
        _correctnessOptObj.series[0].data.push({
          name: "wrong " + asPercent(data.wrong, data.total),
          value: data.wrong,
        });

        _accuracyOptObj.series[0].data.push({
          name: "precise " + asPercent(data.precise, data.correct),
          value: data.precise,
        });
        _accuracyOptObj.series[0].data.push({
          name: "bigger " + asPercent(data.bigger, data.correct),
          value: data.bigger,
        });
        _accuracyOptObj.series[0].data.push({
          name: "smaller " + asPercent(data.smaller, data.correct),
          value: data.smaller,
        });

        correctnessRef.value.setOption(_correctnessOptObj, "start-force");
        accuracyRef.value.setOption(_accuracyOptObj, "start-force");
      }, 700);
    };

    const asPercent = function (a, b) {
      return Math.round((a / b) * 100) + "%";
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
    const eventName = options.eventbus.RENDER_FORECAST + "_" + props.id;
    eventBus.on(eventName, (data) => {
      if (data) {
        forecastObj.value = data;
        showPanelVal.value = true;
        renderChart(data);
      } else {
        emptyTextVal.value = "NO DATA";
      }
    });
    return {
      config,
      accuracyRef,
      correctnessRef,
      forecast: forecastObj,
      showPanel: showPanelVal,
      emptyText: emptyTextVal,
      accuracyOpt: accuracyOptObj,
      correctnessOpt: correctnessOptObj,
    };
  },
});
</script>
