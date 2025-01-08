<template>
  <div>
    <div class="flex flex-row gap-2">
      <NH1>Divisioni</NH1>
      <NIcon :component="AddCircle" size="32" class="mt-2 transition-all duration-500 cursor-pointer text-rose-400 hover:text-rose-600" @click="createDivisione"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NH1, NIcon } from 'naive-ui'
import { AddCircle } from '@vicons/ionicons5'
import { ref } from 'vue'
import { BE_PATH } from '@/utils/constants'

const departments = ref([])

const createDivisione = async () => {
  console.log("CREATE")
}

const getDepartments = async () => {
  const data = await $fetch(`${BE_PATH}/users`)
  console.log(data)
}

onMounted(async () => {
  await getDepartments()
})
</script>