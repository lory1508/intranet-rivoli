<template>
  <NuxtLoadingIndicator/>
  <NConfigProvider>
    <NModalProvider>
      <NuxtLayout>
      </NuxtLayout>
    </NModalProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NModalProvider, NConfigProvider } from 'naive-ui';
</script>