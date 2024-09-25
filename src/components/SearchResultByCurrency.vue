<template>
  <q-item class="sr-list-item">
    <div style="width: 100%; margin: 0" class="bg-white sr-event-panel">
      <table style="border-spacing: 3px" class="sr-table-panel">
        <tr>
          <td style="width: 50%; vertical-align: top">
            <price-candles-chart
              v-if="pair"
              :id="elId"
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
            <div class="sr-event-panel" style="height: 489px; max-width: 100%">
              <div style="height: 400px">
                <volatility :id="elId" ref="volatilityRef" />
              </div>
              <div style="padding-right: 5px; margin-top: 50px">
                <q-btn
                  dense
                  color="primary"
                  icon-right="send"
                  style="margin-right: 1px !important"
                  class="float-right"
                  label="&nbsp;&nbsp;GOTO PAIR&nbsp;"
                  @click="onGotoPairBtnClicked"
                />
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </q-item>
</template>

<script>
/* eslint-disable */
import { defineComponent, inject, ref } from "vue";
import { useRouter } from "vue-router";
import { Util } from "../scripts/util.js";
import Volatility from "./Volatility.vue";
import { LocalDB } from "src/stores/localdb";
import PriceCandlesChart from "./PriceCandlesChart.vue";
import { ApiService } from "../services/api-service.js";

//--- Importing constants ---
import config from "../assets/config.json";
import options from "../assets/options.json";

export default defineComponent({
  name: "SearchResultByCurrency",
  props: {
    id: String,
    page: Number,
    pair: String,
    index: Number,
    event: Object,
    timeframe: String,
    news_origin: Object,
  },
  components: {
    volatility: Volatility,
    "price-candles-chart": PriceCandlesChart,
  },
  setup(props) {
    const utilObj = Util;
    const router = useRouter();
    const localdb = new LocalDB();
    const pairObj = ref(props.pair);
    const eventBus = inject("evbus");
    const resultObj = ref(props.event);
    const timeframeObj = ref(props.timeframe);
    const apiService = new ApiService(eventBus);

    const volatilityObj = ref({});
    const volatilityRef = ref(null);

    const onVolatilityInquirySucceed = function (data) {
      volatilityObj.value = data;
      volatilityRef.value?.renderData(data);
    };

    const getNewsProviderByValue = function (provider) {
      let selected;
      options.news_providers.forEach((o) => {
        if (o.value == provider) {
          selected = o;
        }
      });
      return selected;
    };

    const getPairByValue = function (pair) {
      let selected;
      options.pairs.forEach((o) => {
        if (o.value == pair) {
          selected = o;
        }
      });
      return selected;
    };

    setTimeout(() => {
      apiService.queryVolatilityByEvent(
        props.news_origin.value, // provider
        props.event.title, // title
        props.pair, // pair
        props.event.currency, // currency
        props.event.date, // time
        props.page, // page
        props.index, // index
        1, //perpage
        config.inquiry.avg_volatility_size, // max
        onVolatilityInquirySucceed
      );
    }, 200);
    return {
      util: utilObj,
      pair: pairObj,
      volatilityRef,
      elId: props.id,
      event: resultObj.value,
      timeframe: timeframeObj,

      onGotoPairBtnClicked: function () {
        let search = {
          currency: props.event.currency,
          title: props.event.title,
          provider: getNewsProviderByValue(props.news_origin.value),
          pair: getPairByValue(props.pair),
        };
        localdb.insert(options.search.args, search);
        router.push("/onepair");
      },
    };
  },
});
</script>
