<template>
  <NModal v-model:show="show">
    <NCard
      style="width: 600px"
      :title="title"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <NForm :model="newUser" :rules="rules">
        <NFormItem path="name" :label="labels.columns.name">
          <NInput :placeholder="labels.columns.name" v-model:value="newUser.name" :showCount="true" :maxlength="150" :minlength="5"/>
        </NFormItem>
        <NFormItem path="department" :label="labels.columns.department">
          <NSelect
            v-model:value="newUser.department_id"
            filterable
            round
            :placeholder="labels.columns.department"
            :options="departments"
          />
        </NFormItem>
        <NFormItem path="service" :label="labels.columns.service">
          <NSelect
            v-model:value="newUser.service_id"
            filterable
            round
            :placeholder="labels.columns.service"
            :options="services"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="flex flex-row gap-2">
          <NButton round secondary type="error" @click="show=false">
            {{labels.actions.cancel}}
          </NButton>
          <NButton round secondary type="success" :disabled="showError" @click="createOrUpdateUser">
            <template #icon>
              <NIcon>
                <Save />
              </NIcon>
            </template>
            {{labels.actions.save}}
          </NButton>
        </div>
      </template>
    </NCard>
  </NModal>
</template>

<script setup>
import { NModal, NCard, NButton, NIcon, NInput, NForm, NFormItem, NSelect } from 'naive-ui';
import { ref, computed, watch } from 'vue'
import { Save } from '@vicons/ionicons5'
import { createUser, updateUser, getDepartments, getServices, getOffices } from '~/api';
import { MIN_LENGTH_NAME, MAX_LENGTH_NAME } from '#build/imports';
import labels from '@/utils/labels/it.json'
import mongoose from "mongoose"

const props = defineProps({
  user: {
    type: Object,
    default: {
      firstname: "",
      lastname: "",
      phone: "",
      fax: "",
      email: "",
      room: "",
      department_id: "",
      service_id: "",
      office_id: "",
      address: "",
      photo: "",
      enabled: "",
      admin: "",
      username: "",
    }
  }
})
const emit = defineEmits(['close'])

const show = ref(false)
const showError = ref(true)
const loading = ref(false)

const departments = ref([])
const services = ref([])
const offices = ref([])

const isCreate = ref(false)
const newUser = ref({
  firstname: "",
  lastname: "",
  phone: "",
  fax: "",
  email: "",
  room: "",
  department_id: "",
  service_id: "",
  office_id: "",
  address: "",
  photo: "",
  enabled: "",
  admin: "",
  username: "",
})

const rules = ref({
  name: [
    {
      required: true,
      message: labels.validations.required,
      trigger: ['input', 'blur']
    },
    {
      min: 5,
      message: labels.validations.min5,
      trigger: ["input", "blur"]
    },
    {
      max: 150,
      message: labels.validations.max150,
      trigger: ["input", "blur"]
    },
  ],
  department_id: [
    {
      required: true,
      message: labels.validations.required,
      trigger: ['input', 'blur']
    }
  ]
})

const createOrUpdateUser = async () => {
  try{
    loading.value = true
    if(isCreate.value) {
      if(newUser.value.service_id)
        newUser.value.service_id = new mongoose.Types.ObjectId(newUser.value.service_id)
      const res = await createUser(newUser.value)
    } else {
      newUser.value.department_id = new mongoose.Types.ObjectId(newUser.value.department_id)
      if(newUser.value.service_id)
        newUser.value.service_id = new mongoose.Types.ObjectId(newUser.value.service_id)
      const res = await updateUser(newUser.value)
    }
    show.value = false
  } catch (err) {
    showError.value = true
    console.error("ERROR: ", err)
  } finally {
    loading.value = false
  }
}

const title = computed(() => {
  if(props.user.name)
    return labels.user.update.title
  else
    return labels.user.create.title
})

const getDepartmenstFromBE = async () => {
  try {
    const data = await getDepartments()
    departments.value = data.map((dep) => {
      return {
        value: dep._id,
        label: dep.name
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const getServicesFromBE = async (department = "") => {
  try {
    let data = await getServices()
    if(department){
      data = data.filter((dep) => dep.department_id === department)
    }
    services.value = data.map((dep) => {
      return {
        value: dep._id,
        label: dep.name
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const getOfficesFromBE = async (department = "", service = "") => {
  try {
    let data = await getOffices()
    if(department){
      data = data.filter((dep) => dep.department_id === department)
    }
    if(service){
      data = data.filter((ser) => ser.service_id === service)
    }
    offices.value = data.map((office) => {
      return {
        value: office._id,
        label: office.name
      }
    })
  } catch (error) {
    console.error(error)
  }
}

watch(show, async (newShowValue) => {
  if(!newShowValue){
    newUser.value={
      firstname: "",
      lastname: "",
      phone: "",
      fax: "",
      email: "",
      room: "",
      department_id: "",
      service_id: "",
      office_id: "",
      address: "",
      photo: "",
      enabled: "",
      admin: "",
      username: "",
    }
    emit('close')
  } else {
    await getDepartmenstFromBE()
    await getServicesFromBE()
    if(props.user){
      newUser.value = { ...props.user }
    } else {
      newUser.value = {
        firstname: "",
        lastname: "",
        phone: "",
        fax: "",
        email: "",
        room: "",
        department_id: "",
        service_id: "",
        office_id: "",
        address: "",
        photo: "",
        enabled: "",
        admin: "",
        username: "",
      }
    }
    isCreate.value = !Boolean(props.user?.name)
  }
})

watch(newUser, 
  (newValue) => {
    showError.value = (newValue.name?.length < MIN_LENGTH_NAME || newValue.name?.length > MAX_LENGTH_NAME) || !newValue.department_id

    if(newValue.department_id){
      getServicesFromBE(newValue.department_id)
    }
  },
  { deep: true }
)

defineExpose({
  show
})
</script>