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
          <NInput round placeholder="Nome" v-model:value="newDepartment.name"/>
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="flex flex-row gap-2">
          <NButton round secondary type="error" @click="show=false">
            Annulla
          </NButton>
          <NButton round secondary type="success" @click="createOrUpdateDepartment">
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
import { NModal, NCard, NButton, NIcon, NInput, NForm, NFormItem } from 'naive-ui';
import { ref, computed, watch } from 'vue'
import { Save } from '@vicons/ionicons5'
import { createDepartment, updateDepartment } from '~/api';

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
    console.error(err)
  } finally {
    loading.value = false
  }
}

const title = computed(() => {
  if(props.department.name)
    return "Aggiorna divisione"
  else
    return "Crea divisione"
})

watch(show, (newShowValue) => {
  console.log("POPOPOPOP",newShowValue)
  if(!newShowValue){
    newDepartment.value.name = ""
    emit('close')
  } else {
    newDepartment.value = props.department || {}
    isCreate.value = !Boolean(props.department)
  }
})

defineExpose({
  show
})
</script>