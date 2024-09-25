<template>
  <table style="border-spacing: 3px" class="sr-table-panel">
    <tr>
      <td colspan="2">
        <span class="sr-large-font"><b>A. Main event</b></span>
        <span v-if="ev.description"
          >&nbsp;<q-icon
            class="cursor-pointer"
            @click="onInfoClicked"
            style="color: red; font-size: 20px; margin-top: -2px"
            name="help_center"
          />
        </span>
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
          <tr>
            <td>
              <q-img
                :src="setIcon(ev.country)"
                width="12px"
                height="12px"
                :title="ev.country"
              />
            </td>
            <td style="padding-left: 5px !important">
              <b>{{ ev.title }}</b>
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
import { defineComponent, ref, inject } from "vue";
import { Util } from "../scripts/util.js";
import options from "../assets/options.json";

export default defineComponent({
  name: "MainEvent",
  props: {
    event: Object,
  },
  setup(props) {
    const utilObj = Util;
    const eventBus = inject("evbus");
    const evObj = ref(props.event);
    return {
      ev: evObj,
      setIcon: utilObj.setFlagIcon,
      translateImpact: utilObj.translateImpact,
      stylingImpact: utilObj.stylingImpact,
      coloringResult: utilObj.coloringResult,
      onInfoClicked: function () {
        eventBus.emit(options.eventbus.SHOW_INFO, evObj.value.description);
      },
    };
  },
});
</script>
