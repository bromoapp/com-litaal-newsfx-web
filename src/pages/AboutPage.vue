<template>
  <q-page class="flex flex-center">ABOUT</q-page>
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
      eventBus.emit(options.eventbus.CHANGE_TITLE, "About Us");
    }, 500);
  },
});
</script>
