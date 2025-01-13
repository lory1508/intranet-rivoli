<template>
  <Loader v-if="loading" />
  <div v-else class="flex flex-col">
    <div class="flex flex-row gap-2 h-fit">
      <NH1>{{labels.user.title}}</NH1>

      <NPopover trigger="hover">
        <template #trigger>
          <ButtonAdd @click="createUser" />
        </template>
        <span>{{ labels.user.create.label }}</span>
      </NPopover>
    </div>

    <NDataTable
      :columns="columns"
      :data="users"
      :pagination="pagination"
      :bordered="false"
    />
  </div>
  <UserModal ref="userModalRef" :user="userToBeUpdated" @close="getUsersFromBE" />
</template>

<script setup>
import { NH1, NTag, NDataTable, NButton, NButtonGroup, NPopover, NPopconfirm } from 'naive-ui'
import { ref, h } from 'vue'
import { EMAIL_DOMAIN } from '@/utils/constants.ts'
import { getUsers, deleteUser } from '~/api'
import { formatDate } from '@/utils/utils'
import labels from '@/utils/labels/it.json'

// components
import UserModal from '~/components/dipendenti/UserModal.vue'
import Loader from '~/components/Loader.vue'

const users = ref([])
const pagination = ref(true)
const loading = ref(true)
const userToBeUpdated = ref()

const userModalRef = ref()

const columns = [
  {
    title: labels.columns.name,
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render(row) {
      return `${row.firstname} ${row.lastname}`
    }
  },
  {
    title: labels.columns.email,
    key: "email",
    render(row) {
      return `${row.email}${EMAIL_DOMAIN}`
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
      const offices = row.office_info.map((officeKey) => {
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
            default: () => officeKey.name
          }
        )
      })
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
              onClick: () => openUserModal('update', row)
            },
            { default: () => labels.actions.edit
            },
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => deleteUserFromBE(row._id),
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

const createUser = async () => {
  userModalRef.value.show = !userModalRef.value.show
}

const openUserModal = (operation = 'create', user) => {
  if(operation=='update')
    userToBeUpdated.value = user
  userModalRef.value.show = !userModalRef.value.show
}

const getUsersFromBE = async () => {
  try{
    loading.value = true
    users.value = await getUsers()
    userToBeUpdated.value = {}
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const deleteUserFromBE = async (id) => {
  try{
    loading.value = true
    await deleteUser(id)
    await getUsersFromBE()
  } catch ( err ) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getUsersFromBE()
})
</script>