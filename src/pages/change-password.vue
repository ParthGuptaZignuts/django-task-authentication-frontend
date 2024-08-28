<script setup>
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { VForm } from "vuetify/components/VForm";
import { validationRules } from "../composables/useValidation.js";
import axios from "../AxiosFile";
import { useLoadingStore } from "../store/loadingStore";
import FullScreenLoading from "../components/FullScreenLoading.vue";

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const isOldPasswordVisible = ref(false)
const isPasswordVisible = ref(false);
const refVForm = ref();
const old_password = ref();
const new_password = ref();
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
      old_password: old_password.value,
      new_password: new_password.value,
    };

    // Make API call to login endpoint
    const response = await axios.post("change-password", payload);
    console.log(response.data);
    if (response.data) {
      localStorage.removeItem("token");
      localStorage.removeItem("role")
      toast("Password Changed Successfully", {
        theme: "auto",
        type: "success",
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        dangerouslyHTMLString: true,
      });
      router.push("/login"); 
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
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg :src="authThemeMask" class="auth-footer-mask" />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6" />

          <h5 class="text-h5 mb-1">
            Change Password of
            <span class="text-capitalize"> {{ themeConfig.app.title }} </span>!
            👋🏻
          </h5>

          <p class="mb-0">
            Change your account and start the adventure
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="handleSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="old_password"
                  label="Old Password"
                  :type="isOldPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :rules="validationRules.password"
                  @click:append-inner="isOldPasswordVisible  = !isOldPasswordVisible "
                  required
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="new_password"
                  label="New Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :rules="validationRules.password"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  required
                />

                <VBtn block type="submit" class="mt-5"> Change Password </VBtn>

                <VBtn block type="submit" class="mt-5" @click="() => $router.push({ name: 'index' })"> Back </VBtn>
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
