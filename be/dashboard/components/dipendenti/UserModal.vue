<template>
  <NModal v-model:show="show">
    <NCard
      :title="title"
      :bordered="false"
      class="w-2/3 rounded-xl"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <NForm :model="newUser" :rules="rules" class="grid grid-cols-3 gap-2">
        <div class="flex flex-row col-span-3 gap-32">
          <NFormItem path="enabled" >
            <span class="transition-all duration-100 cursor-pointer" :class="!newUser.enabled ? 'text-red-800 border-b-2 border-b-red-600 font-semibold' : ''" @click="newUser.enabled=false">{{ labels.form.disabled }}</span>
            <NSwitch v-model:value="newUser.enabled" class="mx-2" />
            <span class="transition-all duration-100 cursor-pointer" :class="newUser.enabled ? 'text-green-800 border-b-2 border-b-green-600 font-semibold' : ''" @click="newUser.enabled=true">{{labels.form.enabled}}</span>
          </NFormItem>
          <NFormItem path="admin">
            <span class="transition-all duration-100 cursor-pointer" :class="!newUser.admin ? 'text-red-800 border-b-2 border-b-red-600 font-semibold' : ''" @click="newUser.admin=false">{{ labels.form.notadmin }}</span>
            <NSwitch v-model:value="newUser.admin" class="mx-2"/>
            <span class="transition-all duration-100 cursor-pointer" :class="newUser.admin ? 'text-green-800 border-b-2 border-b-green-600 font-semibold' : ''" @click="newUser.admin=true">{{labels.form.admin}}</span>
          </NFormItem>
        </div>
        <NFormItem path="firstname" :label="labels.form.firstname">
          <NInput :placeholder="labels.form.firstname" v-model:value="newUser.firstname" :showCount="true" :maxlength="MAX_LENGTH_NAME" :minlength="MIN_LENGTH_NAME"/>
        </NFormItem>
        <NFormItem path="lastname" :label="labels.form.lastname">
          <NInput :placeholder="labels.form.lastname" v-model:value="newUser.lastname" :showCount="true" :maxlength="MAX_LENGTH_NAME" :minlength="MIN_LENGTH_NAME"/>
        </NFormItem>
        <NFormItem path="username" :label="labels.form.username">
          <NInput :placeholder="labels.form.username" v-model:value="newUser.username" :showCount="true" :maxlength="MAX_LENGTH_USERNAME" :minlength="MIN_LENGTH_USERNAME"/>
        </NFormItem>
        <NFormItem path="phone" :label="labels.form.phone">
          <NInputNumber class="w-full" :placeholder="labels.form.phone" v-model:value="newUser.phone" :max="MAX_INTERNO" :show-button="false" :format="formatPhone">
            <template #prefix>
              <NIcon><Call /></NIcon>
            </template>
          </NInputNumber>
        </NFormItem>
        <NFormItem path="fax" :label="labels.form.fax">
          <NInput :placeholder="labels.form.fax" v-model:value="newUser.fax" :maxlength="MAX_LENGTH_NAME" :minlength="MIN_LENGTH_NAME"/>
        </NFormItem>
        <NFormItem path="room" :label="labels.form.room">
          <NInput :placeholder="labels.form.room" v-model:value="newUser.room" :showCount="true" :maxlength="MAX_LENGTH_NAME" :minlength="MIN_LENGTH_NAME">
            <template #prefix>
              <NIcon><Location /></NIcon>
            </template>
          </NInput>
        </NFormItem>
        <NFormItem path="email" :label="labels.form.email" class="col-span-2">
          <NInputGroup>
            <NInput :placeholder="labels.form.email" v-model:value="newUser.email" :maxlength="MAX_LENGTH_NAME" :minlength="MIN_LENGTH_NAME">
              <template #prefix>
                <NIcon><Mail /></NIcon>
              </template>
            </NInput>
            <NInputGroupLabel>{{ EMAIL_DOMAIN }}</NInputGroupLabel>
          </NInputGroup>
        </NFormItem>
        <NFormItem path="address" :label="labels.form.address">
          <NInput :placeholder="labels.form.address" v-model:value="newUser.address" :showCount="true" :maxlength="MAX_LENGTH_NAME" :minlength="MIN_LENGTH_NAME">
            <template #prefix>
              <NIcon><MapSharp /></NIcon>
            </template>
          </NInput>
        </NFormItem>
        <div class="flex flex-row gap-2 col-span-full">
          <NFormItem path="department" :label="labels.form.department" class="w-full">
            <NSelect
              v-model:value="newUser.department_id"
              filterable
              round
              :placeholder="labels.form.department"
              :options="departmentsOptions"
            />
          </NFormItem>
          <NFormItem path="service" :label="labels.form.service" class="w-full">
            <NSelect
              v-model:value="newUser.service_id"
              filterable
              round
              :placeholder="labels.form.service"
              :options="servicesOptions"
            />
          </NFormItem>
          <NFormItem path="office" :label="labels.form.office" class="w-full">
            <NSelect
              v-model:value="newUser.office_id"
              filterable
              round
              :placeholder="labels.form.office"
              :options="officesOptions"
            />
          </NFormItem>
        </div>
        <!-- Not implemented yet -->
        <NFormItem path="image" :label="labels.form.image" class="col-span-full">
          <NUpload
            directory-dnd
            :action="`${BE_PATH}/upload`"
            :custom-request="uploadImageData"
            accept=".png,.jpg,.jpeg"
          >
            <NUploadDragger>
              <div style="margin-bottom: 12px">
                <NIcon size="48" :depth="3">
                  <Archive />
                </NIcon>
              </div>
              <NText style="font-size: 16px">
                {{labels.form.uploader.title}}
              </NText>
              <NP depth="3" style="margin: 8px 0 0 0">
                {{labels.form.uploader.subtitle}}
              </NP>
            </NUploadDragger>
          </NUpload>
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
import { useMessage, NUpload, NUploadDragger, NText, NP, NModal, NCard, NButton, NIcon, NInput, NForm, NFormItem, NSelect, NSwitch, NInputNumber, NInputGroup, NInputGroupLabel } from 'naive-ui';
import { ref, computed, watch } from 'vue'
import { Call, Location, Mail, MapSharp, Save, Archive } from '@vicons/ionicons5'
import { createUser, updateUser, getDepartments, getServices, getOffices, uploadImage } from '~/api';
import { MIN_LENGTH_NAME, MAX_LENGTH_NAME, MIN_LENGTH_USERNAME, MAX_LENGTH_USERNAME, MIN_INTERNO, MAX_INTERNO, EMAIL_DOMAIN } from '@/utils/constants';
import labels from '@/utils/labels/it.json'
import mongoose from "mongoose"

const message = useMessage()

const props = defineProps({
  user: {
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
    image: "",
    enabled: true,
    admin: "",
    username: "",
  }
})
const emit = defineEmits(['close'])

const show = ref(false)
const showError = ref(true)
const loading = ref(false)

const departments = ref([])
const departmentsOptions = ref([])
const services = ref([])
const servicesOptions = ref([])
const offices = ref([])
const officesOptions = ref([])

const defaultUser = {
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
  image: "",
  enabled: true,
  admin: "",
  username: "",
}

const isCreate = ref(false)
const newUser = ref({...defaultUser})

const rules = ref({
  firstname: [
    {
      required: true,
      message: labels.validations.required,
      trigger: ['input', 'blur']
    },
    {
      min: MIN_LENGTH_NAME,
      message: labels.validations.min2,
      trigger: ["input", "blur"]
    },
    {
      max: MAX_LENGTH_NAME,
      message: labels.validations.max150,
      trigger: ["input", "blur"]
    },
  ],
  lastname: [
    {
      required: true,
      message: labels.validations.required,
      trigger: ['input', 'blur']
    },
    {
      min: MIN_LENGTH_NAME,
      message: labels.validations.min2,
      trigger: ["input", "blur"]
    },
    {
      max: MAX_LENGTH_NAME,
      message: labels.validations.max150,
      trigger: ["input", "blur"]
    },
  ],
  username: [
    {
      required: true,
      message: labels.validations.required,
      trigger: ['input', 'blur']
    },
    {
      min: MIN_LENGTH_USERNAME,
      message: labels.validations.min5,
      trigger: ["input", "blur"]
    },
    {
      max: MAX_LENGTH_USERNAME,
      message: labels.validations.max150,
      trigger: ["input", "blur"]
    },
  ],
  phone: [],
  room: [
    {
      required: true,
      message: labels.validations.required,
      trigger: ['input', 'blur']
    }
  ],
  email: [
    {
      required: true,
      message: labels.validations.required,
      trigger: ['input', 'blur']
    }
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

    if(newUser.value.department_id )
      newUser.value.department_id = new mongoose.Types.ObjectId(newUser.value.department_id)
      if(newUser.value.service_id)
      newUser.value.service_id = new mongoose.Types.ObjectId(newUser.value.service_id)
      if(newUser.value.office_id)
        newUser.value.office_id = new mongoose.Types.ObjectId(newUser.value.office_id)

    if(isCreate.value) {
      await createUser(newUser.value)
      message.success(labels.alerts.userCreated)
      // TODO: Delete avatar if user creation fails
    } else {
      await updateUser(newUser.value)
      message.success(labels.alerts.userUpdated)
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
  if(!isCreate.value)
    return labels.user.update.title
  else
    return labels.user.create.title
})

const getDepartmentsData = async () => {
  try {
    departments.value = await getDepartments()
    departmentsOptions.value = departments.value.map((dep) => {
      return {
        value: dep._id,
        label: dep.name
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const uploadImageData = async ({
  file,
  data,
  headers,
  // withCredentials,
  action,
  onFinish,
  onError,
  onProgress
}) => {
  try{
    const formData = new FormData();
    formData.append("image", file.file);
    const res = await uploadImage(formData)
    newUser.value.image = res.avatarUrl
    message.success(labels.alerts.imageUploaded)
  } catch (err) {
    console.error("ERROR: ", err)
    message.error(labels.errors.generic)
  }
};

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

const getOfficesData = async (department = "", service = "") => {
  try {
    if(!department && !service){
      offices.value =  await getOffices()
      officesOptions.value = offices.value.map((office) => {
        return {
          value: office._id,
          label: office.name
        }
      })
    } else if(department && !service) {
      officesOptions.value = offices.value.filter((off) => off.department_id === department).map((office) => {
        return {
          value: office._id,
          label: office.name
        }
      })
    } else {
      officesOptions.value = offices.value.filter((off) => off.service_id === service).map((office) => {
        return {
          value: office._id,
          label: office.name
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

const formatPhone = (value) => {
  if (value === null)
    return ''
  return `${String(value).padStart(4, '0')}`
}

watch(show, async (newShowValue) => {
  if(!newShowValue){
    newUser.value={...defaultUser}
    emit('close')
  } else {
    await getDepartmentsData()
    await getServicesData()
    await getOfficesData()
    if(props.user){
      newUser.value = { ...props.user }
    } else {
      newUser.value = {...defaultUser}
    }
    isCreate.value = !Boolean(props.user?.email)
  }
})

watch(newUser, 
  (newValue) => {
    showError.value = (newValue.name?.length < MIN_LENGTH_USERNAME || newValue.name?.length > MAX_LENGTH_USERNAME) || !newValue.department_id

    if(newValue.firstname && newValue.lastname){
      newUser.value.email = `${newValue.firstname.toLowerCase()}.${newValue.lastname.toLowerCase()}`
      newUser.value.username = `${Array.from(newValue.firstname.toLowerCase())}.${newValue.lastname.toLowerCase()}`
    }

    if(newValue.department_id){
      getServicesData(newValue.department_id)
    }
  },
  { deep: true }
)

defineExpose({
  show
})
</script>