<template>
  <div>
    <NBreadcrumb>
      <NBreadcrumbItem
        v-for="breadcrumb in breadcrumbs"
        :key="breadcrumb.text"
        :clickable="breadcrumb.clickable"
      >
        <NuxtLink :to="breadcrumb.to">
          <NIcon v-if="breadcrumb.icon" :component="breadcrumb.icon" />
          {{ breadcrumb.text }}
        </NuxtLink>
      </NBreadcrumbItem>
    </NBreadcrumb>
    <div class="flex flex-row items-center gap-2 w-fit">
      <NH2 v-if="!isEditing" class="my-1">{{ title }}</NH2>
      <NInput v-else class="w-full my-1" v-model:value="newTitle" />

      <NButton 
        primary
        class=""
        type="info" 
        v-if="showEdit"
        @click="edit"
      >
        <NIcon size="20">
          <Pencil v-if="!isEditing" />
          <Save v-else />
        </NIcon>
      </NButton>
    </div>
  </div>
</template>

<script setup>
import { NH2, NBreadcrumb, NBreadcrumbItem, NIcon, NButton, NInput } from 'naive-ui'
import { Pencil, Save } from '@vicons/ionicons5'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  breadcrumbs: {
    type: Array,
    required: true
  },
  showEdit: {
    type: Boolean,
    default: false
  }
})

const isEditing = ref(false)
const newTitle = ref(props.title)

const edit = () => {
  isEditing.value = !isEditing.value
}
</script>