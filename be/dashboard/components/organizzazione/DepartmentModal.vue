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
    <pre>{{ newDepartment }}</pre>
      <NForm>
        <NFormItem path="name" label="Nome">
          <NInput round placeholder="Nome" v-model:value="newDepartment.name"/>
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="flex flex-row gap-2">
          <NButton round secondary type="error">
            Annulla
          </NButton>
          <NButton round secondary type="success">
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
import { ref, computed } from 'vue'
import { Save } from '@vicons/ionicons5'

const props = defineProps({
  department: Object
})

const show = ref(false)
const newDepartment = ref({
  name: ""
})

const title = computed(() => {
  if(props.department)
    return "Aggiorna divisione"
  else
    return "Crea divisione"
})

onMounted(() => {
  newDepartment.value = props.department || {}
})

defineExpose({
  show
})
</script>