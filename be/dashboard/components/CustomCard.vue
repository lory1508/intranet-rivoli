<template>
  <div
    class="flex flex-col gap-2 p-2 mt-2 transition-all duration-150 shadow w-fit hover:scale-105"
    :class="`${bg} ${text}`"
  >
    <span class="text-lg font-semibold">{{ title }}</span>
    <NuxtLink 
      :to="`/organizzazione/direzione/${to._id}`" 
      class="hover:underline"
    >
      {{ to.name }}
    </NuxtLink>
  </div>
</template>

<script setup>
import labels from '~/utils/labels/it.json'
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: ""
  },
  entity: {
    type: String,
    default: "department"
  }
})

const bg = `bg-${props.entity}-bg`
const text = `text-${props.entity}-text`
</script>