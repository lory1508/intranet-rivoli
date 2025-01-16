<template>
  <Loader v-if="loading" />
  <div v-else class="flex flex-col">
    <div class="flex flex-row gap-2 h-fit">
      <NH1>{{labels.office.title}}</NH1>

      <NPopover trigger="hover">
        <template #trigger>
          <ButtonAdd @click="createOffice" />
        </template>
        <span>{{ labels.office.create.label }}</span>
      </NPopover>
    </div>

    <OfficeTable :showActions="true" :data="offices" :pagination="pagination" />
  </div>
  <OfficeModal ref="officeModalRef" :office="officeToBeUpdated" @close="getOfficesData" />
</template>

<script setup>
import { NH1, NTag, NIcon, NDataTable, NButton, NButtonGroup, NPopover, NPopconfirm } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { getOffices, deleteOffice } from '~/api'
import { formatDate } from '@/utils/utils'
import OfficeTable from '~/components/organizzazione/OfficesTable.vue'
import labels from '@/utils/labels/it.json'

// components
import OfficeModal from '~/components/organizzazione/OfficeModal.vue'
import Loader from '~/components/Loader.vue'

const offices = ref([])
const pagination = ref(true)
const loading = ref(true)
const officeToBeUpdated = ref()

const officeModalRef = ref()

const createOffice = async () => {
  officeModalRef.value.show = !officeModalRef.value.show
}

const getOfficesData = async () => {
  try{
    loading.value = true
    offices.value = await getOffices()
    officeToBeUpdated.value = {}
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getOfficesData()
})
</script>