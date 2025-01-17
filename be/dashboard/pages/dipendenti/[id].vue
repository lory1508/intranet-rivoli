<template>
  <Loader v-if="loading" />
  <div v-else class="text-black">
    <PageHeader :title="fullName" :breadcrumbs="breadcrumbs" />

    <NCard :title="labels.user.personalData" class="w-fit">
      <template #header-extra>
        <NButton 
          primary
          class=""
          type="info" 
          @click="edit"
        >
          <NIcon size="20">
            <Pencil />
          </NIcon>
        </NButton>
      </template>
      <div class="flex flex-col gap-4">
        <NuxtImg :src="image" alt="user image" class="max-w-96" />
        <div class="flex flex-row items-center gap-8">
          <div class="flex flex-row gap-2">
            <NIcon size="20">
              <Person />
            </NIcon>
            <span>{{ user.firstname }} {{ user.lastname }}</span>
          </div>
          <div class="flex flex-row gap-2">
            <span class="font-bold tracking-tighter">Username</span>
            <span>{{ user.username }}</span>
          </div>
        </div>
        <div class="flex flex-row items-center gap-8">
          <div class="flex flex-row gap-2">
            <div v-if="user.enabled" class="flex flex-row items-center gap-2">
              <NIcon size="22" class="text-white bg-green-600 rounded-full">
                <Checkmark />
              </NIcon>
              <span class="font-semibold text-green-600">{{ labels.form.enabled }}</span>
            </div>
            <div v-else class="flex flex-row items-center gap-2">
              <NIcon size="22" class="text-white bg-red-600 rounded-full">
                <Close />
              </NIcon>
              <span class="font-semibold text-red-600">{{ labels.form.disabled }}</span>
            </div>
          </div>
          <div class="flex flex-row gap-2">
            <div v-if="user.admin" class="flex flex-row items-center gap-2">
              <NIcon size="30" class="text-green-600">
                <ShieldCheckmark />
              </NIcon>
              <span class="font-semibold text-green-600">{{ labels.form.admin }}</span>
            </div>
            <div v-else class="flex flex-row items-center gap-2">
              <NIcon size="22" class="text-white bg-red-600 rounded-full">
                <Close />
              </NIcon>
              <span class="font-semibold text-red-600">{{ labels.form.notadmin }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-row items-center gap-8">
          <div class="flex flex-row gap-2">
            <NIcon size="20">
              <Mail />
            </NIcon>
            <span>{{ user.email }}{{ EMAIL_DOMAIN }}</span>
          </div>
        </div>
        <div class="flex flex-row items-center gap-8">
          <div v-if="user.phone" class="flex flex-row gap-2">
            <NIcon size="20">
              <Call />
            </NIcon>
            <span>{{ user.phone }}</span>
          </div>
          <div v-if="user.fax" class="flex flex-row items-center gap-2">
            <span class="text-lg font-bold -tracking-widest">FAX</span>
            <span>{{ user.fax }}</span>
          </div>
          <div v-if="user.room" class="flex flex-row gap-2">
            <NIcon size="20">
              <Location />
            </NIcon>
            <span>{{ user.room }}</span>
          </div>
          <div v-if="user.address" class="flex flex-row gap-2">
            <NIcon size="20">
              <MapSharp />
            </NIcon>
            <span>{{ user.address }}</span>
          </div>
        </div>
        <div class="flex flex-row items-center gap-2">
          <span class="font-bold tracking-tighter">{{labels.department.title}}</span>
          <NTag v-if="department" type="info" class="cursor-pointer w-fit hover:underline" @click="goToEntityDetails('organizzazione/direzione', department._id)">{{ department.name }}</NTag>
        </div>
        <div class="flex flex-row items-center gap-2">
          <span class="font-bold tracking-tighter">{{labels.service.title}}</span>
          <NTag v-if="service" type="success" class="cursor-pointer w-fit hover:underline" @click="goToEntityDetails('organizzazione/servizio', service._id)">{{ service.name }}</NTag>
        </div>
        <div class="flex flex-row items-center gap-2">
          <span class="font-bold tracking-tighter">{{labels.office.title}}</span>
          <NTag v-if="office" type="warning" class="cursor-pointer w-fit hover:underline" @click="goToEntityDetails('organizzazione/ufficio', office._id)">{{ office.name }}</NTag>
        </div>
      </div>
    </NCard>
  </div>
  <UserModal ref="userModalRef" :user="user" @close="getUsersData" />
</template>

<script setup>
import { getUser, getImage } from "~/api";
import { UNCLICKABLE_MENU_ITEMS } from "~/utils/constants";
import { EMAIL_DOMAIN } from "~/utils/constants";
import labels from "~/utils/labels/it.json";

// components
import { Pencil, Person, Mail, Call, Location, Checkmark, Close, ShieldCheckmark, MapSharp } from "@vicons/ionicons5";
import { NCard, NIcon, NButton, NTag } from "naive-ui";
import PageHeader from "~/components/PageHeader.vue";
import Loader from "~/components/Loader.vue";
import UserModal from "~/components/dipendenti/UserModal.vue";

const route = useRoute()

const user = ref({})
const department = ref({})
const service = ref({})
const office = ref({})
const image = ref("")
const imageUrl = ref("")

const breadcrumbs = ref([])
const loading = ref(false)
const fullName = ref("")
const userModalRef = ref()

const getUserData = async () => {
  try {
    loading.value = true
    const res = await getUser( route.params.id )
    user.value = res
    department.value = res.department_info[0]
    service.value = res.service_info[0]
    office.value = res.office_info[0]
    image.value = await getImage(user.value.image)
    
    image.value = URL.createObjectURL(image.value)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goToEntityDetails = async (entity, id) => {
  await navigateTo({
    path: `/${entity}/${id}`
  })
}

const edit = async () => {
  userModalRef.value.show = !userModalRef.value.show
}

onMounted( async () => {
  await getUserData()
  fullName.value = `${user.value.firstname} ${user.value.lastname}`
  const tmpBreadcrumbs = route.fullPath.split('/').filter((el) => el !== '')
  for (let index = 0; index < tmpBreadcrumbs.length; index++) {
    if(route.params.id === tmpBreadcrumbs[index]) {
      breadcrumbs.value.push({
        clickable: false,
        text: fullName.value,
      })
    } else {
      breadcrumbs.value.push({
        clickable: !UNCLICKABLE_MENU_ITEMS.includes(tmpBreadcrumbs[index]),
        text: tmpBreadcrumbs[index],
        to: !UNCLICKABLE_MENU_ITEMS.includes(tmpBreadcrumbs[index]) ? `/${tmpBreadcrumbs.slice(0, index + 1).join('/')}` : ''
      })
    }
  }
})
</script>