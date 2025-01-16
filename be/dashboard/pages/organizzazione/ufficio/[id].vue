<template>
  <Loader v-if="loading" />
  <div v-else class="text-black">
    <PageHeader :title="office.name" :breadcrumbs="breadcrumbs" />

    <div class="flex flex-row gap-4">
      <CustomCard v-if="department?.name" :to="department" :title="labels.department.title" entity="department" />
      <CustomCard v-if="service?.name" :to="service" :title="labels.service.title" entity="service" />
    </div>

  </div>
</template>

<script setup>
import { NH3, NCard } from 'naive-ui'
import { ref } from 'vue'
import { getService, getDepartment, getOffice } from '~/api'
import { UNCLICKABLE_MENU_ITEMS } from '~/utils/constants'
import CustomCard from '~/components/CustomCard.vue'
import OfficesTable from '~/components/organizzazione/OfficesTable.vue'
import PageHeader from '~/components/PageHeader.vue'
import Loader from '~/components/Loader.vue'
import labels from '~/utils/labels/it.json'

const route = useRoute()
const loading = ref(false)
const breadcrumbs = ref([])
const office = ref({})
const service = ref({})
const department = ref({})

const pagination = ref(true)

const getOfficeData = async () => {
  try {
    loading.value = true
    const id = route.params.id
    office.value = await getOffice(id)
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getServiceData = async (service_id) => {
  try {
    loading.value = true
    service.value = await getService(service_id)
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getDepartmentData = async (department_id) => {
  try {
    if(!department_id) return
    loading.value = true
    department.value = await getDepartment(department_id)
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getOfficesData = async () => {
  try {
    loading.value = true
    const filter = {
      filter: "service_id",
      value: route.params.id
    }
    offices.value = await getOffices(filter)
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted( async () => {
  await getOfficeData()
  
  if(office.value.service_id)
    await getServiceData(office.value.service_id)
  if(office.value.department_id)
    await getDepartmentData(office.value.department_id)
  
    const tmpBreadcrumbs = route.fullPath.split('/').filter((el) => el !== '')
  for (let index = 0; index < tmpBreadcrumbs.length; index++) {
    if(route.params.id === tmpBreadcrumbs[index]) {
      breadcrumbs.value.push({
        clickable: false,
        text: service.value.name,
      })
    } else {
      breadcrumbs.value.push({
        clickable: !UNCLICKABLE_MENU_ITEMS.includes(tmpBreadcrumbs[index]),
        text: tmpBreadcrumbs[index],
        to: !UNCLICKABLE_MENU_ITEMS.includes(tmpBreadcrumbs[index]) ? `/${tmpBreadcrumbs.slice(0, index + 1).join('/')}` : ''
      })
    }
  }
})
</script>