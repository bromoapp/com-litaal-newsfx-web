<template>
  <q-page class="flex flex-center">TUTORIAL</q-page>
</template>

<script>
/* eslint-disable */
import { defineComponent, inject } from "vue";

//--- Importing constants ---
import options from "../assets/options.json";

export default defineComponent({
  name: "ProfilePage",
  setup() {
    const eventBus = inject("evbus");

    setTimeout(() => {
      eventBus.emit(options.eventbus.CHANGE_TITLE, "Tutorial");
    }, 500);
  },
});
</script>
