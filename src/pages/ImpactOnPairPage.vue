<template>
  <q-page class="flex">
    <q-scroll-area id="results-list" bordered class="bg-grey-6 sr-scroll-area">
      <q-list
        v-if="srcResults && srcResults.length > 0"
        separator
        style="margin-top: 50px"
      >
        <search-result
          v-for="item in srcResults"
          :id="'ri_' + item.uuid"
          :key="item.id"
          :page="currPage"
          :event="item"
          :index="item.index"
          :pair="search.pair.value"
          :timeframe="search.timeframe"
          :news_origin="search.news"
          :impact="filter.otherEvents.impact"
        />
      </q-list>
      <!-- TOP TOOLBAR PANEL -->
      <q-page-sticky expand position="top" class="bg-white top-pane"
        ><q-toolbar class="text-white">
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
              <td v-if="pages && currPage" style="width: 134px">
                <q-select
                  dense
                  outlined
                  v-model="filter.otherEvents.impact"
                  :options="impactsOpts"
                  @update:model-value="onShowImpactOfOthersChanged"
                  class="other-impact-options"
                  stack-label
                  label="Others Impact"
                />
              </td>
            </tr>
          </table>
          <q-space /> </q-toolbar
      ></q-page-sticky>
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
          @update:model-value="onPairSelectionChanged"
          v-model="search.pair"
          :options="pairsOpts"
          class="pair-options"
          stack-label
          label="Pair"
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
        ref="eventsListObj"
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
import SearchResultByPair from "src/components/SearchResultByPair.vue";

//--- Importing constants ---
import config from "../assets/config.json";
import options from "../assets/options.json";

export default defineComponent({
  name: "ImpactOnPairPage",
  components: {
    "news-item": NewsItem,
    "search-result": SearchResultByPair,
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
    const srcResultsArray = ref([]);
    const pairsArray = ref(options.pairs);
    const impactsArray = ref(options.impacts);
    const timeframesArray = ref(options.timeframes);
    const newsProvidersArray = ref(options.news_providers);

    //--- Events list related objects ---
    const eventsListObj = ref(null);
    const eventsListIndex = ref(0);
    const eventsArray = ref(options.news_providers);

    //--- Search params ---
    const searchParamObj = ref({
      timeframe: config.inquiry.default_timeframe,
      pair: config.inquiry.default_pair,
      news: config.inquiry.default_news,
      currency: null,
      words: "",
    });
    const filterObj = ref({
      eventsList: {
        impact: {
          label: "ALL",
          value: null,
        },
      },
      otherEvents: {
        impact: {
          label: "ALL",
        },
      },
    });

    // Execute inquiry for events list
    setTimeout(() => {
      eventBus.emit(options.eventbus.CHANGE_TITLE, "Impact on One Pair");
      queryNavItemsListIfNecessary();
      const searchArgs = localdb.select(options.search.args);
      if (searchArgs) {
        searchParamObj.value.news.value = searchArgs.provider.value;
        searchParamObj.value.words = searchArgs.title;
        searchParamObj.value.currency = searchArgs.currency;
        searchParamObj.value.pair = searchArgs.pair;
        queryEventsByTitleForPair(1);
      }
    }, 500);

    //--- Callbacks functions ---
    const onNavItemsInquiryForPairSucceed = function (data) {
      let key = searchParamObj.value.news.value + "_" + data.pair;
      eventsArray.value = data.events;
      localdb.insert(key, data);
      setTimeout(() => {
        filterEventsList();
      }, 500);
    };

    const onEventsInquiryByTitleForPairSucceed = function (data) {
      // Clear cached search args persisted on search/many pairs page
      let searchArgs = localdb.select(options.search.args);
      if (searchArgs) {
        localdb.remove(options.search.args);
      }

      currPageVal.value = data.number;
      resultPages.value = data.totalPages;
      srcResultsArray.value = data.content;
      const otherEventsImpact = filterObj.value.otherEvents.impact;
      if (otherEventsImpact.label != "ALL") {
        setTimeout(() => {
          eventBus.emit(options.eventbus.OTHERS_IMPACT, otherEventsImpact);
        }, 500);
      }
    };

    //--- Private functions ---
    const executeNavItemsInquiryByPair = function () {
      filterObj.value.eventsList.impact = { label: "ALL", value: null };
      let pair = searchParamObj.value.pair.value;
      let provider = searchParamObj.value.news.value;
      if (pair && provider) {
        apiService.queryNavItemsByPair(
          provider,
          pair,
          onNavItemsInquiryForPairSucceed
        );
      }
    };

    //--- Execute inquiry to API service
    const queryNavItemsListIfNecessary = function () {
      searchParamObj.value.words = null;
      let key =
        searchParamObj.value.news.value + "_" + searchParamObj.value.pair.value;
      let record = localdb.select(key);
      if (!record) {
        executeNavItemsInquiryByPair();
      } else {
        let exipired = record.expired;
        if (utilObj.isExpired(exipired)) {
          executeNavItemsInquiryByPair();
        } else {
          eventsArray.value = record.events;
          filterEventsList();
        }
      }
    };

    const filterEventsList = function () {
      let key =
        searchParamObj.value.news.value + "_" + searchParamObj.value.pair.value;
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
    const queryEventsByTitleForPair = function (pgno) {
      let provider = searchParamObj.value.news.value;
      let title = searchParamObj.value.words;
      let curr = searchParamObj.value.currency;
      let page = pgno;
      let max = config.inquiry.max_perpage;
      if (provider && title && curr && page && max) {
        apiService.queryEventsByTitleForPair(
          provider,
          curr,
          title,
          page,
          max,
          onEventsInquiryByTitleForPairSucceed
        );
      }
    };
    const resetResults = function () {
      resultPages.value = null;
      srcResultsArray.value = [];
      currPageVal.value = null;
    };
    return {
      //--- Exposing variables and methods to components in template ---
      util: utilObj,
      eventsListObj,
      eventsListIndex,
      filter: filterObj,
      pages: resultPages,
      events: eventsArray,
      currPage: currPageVal,
      pairsOpts: pairsArray,
      search: searchParamObj,
      impactsOpts: impactsArray,
      srcResults: srcResultsArray,
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
      onPairSelectionChanged: function (ev) {
        resetResults();
        setTimeout(() => {
          eventsListObj.value.scrollTo(1, "start-force");
        }, 500);

        searchParamObj.value.words = "";
        searchParamObj.value.pair = ev;
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
        resultPages.value = null;
        filterObj.value.otherEvents.impact = {
          label: "ALL",
        };
        searchParamObj.value.currency = o.currency;
        srcResultsArray.value = [];
        searchParamObj.value.words = o.title;
        let page = 1;
        queryEventsByTitleForPair(page);
      },
      onTimeframeSelectionChanged: function (ev) {
        eventBus.emit(options.eventbus.CHART_MESSAGE, ev);
      },
      onShowImpactOfOthersChanged: function (ev) {
        eventBus.emit(options.eventbus.OTHERS_IMPACT, ev);
      },
      onPageNoSelectionChanged: function (ev) {
        srcResultsArray.value = [];
        queryEventsByTitleForPair(ev);
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
