<template>
  <Loader v-if="loading" />
  <div v-else class="text-black">
    <PageHeader :title="department.name" :breadcrumbs="breadcrumbs" :showEdit="true" />

    <NH3>{{ labels.office.plural }}</NH3>
    <OfficeTable :offices="offices" :pagination="pagination" :showActions="false" />

    <NH3>{{ labels.service.plural }}</NH3>
    <ServicesTable :services="services" :pagination="pagination" :showActions="false" />
  </div>
</template>

<script setup>
import { NH1, NH3 } from 'naive-ui'
import { ref } from 'vue'
import { getDepartment, getOffices, getServices } from '~/api'
import { UNCLICKABLE_MENU_ITEMS } from '~/utils/constants'
import ServicesTable from '~/components/organizzazione/ServicesTable.vue'
import OfficeTable from '~/components/organizzazione/OfficesTable.vue'
import PageHeader from '~/components/PageHeader.vue'
import Loader from '~/components/Loader.vue'
import labels from '~/utils/labels/it.json'

const route = useRoute()
const loading = ref(false)
const department = ref({})
const breadcrumbs = ref([])

const pagination = ref(true)
const offices = ref([])
const services = ref([])
const filter = {
  filter: "department_id",
  value: route.params.id
}

const getDepartmentData = async () => {
  try {
    loading.value = true
    const id = route.params.id
    department.value = await getDepartment(id)
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
    offices.value = await getOffices(filter)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getServicesData = async () => {
  try{
    loading.value = true
    services.value = await getServices(filter)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted( async () => {
  await getDepartmentData()
  await getOfficesData()
  await getServicesData()
  const tmpBreadcrumbs = route.fullPath.split('/').filter((el) => el !== '')
  for (let index = 0; index < tmpBreadcrumbs.length; index++) {
    if(route.params.id === tmpBreadcrumbs[index]) {
      breadcrumbs.value.push({
        clickable: false,
        text: department.value.name,
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