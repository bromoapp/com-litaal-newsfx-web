<template>
  <q-page v-if="showEventsList()" class="flex">
    <q-scroll-area id="results-list" bordered class="bg-grey-6 sr-scroll-area">
      <q-list
        v-if="foundEvent && foundEvent.uuid"
        separator
        style="margin-top: 50px"
      >
        <search-result
          v-for="pair in resultPairs"
          :id="'ri_' + foundEvent.uuid"
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
                  v-model="filter.resultList.timeframe"
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
          <q-input
            dense
            style="width: 300px"
            outlined
            clearable
            v-model="words"
            @keypress.enter.prevent="onEnterPressed"
            type="text"
          >
            <template v-slot:after>
              <q-btn
                color="primary"
                icon="search"
                @click="onSearchBtnClicked"
              />
            </template>
          </q-input>
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
          v-model="filter.eventsList.news"
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
          v-model="filter.eventsList.currency"
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
          :showProvider="true"
        />
      </q-virtual-scroll>
    </q-page-sticky>
    <!-- LEFT NAV PANEL -->
  </q-page>
  <q-page v-else class="flex flex-center">
    <q-form>
      <q-input
        dense
        style="width: 400px"
        outlined
        clearable
        v-model="words"
        @keypress.enter.prevent="onEnterPressed"
        type="text"
        hint="e.g. 'Nonfarm Payroll' of 'Consumer Price Index'"
      >
        <template v-slot:after>
          <q-btn color="primary" icon="search" @click="onSearchBtnClicked" />
        </template>
      </q-input>
    </q-form>
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

//-- Database related --
const localdb = new LocalDB();

export default defineComponent({
  name: "SearchPage",
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

    const key = "SEARCH";
    const utilObj = Util;
    const eventBus = inject("evbus");
    const apiService = new ApiService(eventBus);

    //--- Select options related arrays ---
    const currPageVal = ref(null);
    const resultPages = ref(null);
    const foundEventObj = ref(null);
    const resultPairsArray = ref([]);
    const impactsArray = ref(options.impacts);
    const currencyArray = ref(options.currencies_4search);
    const timeframesArray = ref(options.timeframes);
    const newsProvidersArray = ref(options.news_providers_4search);

    //--- Add aditional value ---

    //--- Events list related objects ---
    const eventsArray = ref([]);
    const eventsListRef = ref(null);
    const eventsListIndex = ref(0);
    const eventsListCached = ref(localdb.select(key));

    const searchArgs = ref("");

    //--- Search params ---
    const searchParamObj = ref({
      timeframe: config.inquiry.default_timeframe,
      currency: { label: null, value: null },
      news: { label: null, value: null },
      words: null,
    });

    const filterObj = ref({
      eventsList: {
        news: {
          label: "ALL",
          value: "ALL",
        },
        impact: {
          label: "ALL",
          value: "ALL",
        },
        currency: {
          label: "ALL",
          value: "ALL",
        },
      },
      resultList: {
        timeframe: "M15",
      },
    });

    //--- Callbacks functions ---
    const onSearchInquirySucceed = function (data) {
      localdb.insert(key, data);
      eventsArray.value = data.events;
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
    const executeSearchInquiryByWords = function () {
      filterObj.value.eventsList.impact = {
        label: "ALL",
        value: "ALL",
      };
      let words = searchArgs.value;
      if (words && words.length > 0) {
        apiService.queryNavItemsByWords(words, onSearchInquirySucceed);
      }
    };

    const filterEventsList = function () {
      let currImpact = filterObj.value.eventsList.impact.label;
      let currCurrency = filterObj.value.eventsList.currency.value;
      let currNews = filterObj.value.eventsList.news.value;
      try {
        let list = localdb.select(key).events;

        if (currImpact != "ALL") {
          list = list.filter((o) => {
            return o.impact == filterObj.value.eventsList.impact.value;
          });
        }
        if (currCurrency != "ALL") {
          list = list.filter((o) => {
            return o.currency == filterObj.value.eventsList.currency.value;
          });
        }
        if (currNews != "ALL") {
          list = list.filter((o) => {
            return (
              o.provider == filterObj.value.eventsList.news.value.toLowerCase()
            );
          });
        }

        eventsArray.value = list;
      } catch (err) {
        //Ignore
      }
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

    const isEventsListShowed = function () {
      let status = false;
      if (
        eventsArray.value.length == 0 &&
        localdb.select(key) &&
        localdb.select(key).events.length > 0
      ) {
        status = true;
      } else if (eventsArray.value.length > 0) {
        status = true;
      }
      return status;
    };

    const resetResults = function () {
      currPageVal.value = null;
      resultPages.value = null;
      foundEventObj.value = null;
      resultPairsArray.value = [];
    };

    setTimeout(() => {
      eventBus.emit(options.eventbus.CHANGE_TITLE, "Search");
      let cached = localdb.select(key);
      if (cached && cached.events && cached.events.length > 0) {
        eventsArray.value = cached.events;
      }
    }, 500);

    return {
      //--- Simple search page objects & event handlers ---
      words: searchArgs,
      events: eventsArray,
      onSearchBtnClicked: function () {
        if (isEventsListShowed()) {
          resetResults();
        }
        localdb.remove(key);
        executeSearchInquiryByWords();
      },
      onEnterPressed: function () {
        if (isEventsListShowed()) {
          resetResults();
        }
        localdb.remove(key);
        executeSearchInquiryByWords();
      },

      //--- Complex search page objects & event handlers ---
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
      cachedEvents: eventsListCached,
      newsProviders: newsProvidersArray,

      showEventsList: function () {
        return isEventsListShowed();
      },
      onVirtualScroll: function ({ index }) {
        eventsListIndex.value = index;
      },
      onNewsSelectionChanged: function (ev) {
        filterObj.value.eventsList.news = ev;
        filterEventsList();
      },
      onCurrencySelectionChanged: function (ev) {
        filterObj.value.eventsList.currency = ev;
        filterEventsList();
      },
      onImpactSelectionChanged: function (ev) {
        filterObj.value.eventsList.impact = ev;
        filterEventsList();
      },
      onEventDoubleClicked: function (o) {
        resetResults();
        searchParamObj.value.words = o.title;
        searchParamObj.value.currency.value = o.currency;
        searchParamObj.value.news.value = o.provider.toUpperCase();
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
    el.style.height = getProperHeight() - 150 + "px";
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
