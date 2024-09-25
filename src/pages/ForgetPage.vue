<template>
  <q-page-container class="bg-auth">
    <q-page class="flex flex-center">
      <q-card square class="shadow-12" style="width: 350px; height: 288px">
        <q-card-section class="bg-primary">
          <h4 class="text-h5 text-white q-my-md">Reset Password</h4>
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
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-lg">
          <q-btn
            @click="onResetClicked"
            unelevated
            size="lg"
            color="primary"
            class="full-width text-white"
            label="Reset"
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
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ForgotPasswordPage",
  setup() {
    const credentialObj = ref({
      email: "",
    });
    const router = useRouter();
    return {
      credential: credentialObj,
      onRegisterClicked() {
        router.push("/register");
      },
      onReturnToLoginClicked() {
        router.push("/login");
      },
      onResetClicked() {
        router.push("/login");
      },
    };
  },
});
</script>
