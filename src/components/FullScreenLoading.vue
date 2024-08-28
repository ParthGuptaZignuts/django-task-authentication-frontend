<script setup>
import { useLoadingStore } from '../store/loadingStore';

const loadingStore = useLoadingStore();
const interval = ref();
const progressValue = ref(0);

onMounted(() => {
  interval.value = setInterval(() => {
    if (progressValue.value === 100) return progressValue.value = 0;
    progressValue.value += 10;
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div v-if="loadingStore.isLoading" class="fullscreen-loader">
    <VProgressCircular
      :rotate="360"
      :size="100"
      :width="6"
      :model-value="progressValue"
      color="success"
    >
      {{ progressValue }}
    </VProgressCircular>
  </div>
</template>

<style scoped>
.fullscreen-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
