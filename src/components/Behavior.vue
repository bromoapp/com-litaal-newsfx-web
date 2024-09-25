<template>
  <div v-if="showPanel">
    <table style="border-spacing: 3px" class="sr-table-panel">
      <tr>
        <td style="width: 50%">
          <span class="sr-large-font"
            ><b
              >A. This event's swings
              <span class="sr-small-font">(pips)</span></b
            ></span
          >
        </td>
        <td>
          <span class="sr-large-font"
            ><b
              >B. Avg swings in the last 12 occurrences
              <span class="sr-small-font">(pips)</span></b
            ></span
          >
        </td>
      </tr>
      <tr>
        <td style="width: 50%">
          <table class="sr-table-panel">
            <tr class="bg-grey-5">
              <th style="width: 15%">Swing</th>
              <th style="width: 17%">1 M</th>
              <th style="width: 17%">5 M</th>
              <th style="width: 17%">15 M</th>
              <th style="width: 17%">30 M</th>
              <th style="width: 17%">1 H</th>
            </tr>
            <tr v-if="swing.main != null">
              <td style="width: 15%; text-align: center">
                <q-icon
                  size="1.5rem"
                  name="call_missed_outgoing"
                  style="transform: scaleY(-1); color: red"
                />
              </td>
              <td v-if="swing.main.swingUp.m1" class="text-center">
                <b class="sr-large-font">{{ swing.main.swingUp.m1 }}</b>
              </td>
              <td v-else class="text-center">
                <b class="sr-large-font">0.0</b>
              </td>
              <td v-if="swing.main.swingUp.m5" class="text-center">
                <b class="sr-large-font">{{ swing.main.swingUp.m5 }}</b>
              </td>
              <td v-else class="text-center">
                <b class="sr-large-font">0.0</b>
              </td>
              <td v-if="swing.main.swingUp.m15" class="text-center">
                <b class="sr-large-font">{{ swing.main.swingUp.m15 }}</b>
              </td>
              <td v-else class="text-center">
                <b class="sr-large-font">0.0</b>
              </td>
              <td v-if="swing.main.swingUp.m30" class="text-center">
                <b class="sr-large-font">{{ swing.main.swingUp.m30 }}</b>
              </td>
              <td v-else class="text-center">
                <b class="sr-large-font">0.0</b>
              </td>
              <td v-if="swing.main.swingUp.h1" class="text-center">
                <b class="sr-large-font">{{ swing.main.swingUp.h1 }}</b>
              </td>
              <td v-else class="text-center">
                <b class="sr-large-font">0.0</b>
              </td>
            </tr>
            <tr class="bg-grey-4" v-if="swing.main != null">
              <td style="width: 15%; text-align: center">
                <q-icon
                  size="1.5rem"
                  name="call_missed_outgoing"
                  color="green"
                />
              </td>
              <td v-if="swing.main.swingDown.m1" class="text-center">
                <b class="sr-large-font">{{ swing.main.swingDown.m1 }}</b>
              </td>
              <td v-else class="text-center">
                <b class="sr-large-font">0.0</b>
              </td>
              <td v-if="swing.main.swingDown.m5" class="text-center">
                <b class="sr-large-font">{{ swing.main.swingDown.m5 }}</b>
              </td>
              <td v-else class="text-center">
                <b class="sr-large-font">0.0</b>
              </td>
              <td v-if="swing.main.swingDown.m15" class="text-center">
                <b class="sr-large-font">{{ swing.main.swingDown.m15 }}</b>
              </td>
              <td v-else class="text-center">
                <b class="sr-large-font">0.0</b>
              </td>
              <td v-if="swing.main.swingDown.m30" class="text-center">
                <b class="sr-large-font">{{ swing.main.swingDown.m30 }}</b>
              </td>
              <td v-else class="text-center">
                <b class="sr-large-font">0.0</b>
              </td>
              <td v-if="swing.main.swingDown.h1" class="text-center">
                <b class="sr-large-font">{{ swing.main.swingDown.h1 }}</b>
              </td>
              <td v-else class="text-center">
                <b class="sr-large-font">0.0</b>
              </td>
            </tr>
            <tr v-else>
              <td colspan="5" class="text-center">N/A</td>
            </tr>
          </table>
        </td>
        <td>
          <table class="sr-table-panel">
            <tr class="bg-grey-5">
              <th style="width: 15%">Swing</th>
              <th style="width: 17%">1 M</th>
              <th style="width: 17%">5 M</th>
              <th style="width: 17%">15 M</th>
              <th style="width: 17%">30 M</th>
              <th style="width: 17%">1 H</th>
            </tr>
            <tr v-if="swing.average != null">
              <td style="width: 15%; text-align: center">
                <q-icon
                  size="1.5rem"
                  name="call_missed_outgoing"
                  style="transform: scaleY(-1); color: red"
                />
              </td>
              <td v-if="swing.average" class="text-center">
                <b class="sr-large-font">{{ swing.average.swingUp.m1 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="swing.average" class="text-center">
                <b class="sr-large-font">{{ swing.average.swingUp.m5 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="swing.average" class="text-center">
                <b class="sr-large-font">{{ swing.average.swingUp.m15 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="swing.average" class="text-center">
                <b class="sr-large-font">{{ swing.average.swingUp.m30 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="swing.average" class="text-center">
                <b class="sr-large-font">{{ swing.average.swingUp.h1 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
            </tr>
            <tr class="bg-grey-4" v-if="swing.average != null">
              <td style="width: 15%; text-align: center">
                <q-icon
                  size="1.5rem"
                  name="call_missed_outgoing"
                  color="green"
                />
              </td>
              <td v-if="swing.average" class="text-center">
                <b class="sr-large-font">{{ swing.average.swingDown.m1 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="swing.average" class="text-center">
                <b class="sr-large-font">{{ swing.average.swingDown.m5 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="swing.average" class="text-center">
                <b class="sr-large-font">{{ swing.average.swingDown.m15 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="swing.average" class="text-center">
                <b class="sr-large-font">{{ swing.average.swingDown.m30 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
              <td v-if="swing.average" class="text-center">
                <b class="sr-large-font">{{ swing.average.swingDown.h1 }}</b>
              </td>
              <td v-else class="text-center">N/A</td>
            </tr>
            <tr v-else>
              <td colspan="5" class="text-center">N/A</td>
            </tr>
          </table>
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
import { defineComponent, inject, ref, getCurrentInstance } from "vue";

//--- Importing constants ---
import config from "../assets/config.json";
import options from "../assets/options.json";

export default defineComponent({
  name: "Swing",
  props: {
    id: String,
  },
  methods: {
    forceUpdate(data) {
      this.swing = data;
      this.showPanel = true;
    },
  },
  setup(props, { expose }) {
    const swingObj = ref({});
    const showPanelVal = ref(false);
    const eventBus = inject("evbus");
    const instance = getCurrentInstance();
    const emptyTextVal = ref("Loading...");

    expose({
      renderData(data) {
        if (data) {
          instance.ctx.forceUpdate(data);
        } else {
          emptyTextVal.value = "NO DATA";
        }
      },
    });

    const eventName = options.eventbus.RENDER_SWING + "_" + props.id;
    eventBus.on(eventName, (data) => {
      if (data) {
        swingObj.value = data;
        showPanelVal.value = true;
      } else {
        emptyTextVal.value = "NO DATA";
      }
    });
    return {
      config,
      elId: props.id,
      showPanel: showPanelVal,
      emptyText: emptyTextVal,
      swing: swingObj,
    };
  },
});
</script>
