<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-grey">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
/* eslint-disable */
import { defineComponent, inject } from "vue";
import { useQuasar } from "quasar";

//--- Importing constants ---
import options from "../assets/options.json";
import config from "../assets/config.json";

export default defineComponent({
  name: "IndexLayout",
  setup() {
    const q = useQuasar();
    const eventBus = inject("evbus");

    //--- Setup events bus listeners ---
    const setListeners = function () {
      eventBus.on(options.eventbus.AUTH_ERROR, (err) => {
        let msg;
        if (err.includes("401")) {
          msg = config.message.auth.wrong_credential;
        } else if (err.includes("Network Error")) {
          msg = config.message.common.network_error;
        } else {
          msg = err;
        }
        q.dialog({
          title: "Alert",
          message: msg,
        });
      });
    };

    setListeners();
  },
});
</script>
