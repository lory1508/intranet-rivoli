<template>
  <Loader v-if="loadingPage" />
  <div v-else class="flex flex-col gap-2">
    <div class="flex flex-row gap-2">
      <NH1>Divisioni</NH1>
      <NIcon :component="AddCircle" size="32" class="mt-2 transition-all duration-500 cursor-pointer text-rose-400 hover:text-rose-600" @click="createDivisione"/>
    </div>

    <NDataTable
      :columns="columns"
      :data="departments"
      :pagination="pagination"
      :bordered="false"
    />
  </div>
  <DepartmentModal ref="departmentModalRef" />
</template>

<script setup>
import { NH1, NIcon, NDataTable, NButton } from 'naive-ui'
import { AddCircle } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { getDepartments } from '~/api'
import { Pencil } from '@vicons/ionicons5'
import { formatDate } from '@/utils/utils'

// components
import DepartmentModal from '~/components/organizzazione/DepartmentModal.vue'
import Loader from '~/components/Loader.vue'

const departments = ref([])
const pagination = ref(false)
const loadingPage = ref(true)

const departmentModalRef = ref()

const columns = [
    {
      title: "Nome",
      key: "name"
    },
    {
      title: "Creato il",
      key: "created_at",
      render(row) {
        return formatDate(row.created_at)
      }
    },
    {
      title: "Azioni",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => departmentModalRef.value.show = !departmentModalRef.value.show
          },
          { default: () => h(
              NIcon,
              {
                component: Pencil
              }
            ) 
          }
        );
      }
    }
  ];

const createDivisione = async () => {
  console.log("CREATE")
  departmentModalRef.value.show = !departmentModalRef.value.show
}

onMounted(async () => {
  try{
    departments.value = await getDepartments()
  } catch (err) {
    console.error(err)
  } finally {
    loadingPage.value = false
  }
})
</script>