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
      <NForm>
        <NFormItem path="name" label="Nome">
          <NInput round placeholder="Nome" v-model:value="newDepartment.name" :showCount="true" :maxlength="150" :minlength="5"/>
        </NFormItem>
      </NForm>
      <NAlert v-if="showError" type="warning">
        Il nome dev'essere di minimo 5 caratteri e massimo 150.
      </NAlert>
      <template #footer>
        <div class="flex flex-row gap-2">
          <NButton round secondary type="error" @click="show=false">
            Annulla
          </NButton>
          <NButton round secondary type="success" :disabled="showError" @click="createOrUpdateDepartment">
            <template #icon>
              <NIcon>
                <Save />
              </NIcon>
            </template>
            Salva
          </NButton>
        </div>
      </template>
    </NCard>
  </NModal>
</template>

<script setup>
import { NModal, NCard, NButton, NIcon, NInput, NForm, NFormItem, NAlert } from 'naive-ui';
import { ref, computed, watch } from 'vue'
import { Save } from '@vicons/ionicons5'
import { createDepartment, updateDepartment } from '~/api';
import { MIN_LENGTH_NAME, MAX_LENGTH_NAME } from '#build/imports';

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

const createOrUpdateDepartment = async () => {
  try{
    loading.value = true
    if(isCreate.value) {
      const res = await createDepartment(newDepartment.value)
    } else {
      const res = await updateDepartment(newDepartment.value)
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
    return "Aggiorna direzione"
  else
    return "Crea direzione"
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