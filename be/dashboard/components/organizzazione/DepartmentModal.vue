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
      <NForm :model="newDepartment" :rules="rules">
        <NFormItem path="name" :label="labels.columns.name">
          <NInput placeholder="Nome" v-model:value="newDepartment.name" :showCount="true" :maxlength="150" :minlength="5"/>
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="flex flex-row gap-2">
          <NButton round secondary type="error" @click="show=false">
            {{labels.actions.cancel}}
          </NButton>
          <NButton round secondary type="success" :disabled="showError" @click="createOrUpdateDepartment">
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
import { NModal, NCard, NButton, NIcon, NInput, NForm, NFormItem, useMessage } from 'naive-ui';
import { ref, computed, watch } from 'vue'
import { Save } from '@vicons/ionicons5'
import { createDepartment, updateDepartment } from '~/api';
import { MIN_LENGTH_NAME, MAX_LENGTH_NAME } from '@/utils/constants';
import labels from '@/utils/labels/it.json'

const message = useMessage()

const props = defineProps({
  department: {
    type: Object,
    default: {
      name: ""
    }
  }
})
const emit = defineEmits(['close'])

const show = ref(false)
const showError = ref(true)
const loading = ref(false)
const isCreate = ref(false)
const newDepartment = ref({
  name: ""
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
  ]
})

const createOrUpdateDepartment = async () => {
  try{
    loading.value = true
    if(isCreate.value) {
      const res = await createDepartment(newDepartment.value)
      message.success(labels.alerts.departmentCreated)
    } else {
      const res = await updateDepartment(newDepartment.value)
      message.success(labels.alerts.departmentUpdated)
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
  if(props.department.name)
    return labels.department.update.title
  else
    return labels.department.create.title
})

watch(show, (newShowValue) => {
  if(!newShowValue){
    newDepartment.value.name = ""
    emit('close')
  } else {
    newDepartment.value = props.department || {}
    isCreate.value = !Boolean(props.department?.name)
  }
})

watch(newDepartment, 
  (newName) => {
    showError.value = newName.name.length < MIN_LENGTH_NAME || newName.name.length > MAX_LENGTH_NAME
  },
  { deep: true }
)

defineExpose({
  show
})
</script>