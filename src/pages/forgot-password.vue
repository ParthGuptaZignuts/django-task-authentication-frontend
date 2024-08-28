<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { toast } from "vue3-toastify"
import "vue3-toastify/dist/index.css"
import { VForm } from 'vuetify/components/VForm'
import axios from "../AxiosFile.js"
import { validationRules } from "../composables/useValidation.js"
import { useLoadingStore } from '../store/loadingStore';
import FullScreenLoading from '../components/FullScreenLoading.vue'
import { useRouter } from "vue-router";

const email = ref('')
const loadingStore = useLoadingStore(); 
const router = useRouter();
const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const handleSubmit = async () =>{
  try{
    loadingStore.startLoading();
    if(!email.value){
      throw new Error("Email is required")
    }

    const payload = {
      email: email.value,
    }
    const response = await axios.post("request-password-reset",payload)

    if(response.data){
      toast("Mail Sent Successfully", {
          theme: "auto",
          type: "success",
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          dangerouslyHTMLString: true,
        });
    }
    setTimeout(()=>{
      router.push("/login")
    },2000)
  }catch (error) {
    toast("API call failed:", error, {
      theme: "auto",
      type: "warning",
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      dangerouslyHTMLString: true,
    });
  }finally{
    loadingStore.stopLoading();
  }
}
</script>

<template>
  <FullScreenLoading v-if="loadingStore.isLoading" />
  <VRow
    class="auth-wrapper bg-surface"
    no-gutters
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="368"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          class="auth-footer-mask"
          :src="authThemeMask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
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
            Forgot Password? 🔒
          </h5>
          <p class="mb-0">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="handleSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  :rules="validationRules.email"
                  required
                  autofocus
                  label="Email"
                  type="email"
                />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                >
                  Send Reset Link
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    class="flip-in-rtl"
                  />
                  <span> <a href="/login">Back to login </a></span>
                </RouterLink>
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
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
