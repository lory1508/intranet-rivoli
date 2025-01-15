<template>
  <Loader v-if="loading" />
  <div v-else class="text-black">
    <PageHeader :title="service.name" :breadcrumbs="breadcrumbs" />

    <CustomCard :to="department" :title="labels.department.title" />

    <NH3>{{ labels.office.plural }}</NH3>
    <OfficesTable :offices="offices" :pagination="pagination" :showActions="false" />
  </div>
</template>

<script setup>
import { NH3, NCard } from 'naive-ui'
import { ref } from 'vue'
import { getService, getDepartment, getOffices } from '~/api'
import { UNCLICKABLE_MENU_ITEMS } from '~/utils/constants'
import CustomCard from '~/components/CustomCard.vue'
import OfficesTable from '~/components/organizzazione/OfficesTable.vue'
import PageHeader from '~/components/PageHeader.vue'
import Loader from '~/components/Loader.vue'
import labels from '~/utils/labels/it.json'

const route = useRoute()
const loading = ref(false)
const breadcrumbs = ref([])
const service = ref({})
const department = ref({})
const offices = ref([])

const pagination = ref(true)

const getServiceFromBE = async () => {
  try {
    loading.value = true
    const id = route.params.id
    service.value = await getService(id)
    await getDepartmentFromBE(service.value.department_id)
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getDepartmentFromBE = async (department_id) => {
  try {
    if(!department_id) return
    loading.value = true
    department.value = await getDepartment(department_id)
    console.log(department.value)
    loading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getOfficesFromBE = async () => {
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
  await getServiceFromBE()
  await getOfficesFromBE()
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