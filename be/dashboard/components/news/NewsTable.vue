<template>
  <NDataTable
    :columns="columns"
    :data="news"
    :pagination="pagination"
    :bordered="false"
    :paginate-single-page="false"
  />
</template>

<script setup>
import { NH1, NTag, NIcon, NDataTable, NButton, NButtonGroup, NPopover, NPopconfirm } from 'naive-ui'
import { Checkmark, Close, ShieldCheckmark, ShieldOutline } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { getUsers, deleteUser } from '~/api'
import { formatDate,getExtract } from '@/utils/utils'
import labels from '@/utils/labels/it.json'

// components
import Loader from '~/components/Loader.vue'

const props = defineProps({
  news: {
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
const officeModalRef = ref()

const columns = [
  {
    title: labels.columns.visible,
    render(row) {
      return h(
        NIcon, 
        {
          size: 22,
          class: row.visible ?  "text-white bg-green-600 rounded-full" : "text-white bg-red-600 rounded-full"
        },
        { 
          default: () => h(
            row.visible ? Checkmark : Close,
            {
              class: "p-[2px]"
            }
          )
        }
      )
    }
  },
  {
    title: labels.columns.highlighted,
    render(row) {
      return h(
        NIcon, 
        {
          size: 22,
          class: row.highlighted ?  "text-white bg-green-600 rounded-full" : "text-white bg-red-600 rounded-full"
        },
        { 
          default: () => h(
            row.highlighted ? Checkmark : Close,
            {
              class: "p-[2px]"
            }
          )
        }
      )
    }
  },
  {
    title: labels.columns.title,
    key: "title",
    render(row) {
      return h(
        'div',
        {
          class: "cursor-pointer hover:underline",
          onClick: () => goToDetails(row._id)
        },
        {
          default: () => row.title
        }
      )
    }
  },
  {
    title: labels.columns.content,
    key: "content",
    render(row) {
      return getExtract(row.content, 50)
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
    title: labels.columns.office,
    render(row) {
      const offs = row.office_info.map((offKey) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: 'warning',
            bordered: false
          },
          {
            default: () => offKey.name
          }
        )
      })
      return offs
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
              onPositiveClick: () => deleteUserData(row._id),
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
    path: `/dipendenti/${depId}`
  })
}

const deleteUserData = async (id) => {
  try{
    loading.value = true
    await deleteUser(id)
    emit('refresh')
  } catch ( err ) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>