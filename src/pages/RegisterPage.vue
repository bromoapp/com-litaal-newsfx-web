<template>
  <q-page-container class="bg-auth">
    <q-page class="flex flex-center">
      <q-card square class="shadow-24" style="width: 700px; height: 460px">
        <q-card-section class="bg-primary">
          <h4 class="text-h5 text-white q-my-md">Registration</h4>
        </q-card-section>
        <q-card-section style="margin-top: -60px">
          <table style="width: 100%">
            <tr>
              <td style="width: 50%">
                <q-form class="q-px-sm q-pt-xl q-pb-lg">
                  <q-input
                    square
                    clearable
                    v-model="user.fname"
                    type="username"
                    label="Firstname"
                  >
                  </q-input>
                  <q-input
                    square
                    clearable
                    v-model="user.lname"
                    type="username"
                    label="Lastname"
                  >
                  </q-input>
                  <q-select
                    v-model="user.gender"
                    :options="genderOpts"
                    label="Gender"
                  />
                  <q-select
                    v-model="user.salutation"
                    :options="salutationOpts"
                    label="Salutation"
                  />
                </q-form>
              </td>
              <td>
                <q-form class="q-px-sm q-pt-xl q-pb-lg">
                  <q-select
                    v-model="user.birthYear"
                    :options="yearsOpts"
                    label="Year of Birth"
                  />
                  <q-input
                    square
                    clearable
                    v-model="user.work"
                    label="Job Title"
                  >
                  </q-input>
                  <q-select
                    v-model="user.country"
                    :options="countriesOpts"
                    label="Country"
                  />
                  <q-input
                    square
                    clearable
                    v-model="user.email"
                    type="email"
                    label="Email"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                </q-form>
              </td>
            </tr>
          </table>
        </q-card-section>
        <q-card-actions class="q-px-lg" style="margin-top: -25px">
          <q-btn
            unelevated
            size="lg"
            color="primary"
            class="full-width text-white"
            label="Sign Up"
            @click="onSignUpClicked"
          />
        </q-card-actions>
        <q-card-section class="text-center q-pa-sm" style="margin-top: -6px">
          <q-btn
            flat
            color="primary"
            label="Return to login"
            @click="onReturnToLoginClicked"
          />
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script>
/* eslint-disable */
import { defineComponent, inject, ref } from "vue";
import { useRouter } from "vue-router";
import options from "../assets/options.json";
import { ApiService } from "../services/api-service.js";

export default defineComponent({
  name: "RegisterPage",
  setup() {
    const eventBus = inject("evbus");
    const apiService = new ApiService(eventBus);

    const yearsArray = ref([]);
    const generateYears = function () {
      let startYear = new Date().getFullYear() - 18;
      let endYear = new Date().getFullYear() - 70;
      for (let n = startYear; n > endYear; n--) {
        yearsArray.value.push(n);
      }
    };
    generateYears();

    const onRegistrationSucceed = function (data) {
      router.push("/login");
      setTimeout(() => {
        eventBus.emit(
          options.eventbus.SHOW_INFO,
          config.message.auth.account_created
        );
      }, 1000);
    };

    const countriesArray = ref(options.countries);

    const userObj = ref({
      fname: "",
      lname: "",
      gender: "",
      birthYear: "",
      work: "",
      country: "",
      email: "",
      salutation: "",
    });
    const router = useRouter();
    return {
      user: userObj,
      genderOpts: ["MALE", "FEMALE", "OTHER"],
      yearsOpts: yearsArray,
      countriesOpts: countriesArray,
      salutationOpts: ["Mr", "Mrs", "Miss", "Ms"],

      onReturnToLoginClicked: function () {
        router.push("/login");
      },
      onSignUpClicked: function () {
        console.log("NEW USER", userObj.value);
        apiService.register(
          userObj.value.fname,
          userObj.value.lname,
          userObj.value.gender,
          userObj.value.salutation,
          userObj.value.birthYear,
          userObj.value.work,
          userObj.value.country,
          userObj.value.email,
          onRegistrationSucceed
        );
      },
    };
  },
});
</script>
