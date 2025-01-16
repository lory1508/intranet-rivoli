<template>
  <Loader v-if="loading" />
  <div v-else class="flex flex-col">
    <div class="flex flex-row gap-2 h-fit">
      <NH1>{{labels.service.plural}}</NH1>

      <NPopover trigger="hover">
        <template #trigger>
          <ButtonAdd @click="createService" />
        </template>
        <span>{{ labels.service.create.label }}</span>
      </NPopover>
    </div>
    
    <ServicesTable :services="services" :pagination="pagination" :showActions="true" />
  </div>
  <ServiceModal ref="serviceModalRef" :service="serviceToBeUpdated" @close="getServicesData" />
</template>

<script setup>
import { NH1, NTag, NIcon, NDataTable, NButton, NButtonGroup, NPopover, NPopconfirm } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { getServices, deleteService } from '~/api'
import { formatDate } from '@/utils/utils'
import labels from '@/utils/labels/it.json'

// components
import ServicesTable from '~/components/organizzazione/ServicesTable.vue'
import ServiceModal from '~/components/organizzazione/ServiceModal.vue'
import ButtonAdd from '~/components/ButtonAdd.vue'
import Loader from '~/components/Loader.vue'

const services = ref([])
const pagination = ref(false)
const loading = ref(true)
const serviceToBeUpdated = ref()

const serviceModalRef = ref()

const createService = async () => {
  serviceModalRef.value.show = !serviceModalRef.value.show
}

const getServicesData = async () => {
  try{
    loading.value = true
    services.value = await getServices()
    serviceToBeUpdated.value = {}
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getServicesData()
})
</script>