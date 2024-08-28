<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png';
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png';
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png';
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png';
import authV2MaskDark from '@images/pages/misc-mask-dark.png';
import authV2MaskLight from '@images/pages/misc-mask-light.png';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { VForm } from 'vuetify/components/VForm';
import { validationRules } from "../composables/useValidation.js";
import axios from "../AxiosFile";
import { useLoadingStore } from '../store/loadingStore';
import FullScreenLoading from '../components/FullScreenLoading.vue'

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const isPasswordVisible = ref(false);
const refVForm = ref();
const email = ref();
const password = ref();
const router = useRouter();
const loadingStore = useLoadingStore(); // Use the loading store

const handleSubmit = async () => {
  try {
    loadingStore.startLoading(); // Start loading
    // Validate form fields
    const validate = await refVForm.value.validate();

    if (!validate.valid) return; // If validation fails, do nothing

    // Prepare payload for API request
    const payload = {
      email: email.value,
      password: password.value,
    };

    // Make API call to login endpoint
    const response = await axios.post("login-user", payload);
    if(response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role",response.data.role);
        toast("Logged In Successfully", {
          theme: "auto",
          type: "success",
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          dangerouslyHTMLString: true,
        });
        router.push("/"); // Redirect to home page
      } 
  } catch (error) {
    // If API call fails, show error message
    toast("API call failed:", error, {
      theme: "auto",
      type: "warning",
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      dangerouslyHTMLString: true,
    });
  } finally {
    loadingStore.stopLoading(); // Stop loading
  }
};
</script>

<template>
  <FullScreenLoading v-if="loadingStore.isLoading" />
  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />

          <h5 class="text-h5 mb-1">
            Welcome to <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 👋🏻
          </h5>

          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="handleSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  label="Email"
                  type="email"
                  :rules="validationRules.email"
                  autofocus
                  required
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="password"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :rules="validationRules.password"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  required

                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <a
                    class="text-primary ms-2 mb-1"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </a>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>

                <a
                  class="text-primary ms-2"
                  href="/register"
                >
                  Create an account
                </a>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
