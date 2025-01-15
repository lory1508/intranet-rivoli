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
  <OfficeModal ref="officeModalRef" :office="officeToBeUpdated" @close="getOfficesFromBE" />
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
    title: labels.columns.service,
    render(row) {
      const services = row.service_info.map((serKey) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: 'success',
            bordered: false
          },
          {
            default: () => serKey.name
          }
        )
      })
      
      return services.length ? services : h(NTag,
        {
          style: {
            marginRight: '6px',
            fontStyle: 'italic'
          },
          type: 'success',
          bordered: false
        },
        {
          default: () => "Nessun servizio associato"
        }
      )
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
              onClick: () => openOfficeModal('update', row)
            },
            { default: () => labels.actions.edit
            },
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => deleteOfficeFromBE(row._id),
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

const createOffice = async () => {
  officeModalRef.value.show = !officeModalRef.value.show
}

const openOfficeModal = (operation = 'create', office) => {
  if(operation=='update')
    officeToBeUpdated.value = office
  officeModalRef.value.show = !officeModalRef.value.show
}

const getOfficesFromBE = async () => {
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

const deleteOfficeFromBE = async (id) => {
  try{
    loading.value = true
    await deleteOffice(id)
    await getOfficesFromBE()
  } catch ( err ) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getOfficesFromBE()
})
</script>