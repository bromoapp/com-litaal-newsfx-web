<template>
  <q-page class="flex flex-center">PROFILE</q-page>
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
      eventBus.emit(options.eventbus.CHANGE_TITLE, "Profile");
    }, 500);
  },
});
</script>
