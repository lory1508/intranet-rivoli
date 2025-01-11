<template>
  <NButton circle icon-placement="right" class="mt-2" :color="color" size="small">
    <template #icon>
      <NIcon :component="Add" size="26" />
    </template>
  </NButton>
</template>

<script setup>
import { NButton, NIcon } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import tailwindConfig from './../tailwind.config.js'

const color = tailwindConfig.theme.extend.colors.secondary["500"]
</script>