<template>
  <q-page-container class="bg-auth">
    <q-page class="flex flex-center">
      <q-card square class="shadow-12" style="width: 350px; height: 350px">
        <q-card-section class="bg-primary">
          <h4 class="text-h5 text-white q-my-md">Login</h4>
        </q-card-section>
        <q-card-section style="margin-top: -60px">
          <q-form class="q-px-sm q-pt-xl">
            <q-input
              square
              clearable
              v-model="credential.email"
              type="email"
              label="Email"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
            <q-input
              square
              clearable
              v-model="credential.password"
              type="password"
              label="Password"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-lg">
          <q-btn
            @click="onSignInClicked"
            unelevated
            size="lg"
            color="primary"
            class="full-width text-white"
            label="Sign In"
          />
        </q-card-actions>
        <q-card-section class="text-center q-pa-sm">
          <q-btn
            flat
            color="primary"
            label="Forgot password?"
            @click="onForgotPasswordClicked"
          />
          <q-btn
            flat
            color="primary"
            label="Register?"
            @click="onRegisterClicked"
          />
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script>
/* eslint-disable */
import cookies from "js-cookie";
import { defineComponent, inject, ref } from "vue";
import { LocalDB } from "../stores/localdb.js";
import { useRouter } from "vue-router";
import { Util } from "../scripts/util.js";
import { ApiService } from "../services/api-service.js";

//--- Importing constants ---
import config from "../assets/config.json";
import options from "../assets/options.json";

export default defineComponent({
  name: "LoginPage",
  setup() {
    //-- Database related --
    const localdb = new LocalDB();

    //-- Removing necessary cookies
    cookies.remove(options.cookies.token);
    cookies.remove(options.cookies.token_exp);
    //-- Necessary objects --
    const util = Util;
    const eventBus = inject("evbus");
    const apiService = new ApiService(eventBus);

    //-- Login related --
    const credentialObj = ref({
      email: "",
      password: "",
    });
    //-- Navigation related --
    const router = useRouter();

    //--- Event handlers ---
    const onQueryNavLinksSucceed = function (data) {
      localdb.insert(options.links.key, data);
      if (data.length < 7) {
        router.push("/tutorial");
      } else {
        router.push("/search");
      }
    };

    const onSignInSucceed = function (token) {
      cookies.set(options.cookies.token, token.token);
      cookies.set(options.cookies.token_exp, token.expired);
      apiService.queryNavLinksByRole(onQueryNavLinksSucceed);
    };

    return {
      background: {
        image: {
          bg: require("../assets/frontbg.jpg"),
        },
      },
      credential: credentialObj,
      onRegisterClicked: function () {
        router.push("/register");
      },
      onForgotPasswordClicked: function () {
        router.push("/forget");
      },
      onSignInClicked: function () {
        if (credentialObj.value.email && credentialObj.value.password) {
          if (util.isEmail(credentialObj.value.email)) {
            apiService.login(
              credentialObj.value.email,
              credentialObj.value.password,
              onSignInSucceed
            );
          } else {
            eventBus.emit(
              options.eventbus.AUTH_ERROR,
              config.message.auth.wrong_email
            );
          }
        } else {
          eventBus.emit(
            options.eventbus.AUTH_ERROR,
            config.message.common.empty_fields
          );
        }
      },
    };
  },
});
</script>

<style>
.bg-auth {
  background-image: url("https://images.rawpixel.com/image_1000/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0zNzNiYXRjaDE2LTIwMC1rcGFwMjdkNy5qcGc.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
