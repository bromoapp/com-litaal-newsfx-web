<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-primary text-white" height-hint="64">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> {{ pageTitle }} </q-toolbar-title>
        <div>v1.0</div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="false"
      elevated
      overlay
      :width="260"
    >
      <q-list>
        <nav-button
          v-for="link in navlinks1"
          :key="link.title"
          v-bind="link"
          @click="onNavButtonClicked(link)"
        />
      </q-list>
      <q-separator inset class="q-my-sm" />
      <q-list>
        <nav-button
          v-for="link in navlinks2"
          :key="link.title"
          v-bind="link"
          @click="onNavButtonClicked(link)"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-4">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
/* eslint-disable */
import cookies from "js-cookie";
import { defineComponent, inject, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { LocalDB } from "../stores/localdb.js";
import { ApiService } from "../services/api-service.js";
import NavButton from "src/components/NavButton.vue";

//--- Importing constants ---
import options from "../assets/options.json";
import config from "../assets/config.json";

export default defineComponent({
  name: "DashboardLayout",
  components: {
    "nav-button": NavButton,
  },
  setup() {
    const q = useQuasar();
    const leftDrawerOpenVal = ref(false);
    const router = useRouter();
    const mainLinksArray = ref([]);
    const linksArray = ref(options.pages);
    const eventBus = inject("evbus");
    const apiService = new ApiService(eventBus);
    const pageTitleVal = ref("Search");

    //--- Setup events bus listeners ---
    const deleteCookies = function () {
      cookies.remove(options.cookies.token);
      cookies.remove(options.cookies.token_exp);
    };

    //-- Database related --
    const localdb = new LocalDB();

    const init = function () {
      //--- Setup events bus listeners ---
      eventBus.on(options.eventbus.INQUIRY_ERROR, (err) => {
        let msg;
        if (err.includes("Network Error")) {
          msg = config.message.common.network_error;
        } else {
          msg = err;
        }
        if (err.includes("401")) {
          localdb.clear();
          deleteCookies();
          router.push("/login");
        } else {
          q.dialog({
            title: "Alert",
            message: msg,
          });
        }
      });
      eventBus.on(options.eventbus.SHOW_INFO, (info) => {
        q.dialog({
          title: "Info",
          message: info,
          style: "width: 550px",
        });
      });
      eventBus.on(options.eventbus.CHANGE_TITLE, (title) => {
        pageTitleVal.value = title;
      });

      //--- Setup user main links ---
      let links = localdb.select(options.links.key);
      if (links) {
        mainLinksArray.value = links;
      }
    };
    init();
    return {
      pageTitle: pageTitleVal,
      navlinks1: mainLinksArray.value,
      navlinks2: linksArray.value.links,
      leftDrawerOpen: leftDrawerOpenVal,
      toggleLeftDrawer() {
        leftDrawerOpenVal.value = !leftDrawerOpenVal.value;
      },
      onNavButtonClicked(obj) {
        if (obj.title != "Logout") {
          if (obj.link == "/search") {
            localdb.remove(options.search.key);
          }
          router.push(obj.link);
        } else {
          localdb.clear();
          cookies.remove();
          apiService.logout();
          setTimeout(() => {
            router.push("/login");
          }, 500);
        }
      },
    };
  },
});
</script>

<style scoped>
.top-header {
  z-index: 5000 !important;
}

.below-header {
  margin-top: 60px;
}
</style>
