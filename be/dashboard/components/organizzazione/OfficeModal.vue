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
      <NForm :model="newOffice" :rules="rules">
        <NFormItem path="name" :label="labels.columns.name">
          <NInput :placeholder="labels.columns.name" v-model:value="newOffice.name" :showCount="true" :maxlength="150" :minlength="5"/>
        </NFormItem>
        <NFormItem path="department" :label="labels.columns.department">
          <NSelect
            v-model:value="newOffice.department_id"
            filterable
            clearable
            round
            :placeholder="labels.columns.department"
            :options="departments"
          />
        </NFormItem>
        <NFormItem path="service" :label="labels.columns.service">
          <NSelect
            v-model:value="newOffice.service_id"
            filterable
            round
            :placeholder="labels.columns.service"
            :options="servicesOptions"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="flex flex-row gap-2">
          <NButton round secondary type="error" @click="show=false">
            {{labels.actions.cancel}}
          </NButton>
          <NButton round secondary type="success" :disabled="showError" @click="createOrUpdateOffice">
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
import { useMessage, NModal, NCard, NButton, NIcon, NInput, NForm, NFormItem, NSelect } from 'naive-ui';
import { ref, computed, watch } from 'vue'
import { Save } from '@vicons/ionicons5'
import { createOffice, updateOffice, getDepartments, getServices } from '~/api';
import { MIN_LENGTH_NAME, MAX_LENGTH_NAME } from '@/utils/constants';
import labels from '@/utils/labels/it.json'
import mongoose from "mongoose"

const message = useMessage()

const props = defineProps({
  office: {
    type: Object,
    default: {
      name: "",
      department_id: "",
      service_id: ""
    }
  }
})
const emit = defineEmits(['close'])

const show = ref(false)
const showError = ref(true)
const loading = ref(false)

const departments = ref([])
const departmentsOptions = ref([])
const selectedDepartment = ref()
const services = ref([])
const servicesOptions = ref([])

const isCreate = ref(false)
const newOffice = ref({
  name: "",
  department_id: "",
  service_id: ""
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

const createOrUpdateOffice = async () => {
  try{
    loading.value = true
    if(isCreate.value) {
      if(newOffice.value.service_id)
        newOffice.value.service_id = new mongoose.Types.ObjectId(newOffice.value.service_id)
      const res = await createOffice(newOffice.value)
      message.success(labels.alerts.officeCreated)
    } else {
      newOffice.value.department_id = new mongoose.Types.ObjectId(newOffice.value.department_id)
      if(newOffice.value.service_id)
        newOffice.value.service_id = new mongoose.Types.ObjectId(newOffice.value.service_id)
      const res = await updateOffice(newOffice.value)
      message.success(labels.alerts.officeUpdated)
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
  if(props.office.name)
    return labels.office.update.title
  else
    return labels.office.create.title
})

const getDepartmenstData = async () => {
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

const getServicesData = async (department = "") => {
  try {
    if(!department){
      services.value =  await getServices()
      servicesOptions.value = services.value.map((dep) => {
        return {
          value: dep._id,
          label: dep.name
        }
      })
    } else {
      servicesOptions.value = services.value.filter((ser) => ser.department_id === department).map((dep) => {
        return {
          value: dep._id,
          label: dep.name
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

watch(show, async (newShowValue) => {
  if(!newShowValue){
    newOffice.value={
      name: "",
      department_id: "",
      service_id: ""
    }
    emit('close')
  } else {
    await getDepartmenstData()
    await getServicesData()
    if(props.office){
      newOffice.value = { ...props.office }
    } else {
      newOffice.value = {
        name: "",
        department_id: "",
        service_id: ""
      }
    }
    isCreate.value = !Boolean(props.office?.name)
  }
})

watch(newOffice, 
  (newValue) => {
    if(show.value){
      showError.value = (newValue.name?.length < MIN_LENGTH_NAME || newValue.name?.length > MAX_LENGTH_NAME) || !newValue.department_id

      if(newValue.department_id != selectedDepartment.value){
        getServicesData(newValue.department_id)
        selectedDepartment.value = newValue.department_id
      }
    }
  },
  { deep: true }
)

defineExpose({
  show
})
</script>