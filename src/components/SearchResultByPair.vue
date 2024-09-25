<template>
  <q-item class="sr-list-item">
    <div style="width: 100%; margin: 0" class="bg-white sr-event-panel">
      <table style="border-spacing: 3px" class="sr-table-panel">
        <tr>
          <td style="width: 50%; vertical-align: top">
            <price-candles-chart
              :pair="pair"
              :event="event"
              :timeframe="timeframe"
            />
          </td>
          <td style="width: 50%; vertical-align: top">
            <q-icon
              name="calendar_month"
              style="margin-bottom: 4px; margin-right: 5px"
            ></q-icon>
            <span class="text-weight-bolder"
              >{{ util.parseDayAndTime(event.date) }} | {{ event.title }}</span
            >
            <q-tabs
              v-model="tab"
              dense
              align="right"
              narrow-indicator
              class="text-black"
              active-color="primary"
              indicator-color="primary"
              @update:model-value="onTabChanged"
            >
              <q-tab name="events" label="News Events" />
              <q-tab name="forecast" label="Forecast" />
              <q-tab name="volatility" label="Volatilities" />
              <q-tab name="behavior" label="Behaviors" />
            </q-tabs>
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="events" style="margin: 0px; padding: 0px">
                <q-scroll-area
                  class="sr-event-panel"
                  style="height: 453px; max-width: 100%"
                >
                  <main-event :event="event" />
                  <div v-if="otherEvents.length > 0">
                    <other-events
                      :impact="othersImpact"
                      :otherEvents="otherEvents"
                    />
                  </div>
                </q-scroll-area>
              </q-tab-panel>
              <q-tab-panel name="forecast" style="margin: 0px; padding: 0px">
                <div
                  class="sr-event-panel"
                  style="height: 453px; max-width: 100%"
                >
                  <forecast :id="elId" ref="forecastRef" />
                </div>
              </q-tab-panel>
              <q-tab-panel name="volatility" style="margin: 0px; padding: 0px">
                <div
                  class="sr-event-panel"
                  style="height: 453px; max-width: 100%"
                >
                  <volatility :id="elId" ref="volitilityRef" />
                </div>
              </q-tab-panel>
              <q-tab-panel name="behavior" style="margin: 0px; padding: 0px">
                <div
                  class="sr-event-panel"
                  style="height: 453px; max-width: 100%"
                >
                  <behavior :id="elId" ref="behaviorRef" />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </td>
        </tr>
      </table>
    </div>
  </q-item>
</template>
<script>
/* eslint-disable */
import { defineComponent, inject, ref } from "vue";
import Forecast from "./Forecast.vue";
import MainEvent from "./MainEvent.vue";
import { Util } from "../scripts/util.js";
import Volatility from "./Volatility.vue";
import Behavior from "./Behavior.vue";
import OtherEvents from "./OtherEvents.vue";
import PriceCandlesChart from "./PriceCandlesChart.vue";
import { ApiService } from "../services/api-service.js";

//--- Importing constants ---
import config from "../assets/config.json";
import options from "../assets/options.json";

export default defineComponent({
  name: "SearchResultByPair",
  props: {
    id: String,
    page: Number,
    index: Number,
    pair: String,
    event: Object,
    impact: Object,
    timeframe: String,
    news_origin: Object,
  },
  components: {
    behavior: Behavior,
    forecast: Forecast,
    volatility: Volatility,
    "main-event": MainEvent,
    "other-events": OtherEvents,
    "price-candles-chart": PriceCandlesChart,
  },
  setup(props) {
    const utilObj = Util;
    const swingObj = ref({});
    const behaviorRef = ref(null);
    const forecastObj = ref({});
    const forecastRef = ref(null);
    const volatilityObj = ref({});
    const volitilityRef = ref(null);
    const tabChoice = ref("events");
    const pairObj = ref(props.pair);
    const eventBus = inject("evbus");
    const otherEventsArray = ref([]);
    const resultObj = ref(props.event);
    const impactObj = ref(props.impact);
    const newsObj = ref(props.news_origin);
    const timeframeObj = ref(props.timeframe);
    const apiService = new ApiService(eventBus);

    //---  Callback functions ---
    const onOtherEventsInquirySucceed = function (data) {
      otherEventsArray.value = data;
    };

    const onVolatilityInquirySucceed = function (data) {
      volatilityObj.value = data;
      volitilityRef.value?.renderData(data);
    };

    const onForecastInquirySucceed = function (data) {
      forecastObj.value = data;
      forecastRef.value?.renderData(data);
    };

    const onSwingInquirySucceed = function (data) {
      swingObj.value = data;
      behaviorRef.value?.renderData(data);
    };

    //--- Executing queries for populating components ---
    setTimeout(() => {
      apiService.queryOtherEventsByEventTime(
        props.news_origin.value, // provider
        props.pair, // pair
        props.event.date, // time
        props.event.uuid, // uuid
        onOtherEventsInquirySucceed
      );
    }, 0);
    setTimeout(() => {
      apiService.queryForecastByEvent(
        props.news_origin.value, // provider
        props.event.title, // title
        props.pair, // pair
        props.event.currency, // currency
        props.event.date, // time
        props.page, // page
        props.index, // index
        config.inquiry.max_perpage, //perpage
        config.inquiry.avg_forecast_size, // max
        onForecastInquirySucceed
      );
    }, 500);
    setTimeout(() => {
      apiService.queryVolatilityByEvent(
        props.news_origin.value, // provider
        props.event.title, // title
        props.pair, // pair
        props.event.currency, // currency
        props.event.date, // time
        props.page, // page
        props.index, // index
        config.inquiry.max_perpage, //perpage
        config.inquiry.avg_volatility_size, // max
        onVolatilityInquirySucceed
      );
    }, 1000);
    setTimeout(() => {
      apiService.querySwingByEvent(
        props.news_origin.value, // provider
        props.event.title, // title
        props.pair, // pair
        props.event.currency, // currency
        props.event.date, // time
        props.page, // page
        props.index, // index
        config.inquiry.max_perpage, //perpage
        config.inquiry.avg_swing_size, // max
        onSwingInquirySucceed
      );
    }, 500);

    //--- Setup events bus listeners ---
    eventBus.on(options.eventbus.SWITCH_TAB, (tab) => {
      tabChoice.value = tab;
      if (tab == "volatility") {
        const eventName = options.eventbus.RENDER_VOLATILITY + "_" + props.id;
        if (volatilityObj.value.main) {
          setTimeout(() => {
            eventBus.emit(eventName, volatilityObj.value);
          }, 500);
        } else {
          setTimeout(() => {
            eventBus.emit(eventName, null);
          }, 500);
        }
      }
      if (tab == "forecast") {
        const eventName = options.eventbus.RENDER_FORECAST + "_" + props.id;
        if (forecastObj.value.total) {
          setTimeout(() => {
            eventBus.emit(eventName, forecastObj.value);
          }, 500);
        } else {
          setTimeout(() => {
            eventBus.emit(eventName, null);
          }, 500);
        }
      }
      if (tab == "behavior") {
        const eventName = options.eventbus.RENDER_SWING + "_" + props.id;
        if (swingObj.value.main) {
          setTimeout(() => {
            eventBus.emit(eventName, swingObj.value);
          }, 500);
        } else {
          setTimeout(() => {
            eventBus.emit(eventName, null);
          }, 500);
        }
      }
    });

    eventBus.on(options.eventbus.OTHERS_IMPACT, (impact) => {
      impactObj.value = impact;
    });

    return {
      behaviorRef,
      forecastRef,
      volitilityRef,
      news: newsObj,
      util: utilObj,
      pair: pairObj,
      tab: tabChoice,
      elId: props.id,
      event: resultObj.value,
      timeframe: timeframeObj,
      othersImpact: impactObj,
      otherEvents: otherEventsArray,

      onTabChanged: function (ev) {
        eventBus.emit(options.eventbus.SWITCH_TAB, ev);
      },
    };
  },
});
</script>
