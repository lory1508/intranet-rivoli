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
      <NForm :model="newService" :rules="rules">
        <NFormItem path="name" :label="labels.columns.name">
          <NInput :placeholder="labels.columns.name" v-model:value="newService.name" :showCount="true" :maxlength="150" :minlength="5"/>
        </NFormItem>
        <NFormItem path="department" :label="labels.columns.department">
          <NSelect
            v-model:value="newService.department_id"
            filterable
            round
            :placeholder="labels.columns.department"
            :options="departments"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="flex flex-row gap-2">
          <NButton round secondary type="error" @click="show=false">
            {{labels.actions.cancel}}
          </NButton>
          <NButton round secondary type="success" :disabled="showError" @click="createOrUpdateService">
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
import { createService, updateService, getDepartments } from '~/api';
import { MIN_LENGTH_NAME, MAX_LENGTH_NAME } from '@/utils/constants';
import labels from '@/utils/labels/it.json'
import mongoose from "mongoose"

const message = useMessage()

const props = defineProps({
  service: {
    type: Object,
    default: {
      name: "",
      department_id: ""
    }
  }
})
const emit = defineEmits(['close'])

const show = ref(false)
const showError = ref(true)
const loading = ref(false)
const departments = ref([])
const isCreate = ref(false)
const newService = ref({
  name: "",
  department_id: ""
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

const createOrUpdateService = async () => {
  try{
    loading.value = true
    if(isCreate.value) {
      const res = await createService(newService.value)
      message.success(labels.alerts.serviceCreated)
    } else {
      newService.value.department_id = new mongoose.Types.ObjectId(newService.value.department_id)
      const res = await updateService(newService.value)
      message.success(labels.alerts.serviceUpdated)
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
  if(props.service.name)
    return labels.service.update.title
  else
    return labels.service.create.title
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

watch(show, async (newShowValue) => {
  if(!newShowValue){
    newService.value={
      name: "",
      department_id: ""
    }
    emit('close')
  } else {
    await getDepartmenstData()
    if(props.service){
      newService.value = { ...props.service }

    } else {
      newService.value = {
        name: "",
        department_id: ""
      }
    }
    isCreate.value = !Boolean(props.service?.name)
  }
})

watch(newService, 
  (newValue) => {
    showError.value = (newValue.name?.length < MIN_LENGTH_NAME || newValue.name?.length > MAX_LENGTH_NAME) || !newValue.department_id
  },
  { deep: true }
)

defineExpose({
  show
})
</script>