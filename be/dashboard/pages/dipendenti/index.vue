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

    <UsersTable
      :users="users"
      :pagination="pagination"
    />
  </div>
  <UserModal ref="userModalRef" :user="userToBeUpdated" @close="getUsersFromBE" />
</template>

<script setup>
import { NH1, NTag, NIcon, NDataTable, NButton, NButtonGroup, NPopover, NPopconfirm } from 'naive-ui'
import { Checkmark, Close } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { EMAIL_DOMAIN } from '@/utils/constants.ts'
import { getUsers, deleteUser } from '~/api'
import { formatDate } from '@/utils/utils'
import labels from '@/utils/labels/it.json'

// components
import UserModal from '~/components/dipendenti/UserModal.vue'
import UsersTable from '~/components/dipendenti/UsersTable.vue'
import Loader from '~/components/Loader.vue'

const users = ref([])
const pagination = ref(true)
const loading = ref(true)
const userToBeUpdated = ref()

const userModalRef = ref()

const createUser = async () => {
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

onMounted(async () => {
  await getUsersFromBE()
})
</script>