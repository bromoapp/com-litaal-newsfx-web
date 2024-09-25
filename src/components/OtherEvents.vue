<template>
  <table
    style="margin-top: 4px; padding: 0; border-spacing: 3px"
    class="sr-table-panel"
  >
    <tr>
      <td colspan="2">
        <span class="sr-large-font"
          ><b>B. Other events in the same time</b></span
        >
      </td>
    </tr>
    <tr>
      <td>
        <table class="sr-table-panel sr-small-font">
          <tr class="bg-grey-5">
            <th>#</th>
            <th class="sr-event-col">Event</th>
            <th style="width: 50px">Imp</th>
            <th style="width: 80px">Act</th>
            <th style="width: 80px">Pre</th>
            <th style="width: 80px">For</th>
            <th style="width: 100px">Act vs Pre</th>
            <th style="width: 100px">Act vs For</th>
            <th style="width: 100px">For vs Pre</th>
          </tr>
          <tr v-for="ev in others" :key="ev">
            <td>
              <q-img
                :src="setIcon(ev.country)"
                width="12px"
                height="12px"
                :title="ev.country"
              />
            </td>
            <td style="padding-left: 5px !important">
              {{ ev.title }}
            </td>
            <td class="text-center">
              <span :class="stylingImpact(ev.impact)">{{
                translateImpact(ev.impact)
              }}</span>
            </td>
            <td v-if="ev.actual != null" class="text-center">
              {{ ev.actual }}
            </td>
            <td v-else class="text-center">-</td>
            <td v-if="ev.previous != null" class="text-center">
              {{ ev.previous }}
            </td>
            <td v-else class="text-center">-</td>
            <td v-if="ev.forecast != null" class="text-center">
              {{ ev.forecast }}
            </td>
            <td v-else class="text-center">-</td>
            <td class="text-center">
              <table
                class="sr-table-panel"
                v-if="ev.avp != null && ev.avpDiff != null"
              >
                <tr>
                  <td style="text-align: left">
                    <q-icon
                      size="1.2rem"
                      name="square"
                      :color="coloringResult(ev.avp)"
                    />
                  </td>
                  <td>
                    {{ ev.avpDiff }}
                  </td>
                </tr>
              </table>
              <span v-else>-</span>
            </td>
            <td class="text-center">
              <table class="sr-table-panel" v-if="ev.avf != null && ev.avfDiff">
                <tr>
                  <td style="text-align: left">
                    <q-icon
                      size="1.2rem"
                      name="square"
                      :color="coloringResult(ev.avf)"
                    />
                  </td>
                  <td>{{ ev.avfDiff }}</td>
                </tr>
              </table>
              <span v-else>-</span>
            </td>
            <td class="text-center">
              <table
                class="sr-table-panel"
                v-if="ev.fvp != null && ev.fvpDiff != null"
              >
                <tr>
                  <td style="text-align: left">
                    <q-icon
                      size="1.2rem"
                      name="square"
                      :color="coloringResult(ev.fvp)"
                    />
                  </td>
                  <td>
                    {{ ev.fvpDiff }}
                  </td>
                </tr>
              </table>
              <span v-else>-</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
/* eslint-disable */
import { defineComponent, inject, ref } from "vue";
import { Util } from "../scripts/util.js";

//--- Importing constants ---
import options from "../assets/options.json";

export default defineComponent({
  name: "OtherEvents",
  props: {
    impact: Object,
    otherEvents: Object,
  },
  setup(props) {
    const utilObj = Util;
    const othersArray = ref([]);
    const eventBus = inject("evbus");
    const currImpactObj = ref(props.impact);
    const othersConstant = ref(props.otherEvents);

    const filterOtherEventsList = function () {
      let list = [];
      othersConstant.value.forEach((e) => {
        list.push(e);
      });
      if (currImpactObj.value.label != "ALL") {
        list = list.filter((o) => {
          return o.impact == currImpactObj.value.value;
        });
      }
      othersArray.value = list;
    };

    //--- Setup events bus listeners ---
    eventBus.on(options.eventbus.OTHERS_IMPACT, (impact) => {
      if (othersConstant.value.length > 0) {
        currImpactObj.value = impact;
        filterOtherEventsList();
      }
    });

    if (othersConstant.value.length > 0) {
      othersConstant.value.forEach((o) => {
        othersArray.value.push(o);
      });
      filterOtherEventsList();
    }

    return {
      others: othersArray,
      setIcon: utilObj.setFlagIcon,
      stylingImpact: utilObj.stylingImpact,
      coloringResult: utilObj.coloringResult,
      translateImpact: utilObj.translateImpact,
    };
  },
});
</script>
