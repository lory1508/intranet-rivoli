<template>
  <Loader v-if="loading" />
  <div v-else class="flex flex-col">
    <div class="flex flex-row gap-2 h-fit">
      <NH1>{{labels.department.title}}</NH1>

      <NPopover trigger="hover">
        <template #trigger>
          <ButtonAdd @click="createDepartment" />
        </template>
        <span>{{ labels.department.create.label }}</span>
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
import { Add } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { getDepartments, deleteDepartment } from '~/api'
import { formatDate } from '@/utils/utils'
import labels from '@/utils/labels/it.json'

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
    title: labels.columns.name,
    key: "name"
  },
  {
    title: labels.columns.createdAt,
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
            { default: () => labels.actions.edit
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
              default: () => labels.actions.confirmDelete,
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
                  default: () => labels.actions.delete
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