<template>
  <NuxtLink 
    v-if="!hasChildren" 
    class="z-50 flex flex-row items-center gap-2 px-2 py-1 -mx-2 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:text-white hover:bg-primary-700" 
    :class="externalItemClass(menuItem.label)"
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
        <div 
          class="flex flex-col gap-2 " 
        >
          <NuxtLink 
            v-for="child in menuItem?.children"
            :key="child.to"
            :to="child.to"
            :class="innerItemClass(child.label)" 
            class="px-2 py-1 text-white transition-all duration-500 border-l-2 hover:text-white hover:scale-110 hover:shadow-lg"
          >
            {{ child.label }}
          </NuxtLink>
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

const innerItemClass = (item) => {
  switch (item) {
    case "Direzioni":
      return "border-blue-200 hover:bg-blue-500"
      break;
    case "Servizi":
      return "border-green-200 hover:bg-green-500"
      break;
    case "Uffici":
      return "border-yellow-200 hover:bg-yellow-500"
      break;
    case "Contatti":
      return "border-red-200 hover:bg-red-500"
      break;

    default:
      return "border-zinc-200 hover:bg-zinc-500"
      break;
  }
}

const externalItemClass = (item) => {
  switch (item) {
    case "Contatti":
      return "hover:border-l-2 border-red-200 hover:bg-red-500"
      break;

    default:
      return "hover:border-l-2 border-primary-200 hover:bg-primary-500"
      break;
  }
}

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
.customMenuClass .n-collapse-item-arrow .n-base-icon {
  color: white !important;
  fill: white !important;
}

.router-link-active {
  @apply bg-rose-400 px-2 -mx-2 shadow-lg font-semibold text-white
}
</style>