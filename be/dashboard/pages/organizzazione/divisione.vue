<template>
  <Loader v-if="loading" />
  <div v-else class="flex flex-col">
    <div class="flex flex-row gap-2 h-fit">
      <NH1>Divisioni</NH1>

      <NPopover trigger="hover">
        <template #trigger>
          <NButton circle icon-placement="right" class="mt-2" color="#fb7185" size="small" @click="createDivisione">
            <template #icon>
              <NIcon :component="Add" size="26" />
            </template>
          </NButton>
        </template>
        <span>Crea nuova divisione</span>
      </NPopover>
    </div>

    <NDataTable
      :columns="columns"
      :data="departments"
      :pagination="pagination"
      :bordered="false"
    />
  </div>
  <DepartmentModal ref="departmentModalRef" @close="getDepartmentsFromBE" />
</template>

<script setup>
import { NH1, NIcon, NDataTable, NButton, NPopover } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { getDepartments } from '~/api'
import { Pencil } from '@vicons/ionicons5'
import { formatDate } from '@/utils/utils'

// components
import DepartmentModal from '~/components/organizzazione/DepartmentModal.vue'
import Loader from '~/components/Loader.vue'

const departments = ref([])
const pagination = ref(false)
const loading = ref(true)

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

const getDepartmentsFromBE = async () => {
  try{
    loading.value = true
    departments.value = await getDepartments()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getDepartmentsFromBE()
})
</script>