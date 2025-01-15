<template>
  <div class="text-black">
    <NCollapse>
      <NCollapseItem name="users">
        <template #header>
          <div class="flex flex-row gap-2 mt-5">
            <NH3>{{labels.user.plural}}</NH3><NTag type="error"> - {{ users.length }} elemento/i</NTag>
          </div>
        </template>
        <UsersTable :users="users" :pagination="pagination" :showActions="false" />
      </NCollapseItem>
      <NCollapseItem name="departments">
        <template #header>
          <div class="flex flex-row gap-2 mt-5">
            <NH3>{{labels.department.plural}}</NH3><NTag type="info"> - {{ departments.length }} elemento/i</NTag>
          </div>
        </template>
        <DepartmentsTable :departments="departments" :pagination="pagination" :showActions="false" />
      </NCollapseItem>
      <NCollapseItem name="services">
        <template #header>
          <div class="flex flex-row gap-2 mt-5">
            <NH3>{{labels.service.plural}}</NH3><NTag type="success"> - {{ services.length }} elemento/i</NTag>
          </div>
        </template>
        <ServicesTable :services="services" :pagination="pagination" :showActions="false" />
      </NCollapseItem>
      <NCollapseItem name="offices">
        <template #header>
          <div class="flex flex-row gap-2 mt-5">
            <NH3>{{labels.office.plural}}</NH3><NTag type="warning"> - {{ offices.length }} elemento/i</NTag>
          </div>
        </template>
        <OfficesTable :offices="offices" :pagination="pagination" :showActions="false" />
      </NCollapseItem>
    </NCollapse>
  </div>
</template>

<script setup>
import { NH3, NDivider, NCollapse, NCollapseItem, NTag } from 'naive-ui'
import { ref, reactive } from 'vue'
import { getSearch } from '~/api'
import labels from '~/utils/labels/it.json'

// components
import OfficesTable from '~/components/organizzazione/OfficesTable.vue'
import DepartmentsTable from '~/components/organizzazione/DepartmentsTable.vue'
import ServicesTable from '~/components/organizzazione/ServicesTable.vue'
import UsersTable from '~/components/dipendenti/UsersTable.vue'

const route = useRoute()
const queryParams = ref("")
const results = ref([])
const pagination = ref(true)

const users = ref([])
const departments = ref([])
const offices = ref([])
const services = ref([])

onMounted(async () => {
  queryParams.value = route.query.q
  if(!queryParams.value) {
    await navigateTo({path: "/"})
  }
  
  results.value = await getSearch(queryParams.value)
  
  users.value = results.value.users
  departments.value = results.value.departments
  offices.value = results.value.offices
  services.value = results.value.services
})
</script>