<script setup lang="ts">
import axios from "../AxiosFile";
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2ResetPasswordIllustrationDark from '@images/pages/auth-v2-reset-password-illustration-dark.png'
import authV2ResetPasswordIllustrationLight from '@images/pages/auth-v2-reset-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { ref , onMounted} from 'vue'

const authThemeImg = useGenerateImageVariant(authV2ResetPasswordIllustrationLight,
  authV2ResetPasswordIllustrationDark,
)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const router = useRouter()
const route = useRoute()
const password = ref('')
const token = ref()
const email = ref()
const isLoading = ref(false)
const setNewPasswordRef = ref()
import FullScreenLoading from '../components/FullScreenLoading.vue'
import { useLoadingStore } from '../store/loadingStore';

const loadingStore = useLoadingStore(); 

// check url and get email and token for change new password
const checkUrl = () => {
  if (route.query) {
    token.value = route.query.token,
    email.value = route.query.email
  }
}

// update the password
const updatePassword = async () => {
  const queryParams = new URLSearchParams({
    token: token.value,
    email: email.value,
  }).toString();

  const inputPassword =  {
          password: password.value,  
        }
  setNewPasswordRef.value?.validate().then(async ({ valid }: any) => {
    if (valid) {
      try {
        loadingStore.startLoading();
        const { data } = await axios.post(`reset-password?${queryParams}`,inputPassword);

        if (data) {
          toast.success(data.message);
          setTimeout(() => {
            isLoading.value = false;
            router.push({ name: 'login' });
          }, 2000);
        }
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
        loadingStore.stopLoading();
      }
    }
  });
};

onMounted(checkUrl)
</script>

<template>
    <FullScreenLoading v-if="loadingStore.isLoading" />
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg max-width="400" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>

        <VImg class="auth-footer-mask" :src="authThemeMask" />
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6" />

          <h5 class="text-h5 mb-1">
            Reset Password 🔒
          </h5>
          <p class="mb-0">
            for <span class="font-weight-bold">{{ email }}</span>
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="setNewPasswordRef" @submit.prevent="updatePassword">
            <VRow>
              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="password"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>
              <!-- Set password -->
              <VCol cols="12">
                <VBtn
                  v-if="isLoading"
                  block
                  loading="white"
                  type="submit"
                />
                <VBtn
                  v-else
                  block
                  type="submit"
                >
                  Submit
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink class="d-flex align-center justify-center" :to="{ name: 'login' }">
                  <VIcon icon="tabler-chevron-left" class="flip-in-rtl" />
                  <span>Back to login</span>
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
  
</route>