<template>
  <NuxtLoadingIndicator/>
  <NConfigProvider>
    <NMessageProvider>
      <NModalProvider>
        <NuxtLayout>
        </NuxtLayout>
      </NModalProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NModalProvider, NConfigProvider, NMessageProvider } from 'naive-ui';
</script>