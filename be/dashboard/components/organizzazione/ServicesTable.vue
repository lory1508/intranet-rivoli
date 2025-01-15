<template>
  <NDataTable
    :columns="columns"
    :data="services"
    :pagination="pagination"
    :bordered="false"
  />
</template>

<script setup>
import { NH1, NTag, NIcon, NDataTable, NButton, NButtonGroup, NPopover, NPopconfirm } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { getServices, deleteService } from '~/api'
import { formatDate } from '@/utils/utils'
import labels from '@/utils/labels/it.json'

// components
import Loader from '~/components/Loader.vue'

const props = defineProps({
  services: {
    type: Array,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  pagination: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update', 'refresh'])

const loading = ref(true)
const serviceModalRef = ref()
const columns = [
  {
    title: labels.columns.name,
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render(row) {
      return h(
        'div',
        {
          class: "cursor-pointer hover:underline",
          onClick: () => goToDetails(row._id)
        },
        {
          default: () => row.name
        }
      )
    }
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
      return !props.showActions ? '' : h(
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
              onClick: () => goToDetails(row._id)
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

const goToDetails = async (depId) => {
  await navigateTo({
    path: `/organizzazione/servizio/${depId}`
  })
}

const deleteServiceFromBE = async (id) => {
  try{
    loading.value = true
    await deleteService(id)
    emit('refresh')
  } catch ( err ) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>