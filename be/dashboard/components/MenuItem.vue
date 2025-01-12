<template>
  <NuxtLink 
    v-if="!hasChildren" 
    class="flex flex-row items-center gap-2 px-2 py-1 -mx-2 transition-all duration-500 rounded-full hover:text-white hover:bg-primary-700" 
    :to="menuItem.to"
  >
    <slot name="menuIcon" />
    <span>
      {{menuItem.label}}
    </span>
  </NuxtLink>

  <div v-else>
    <NCollapse arrow-placement="right" class="">
      <NCollapseItem name="menuItemslug" >
        <template #header>
          <div class="flex flex-row items-center gap-2 text-white" :class="isActive ? 'border-b-2 border-b-primary-50 px-2 -mx-2': ''">
            <slot name="menuIcon" />
            <span>
              {{menuItem.label}}
            </span>
          </div>
        </template>
        <div class="flex flex-col gap-2">
          <NuxtLink 
            v-for="child in menuItem?.children"
            :key="child.to"
            :to="child.to"
            class="px-2 py-1 text-white transition-all duration-500 rounded-full hover:text-white hover:bg-primary-700"
          >
            {{ child.label }}
          </NuxtLink>
          <div class="w-full py-1 border-b border-stone-500"></div>
        </div>
      </NCollapseItem>
    </NCollapse>
  </div>
</template>

<script setup>
import { NCollapse, NCollapseItem } from 'naive-ui';
import { watch } from 'vue'

const props = defineProps({
  menuItem: {
    type: Object,
    required: true
  },
  hasChildren: Boolean
})

const route = useRoute()
const isActive = ref(false)

watch(
  () => route.path,
  (newValue) => {
    const label = props.menuItem.label
    isActive.value = newValue.includes(label.toLowerCase())
  },
  { deep: true }
)

onMounted(() => {
  const label = props.menuItem.label
  isActive.value = route.path.includes(label.toLowerCase())
})

</script>

<style>
.n-base-icon {
  color: white !important;
  fill: white !important;
}
</style>