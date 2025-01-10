<template>
  <Loader v-if="loading" />
  <div v-else class="flex flex-col">
    <div class="flex flex-row gap-2 h-fit">
      <NH1>Direzioni</NH1>

      <NPopover trigger="hover">
        <template #trigger>
          <NButton circle icon-placement="right" class="mt-2" color="#fb7185" size="small" @click="createDepartment">
            <template #icon>
              <NIcon :component="Add" size="26" />
            </template>
          </NButton>
        </template>
        <span>Crea nuova direzione</span>
      </NPopover>
    </div>

    <NDataTable
      :columns="columns"
      :data="departments"
      :pagination="pagination"
      :bordered="false"
    />
  </div>
  <DepartmentModal ref="departmentModalRef" :department="departmentToBeUpdated" @close="getDepartmentsFromBE" />
</template>

<script setup>
import { NH1, NIcon, NDataTable, NButton, NButtonGroup, NPopover, NPopconfirm } from 'naive-ui'
import { Add, Trash, Pencil } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { getDepartments, deleteDepartment } from '~/api'
import { formatDate } from '@/utils/utils'

// components
import DepartmentModal from '~/components/organizzazione/DepartmentModal.vue'
import Loader from '~/components/Loader.vue'

const departments = ref([])
const pagination = ref(false)
const loading = ref(true)
const departmentToBeUpdated = ref()

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
    key: "actions",
    render(row) {
      return h(
        NButtonGroup,
        [
          h(
            NButton,
            {
              strong: false,
              round: true,
              secondary: true,
              type: "warning",
              size: "small",
              class: "mr-2",
              onClick: () => openDepartmentModal('update', row)
            },
            { default: () => "Modifica"
            },
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => deleteDepartmentFromBE(row._id),
              positiveButtonProps: {
                type: "error"
              }
            },
            {
              default: () => "Confermi di voler cancellare questa direzione?",
              trigger: () => h(
                NButton,
                {
                  strong: false,
                  round: true,
                  secondary: true,
                  type: "error",
                  size: "small",
                },
                { 
                  default: () => "Elimina"
                },
              )
            }
          )
        ]
      )
    }
  }
];

const createDepartment = async () => {
  departmentModalRef.value.show = !departmentModalRef.value.show
}

const openDepartmentModal = (operation = 'create', department) => {
  if(operation=='update')
    departmentToBeUpdated.value = department
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

const deleteDepartmentFromBE = async (id) => {
  try{
    loading.value = true
    await deleteDepartment(id)
    await getDepartmentsFromBE()
  } catch ( err ) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getDepartmentsFromBE()
})
</script>