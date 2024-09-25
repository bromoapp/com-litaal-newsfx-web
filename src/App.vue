<template>
  <router-view />
</template>

<script>
/* eslint-disable */
import cookies from "js-cookie";
import { use } from "echarts/core";
import { defineComponent } from "vue";
import { Util } from "./scripts/util.js";
import { useRouter, useRoute } from "vue-router";
import { CanvasRenderer } from "echarts/renderers";
import { CandlestickChart } from "echarts/charts";
import { BarChart } from "echarts/charts";
import { LineChart } from "echarts/charts";
import { PieChart } from "echarts/charts";
import options from "./assets/options.json";

import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
} from "echarts/components";

use([
  PieChart,
  BarChart,
  LineChart,
  GridComponent,
  TitleComponent,
  CanvasRenderer,
  LegendComponent,
  CandlestickChart,
  TooltipComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
]);

export default defineComponent({
  name: "App",
  setup() {
    const router = useRouter();
    const route = useRoute();

    if (route.path == "/") {
      if (cookies.get(options.cookies.token) != null) {
        if (!Util.isExpired(cookies.get(options.cookies.token_exp))) {
          router.push("/search");
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    }
  },
});
</script>
