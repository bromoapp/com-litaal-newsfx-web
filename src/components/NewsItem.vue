<template>
  <q-item clickable :key="index" v-ripple @dblclick="callback(item)">
    <q-item-section avatar style="min-width: 30px !important"
      ><q-img
        :src="util.setFlagIcon(item.country)"
        width="30px"
        height="30px"
        :title="item.country"
    /></q-item-section>
    <q-item-section>
      <q-item-label class="text-weight-bold">{{ item.title }}</q-item-label>
      <table style="border-spacing: 0; border-collapse: collapse">
        <tr style="font-size: x-small">
          <td style="margin: 0; padding: 0; width: 70px">Currency</td>
          <td style="margin: 0; padding: 0">
            :<b>&nbsp; {{ item.currency }} </b>
          </td>
        </tr>
        <tr style="font-size: x-small">
          <td style="margin: 0; padding: 0">Impact</td>
          <td style="margin: 0; padding: 0">
            <span :style="util.stylingImpact(item.impact)">
              :&nbsp; {{ util.translateImpact(item.impact) }}</span
            >
          </td>
        </tr>
        <tr v-if="show" style="font-size: x-small">
          <td style="margin: 0; padding: 0">Provider</td>
          <td style="margin: 0; padding: 0">:&nbsp; {{ item.provider }}</td>
        </tr>
      </table>
    </q-item-section>
  </q-item>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref } from "vue";
import { Util } from "../scripts/util.js";

export default defineComponent({
  name: "NewsItem",
  props: {
    navItem: Object,
    onDoubleClick: Function,
    showProvider: Boolean,
  },
  setup(props) {
    const utilObj = Util;
    const indexVal = ref(props.index);
    const navItem = ref(props.navItem);
    const callbackFunc = ref(props.onDoubleClick);
    const showProviderVal = ref(props.showProvider);
    return {
      util: utilObj,
      item: navItem,
      index: indexVal,
      show: showProviderVal,
      callback: callbackFunc,
    };
  },
});
</script>
