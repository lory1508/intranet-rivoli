<template>
  <Loader v-if="loading" />
  <div v-else class="flex flex-col">
    <div class="flex flex-row gap-2 h-fit">
      <NH1>{{labels.service.title}}</NH1>

      <NPopover trigger="hover">
        <template #trigger>
          <NButton circle icon-placement="right" class="mt-2" color="#fb7185" size="small" @click="createService">
            <template #icon>
              <NIcon :component="Add" size="26" />
            </template>
          </NButton>
        </template>
        <span>{{ labels.service.create.label }}</span>
      </NPopover>
    </div>

    <NDataTable
      :columns="columns"
      :data="services"
      :pagination="pagination"
      :bordered="false"
    />
  </div>
  <ServiceModal ref="serviceModalRef" :service="serviceToBeUpdated" @close="getServicesFromBE" />
</template>

<script setup>
import { NH1, NTag, NIcon, NDataTable, NButton, NButtonGroup, NPopover, NPopconfirm } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { getServices, deleteService } from '~/api'
import { formatDate } from '@/utils/utils'
import labels from '@/utils/labels/it.json'

// components
import ServiceModal from '~/components/organizzazione/ServiceModal.vue'
import Loader from '~/components/Loader.vue'

const services = ref([])
const pagination = ref(false)
const loading = ref(true)
const serviceToBeUpdated = ref()

const serviceModalRef = ref()

const columns = [
  {
    title: labels.columns.name,
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: labels.columns.department,
    render(row) {
      const deps = row.department_info.map((depKey) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: 'info',
            bordered: false
          },
          {
            default: () => depKey.name
          }
        )
      })
      return deps
    }
  },
  {
    title: labels.columns.createdAt,
    key: "created_at",
    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    render(row) {
      return formatDate(row.created_at)
    }
  },
  {
    title: labels.columns.updatedAt,
    key: "updated_at",
    render(row) {
      return formatDate(row.updated_at)
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
              onClick: () => openServiceModal('update', row)
            },
            { default: () => labels.actions.edit
            },
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => deleteServiceFromBE(row._id),
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

const createService = async () => {
  serviceModalRef.value.show = !serviceModalRef.value.show
}

const openServiceModal = (operation = 'create', service) => {
  if(operation=='update')
    serviceToBeUpdated.value = service
  serviceModalRef.value.show = !serviceModalRef.value.show
}

const getServicesFromBE = async () => {
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

const deleteServiceFromBE = async (id) => {
  try{
    loading.value = true
    await deleteService(id)
    await getServicesFromBE()
  } catch ( err ) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getServicesFromBE()
})
</script>