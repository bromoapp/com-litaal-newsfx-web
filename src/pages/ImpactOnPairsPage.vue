<template>
  <q-page class="flex">
    <q-scroll-area id="results-list" bordered class="bg-grey-6 sr-scroll-area">
      <q-list
        v-if="foundEvent && foundEvent.uuid"
        separator
        style="margin-top: 50px"
      >
        <search-result
          v-for="pair in resultPairs"
          :id="'ri_' + pair + '_' + foundEvent.uuid"
          :key="pair"
          :page="currPage"
          :event="foundEvent"
          :index="foundEvent.index"
          :pair="pair"
          :timeframe="search.timeframe"
          :news_origin="search.news"
        />
      </q-list>
      <!-- TOP TOOLBAR PANEL -->
      <q-page-sticky expand position="top" class="bg-white top-pane">
        <q-toolbar class="text-white">
          <q-space />
          <table>
            <tr>
              <td v-if="pages && currPage" class="paging-col">
                <q-pagination
                  class="paging-nav"
                  v-model="currPage"
                  color="primary"
                  :max="pages"
                  :max-pages="6"
                  @update:model-value="onPageNoSelectionChanged"
                  boundary-numbers
                />
              </td>
              <td style="width: 124px">
                <q-select
                  dense
                  outlined
                  v-model="search.timeframe"
                  :options="timeframeOpts"
                  @update:model-value="onTimeframeSelectionChanged"
                  class="timeframe-options"
                  stack-label
                  label="Timeframe"
                />
              </td>
            </tr>
          </table>
          <q-space />
        </q-toolbar>
      </q-page-sticky>
      <!-- TOP TOOLBAR PANEL -->
    </q-scroll-area>
    <!-- LEFT NAV PANEL -->
    <q-page-sticky expand position="left" class="bg-white left-pane">
      <q-toolbar style="margin-bottom: -4px">
        <q-select
          dense
          outlined
          @update:model-value="onNewsSelectionChanged"
          :options="newsProviders"
          v-model="search.news"
          class="news-providers-options"
          stack-label
          label="News provider"
        />
      </q-toolbar>
      <q-toolbar>
        <q-space />
        <q-select
          dense
          outlined
          @update:model-value="onCurrencySelectionChanged"
          v-model="search.currency"
          :options="currencyOpts"
          class="curr-options"
          stack-label
          label="Currency"
        />
        <q-select
          dense
          outlined
          @update:model-value="onImpactSelectionChanged"
          v-model="filter.eventsList.impact"
          :options="impactsOpts"
          class="impact-options"
          stack-label
          label="Impact"
        />
        <q-space />
      </q-toolbar>
      <q-toolbar class="event-input">
        <q-space />
        <q-input
          dense
          outlined
          type="textarea"
          rows="2"
          @keyup="onSearchWordsChanged"
          class="seach-text"
          v-model="search.words"
          label="Event"
        />
        <q-space />
      </q-toolbar>
      <q-virtual-scroll
        ref="eventsListRef"
        id="events-list"
        style="width: 100%"
        :items="events"
        separator
        @virtual-scroll="onVirtualScroll"
        v-slot="{ item }"
      >
        <news-item
          :key="item.id"
          :navItem="item"
          :onDoubleClick="onEventDoubleClicked"
          :showProvider="false"
        />
      </q-virtual-scroll>
    </q-page-sticky>
    <!-- LEFT NAV PANEL -->
  </q-page>
</template>

<script>
/* eslint-disable */
import { Util } from "../scripts/util.js";
import { LocalDB } from "../stores/localdb.js";
import NewsItem from "../components/NewsItem.vue";
import { defineComponent, inject, ref } from "vue";
import { ApiService } from "../services/api-service.js";
import SearchResultByCurrency from "../components/SearchResultByCurrency.vue";

//--- Importing constants ---
import config from "../assets/config.json";
import options from "../assets/options.json";

export default defineComponent({
  name: "ImpactOnPairsPage",
  components: {
    "news-item": NewsItem,
    "search-result": SearchResultByCurrency,
  },
  mounted() {
    setTimeout(() => {
      resizeEventsList();
      resizeResultsList();
    }, 500);
  },
  setup() {
    //--- Adding window resize event handlers
    window.addEventListener("resize", resizeEventsList);
    window.addEventListener("resize", resizeResultsList);

    //-- Necessary objects --
    const eventBus = inject("evbus");
    const apiService = new ApiService(eventBus);
    const utilObj = Util;

    //-- Database related --
    const localdb = new LocalDB();

    //--- Select options related arrays ---
    const currPageVal = ref(null);
    const resultPages = ref(null);
    const foundEventObj = ref(null);
    const resultPairsArray = ref([]);
    const impactsArray = ref(options.impacts);
    const currencyArray = ref(options.currencies);
    const timeframesArray = ref(options.timeframes);
    const newsProvidersArray = ref(options.news_providers);

    //--- Events list related objects ---
    const eventsListRef = ref(null);
    const eventsListIndex = ref(0);
    const eventsArray = ref([]);

    //--- Search params ---
    const searchParamObj = ref({
      timeframe: config.inquiry.default_timeframe,
      currency: config.inquiry.default_currency,
      news: config.inquiry.default_news,
      words: "",
    });
    const filterObj = ref({
      eventsList: {
        impact: {
          label: "ALL",
          value: null,
        },
      },
    });

    // Execute inquiry for events list
    setTimeout(() => {
      eventBus.emit(options.eventbus.CHANGE_TITLE, "Impact on Many Pairs");
      queryNavItemsListIfNecessary();
    }, 500);

    //--- Callbacks functions ---
    const onEventsInquiryByCurrencySucceed = function (data) {
      let key = searchParamObj.value.news.value + "_" + data.currency;
      eventsArray.value = data.events;
      localdb.insert(key, data);
      setTimeout(() => {
        filterEventsList();
      }, 500);
    };

    const onEventsInquiryByTitleForPairsSucceed = function (data) {
      currPageVal.value = data.number;
      resultPages.value = data.totalPages;
      foundEventObj.value = data.content[0];
      let pairs = utilObj.getPairsByCurrency(data.content[0].currency);
      pairs.forEach((a) => {
        resultPairsArray.value.push(a);
      });
    };

    //--- Private functions ---
    const executeNavItemsInquiryByCurrency = function () {
      filterObj.value.eventsList.impact = { label: "ALL", value: null };
      let currency = searchParamObj.value.currency.value;
      let provider = searchParamObj.value.news.value;
      if (currency && provider) {
        apiService.queryNavItemsByCurrency(
          provider,
          currency,
          onEventsInquiryByCurrencySucceed
        );
      }
    };

    const queryNavItemsListIfNecessary = function () {
      searchParamObj.value.words = null;
      let key =
        searchParamObj.value.news.value +
        "_" +
        searchParamObj.value.currency.value;
      let record = localdb.select(key);
      if (!record) {
        executeNavItemsInquiryByCurrency();
      } else {
        let exipired = record.expired;
        if (utilObj.isExpired(exipired)) {
          executeNavItemsInquiryByCurrency();
        } else {
          eventsArray.value = record.events;
          filterEventsList();
        }
      }
    };

    const filterEventsList = function () {
      let key =
        searchParamObj.value.news.value +
        "_" +
        searchParamObj.value.currency.value;
      let currImpact = filterObj.value.eventsList.impact.label;
      let list = localdb.select(key).events;

      if (currImpact != "ALL") {
        list = list.filter((o) => {
          return o.impact == filterObj.value.eventsList.impact.value;
        });
      }

      let searchWords = searchParamObj.value.words;
      if (searchWords) {
        list = list.filter((o) => {
          return o.title
            .toLowerCase()
            .includes(searchWords.toLowerCase().trim());
        });
      }
      eventsArray.value = list;
      setTimeout(() => {
        resizeEventsList();
        scrollUp("events-list");
      }, 500);
    };

    const queryEventsByTitleForPairs = function (pgno) {
      let provider = searchParamObj.value.news.value;
      let title = searchParamObj.value.words;
      let curr = searchParamObj.value.currency.value;
      let page = pgno;
      if (provider && title && curr && page) {
        apiService.queryEventsByTitleForPairs(
          provider,
          curr,
          title,
          page,
          onEventsInquiryByTitleForPairsSucceed
        );
      }
    };

    const resetResults = function () {
      currPageVal.value = null;
      resultPages.value = null;
      foundEventObj.value = null;
      resultPairsArray.value = [];
    };
    return {
      //--- Exposing variables and methods to components in template ---
      util: utilObj,
      eventsListRef,
      eventsListIndex,
      filter: filterObj,
      pages: resultPages,
      events: eventsArray,
      currPage: currPageVal,
      search: searchParamObj,
      foundEvent: foundEventObj,
      impactsOpts: impactsArray,
      currencyOpts: currencyArray,
      resultPairs: resultPairsArray,
      timeframeOpts: timeframesArray,
      newsProviders: newsProvidersArray,

      //--- User events handlers---
      onVirtualScroll: function ({ index }) {
        eventsListIndex.value = index;
      },
      onNewsSelectionChanged: function (ev) {
        resetResults();
        searchParamObj.value.news = ev;
        queryNavItemsListIfNecessary();
      },
      onCurrencySelectionChanged: function (ev) {
        resetResults();
        searchParamObj.value.words = "";
        searchParamObj.value.currency = ev;
        searchParamObj.value.impact = { label: "ALL" };
        queryNavItemsListIfNecessary();
      },
      onImpactSelectionChanged: function (ev) {
        filterObj.value.eventsList.impact = ev;
        searchParamObj.value.words = "";
        filterEventsList();
      },
      onSearchWordsChanged: function () {
        filterEventsList();
      },
      onEventDoubleClicked: function (o) {
        resetResults();
        searchParamObj.value.words = o.title;
        let page = 1;
        queryEventsByTitleForPairs(page);
      },
      onTimeframeSelectionChanged: function (ev) {
        eventBus.emit(options.eventbus.CHART_MESSAGE, ev);
      },
      onPageNoSelectionChanged: function (ev) {
        resultPairsArray.value = [];
        queryEventsByTitleForPairs(ev);
      },
    };
  },
});

//--- methods to helping resizing components on window resize event ---
const resizeEventsList = function () {
  let el = document.getElementById("events-list");
  if (el) {
    el.style.height = getProperHeight() - 218 + "px";
  }
};

const resizeResultsList = function () {
  let el = document.getElementById("results-list");
  if (el) {
    el.style.height = getProperHeight() - 50 + "px";
  }
};

const getProperHeight = function () {
  var height = 0;
  var body = window.document.body;
  if (window.innerHeight) {
    height = window.innerHeight;
  } else if (body.parentElement.clientHeight) {
    height = body.parentElement.clientHeight;
  } else if (body && body.clientHeight) {
    height = body.clientHeight;
  }
  return height;
};

const scrollUp = function (id) {
  let el = document.getElementById(id);
  el.scrollTop = 0;
};
</script>
