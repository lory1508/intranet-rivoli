<template>
  <div class="flex flex-row items-center gap-2 w-96">
    <NInputGroup>
      <NInput round :placeholder="labels.form.search" v-model:value="queryParams" @keyup.enter="globalSearch">
        <template #prefix>
          <NIcon :component="Search" />
        </template>
      </NInput>
      <NButton
        primary
        round
        type="info"
        @click="globalSearch"
      >
        {{ labels.form.search }}
      </NButton>
    </NInputGroup>
  </div>
</template>

<script setup>
import { NModal, NCard, NInput, NInputGroup, NIcon, NButton } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import { ref, watch } from 'vue'
import labels from '~/utils/labels/it.json'

const queryParams = ref("")

const globalSearch = async () => {
  await navigateTo({
    path: "/search",
    query: {
      q: queryParams.value
    }
  })
}
</script>