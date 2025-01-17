<template>
  <Loader v-if="loading" />
  <div v-else class="text-black">
    <PageHeader :title="fullName" :breadcrumbs="breadcrumbs" />

    <NCard :title="labels.news.title" class="w-fit">
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
      <div class="flex flex-col max-w-3xl gap-8">
        <div class="flex flex-col">
          <NH2 class="mb-0">{{ news.title }}</NH2>
          <div class="flex flex-row items-center gap-4">
            <div class="flex flex-row items-center">
              {{ formatDate(news.date_from, false) }}
              <div v-if="news.date_to" class="flex flex-row items-center">
                <NIcon class="mx-2"><ArrowForward /></NIcon>
                {{ formatDate(news.date_to, false) }}
              </div>
            </div>
            <div>
              <span v-if="news.visible" class="px-2 py-1 font-semibold text-green-800 bg-green-200 border border-green-400 rounded-sm" >{{ labels.form.enabled }}</span>
              <span v-else class="px-2 py-1 font-semibold text-red-800 bg-red-200 border border-red-400 rounded-sm" >{{ labels.form.disabled }}</span>
            </div>
            <div>
              <span v-if="!news.highlighted" class="px-2 py-1 font-semibold border rounded-sm text-amber-800 bg-amber-200 border-amber-400" >
                <NIcon class="pt-[1px]"><Star /></NIcon>
                {{ labels.form.highlighted }}
              </span>
              <span v-else class="px-2 py-1 font-semibold text-red-800 bg-red-200 border border-red-400 rounded-sm" >
                <NIcon class="pt-[1px]"><Star /></NIcon>
                {{ labels.form.nothighlighted }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-8">
          <div v-if="news.category_info?.length" class="flex flex-row gap-2">
            <NH3 class="mb-0">{{ labels.form.category }}</NH3>
            <NTag type="success">{{ news.category_info[0].name }}</NTag>
          </div>
          <div v-if="news.tag_info?.length" class="flex flex-row gap-2">
            <NH3 class="mb-0">{{ labels.form.tags }}</NH3>
            <NTag v-for="tag in news.tag_info" :key="tag._id" type="info">{{ tag.name }}</NTag>
          </div>
        </div>
        <div class="flex flex-col">
          <NH3 class="mb-0">{{ labels.form.content }}</NH3>
          <div class="w-full text-wrap">{{ news.content }}</div>
        </div>
        <pre>{{news}}</pre>
      </div>
    </NCard>
  </div>
  <NewsModal ref="newsModalRef" :news="news" @close="getNewsData" />
</template>

<script setup>
import { getNews, getImage } from "~/api";
import { formatDate } from '@/utils/utils'
import labels from "~/utils/labels/it.json";

// components
import { Pencil, ArrowForward, Star, StarOutline } from "@vicons/ionicons5";
import { NCard, NIcon, NButton, NTag, NH2, NH3 } from "naive-ui";
import PageHeader from "~/components/PageHeader.vue";
import Loader from "~/components/Loader.vue";
import NewsModal from "~/components/news/NewsModal.vue";

const route = useRoute()

const news = ref({})
const tags_info = ref([])
const category_info = ref({})
const photo = ref("")
const imageUrl = ref("")

const breadcrumbs = ref([])
const loading = ref(false)
const fullName = ref("")
const newsModalRef = ref()

const getNewsData = async () => {
  try {
    loading.value = true
    const res = await getNews( route.params.id )
    news.value = res
    tags_info.value = news.value.tags_info
    category_info.value = news.value.category_info
    // photo.value = await getImage(news.value.photo)
    
    // photo.value = URL.createObjectURL(photo.value)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const edit = async () => {
  newsModalRef.value.show = !newsModalRef.value.show
}

onMounted( async () => {
  await getNewsData()
  const tmpBreadcrumbs = route.fullPath.split('/').filter((el) => el !== '')
  for (let index = 0; index < tmpBreadcrumbs.length; index++) {
    if(route.params.id === tmpBreadcrumbs[index]) {
      breadcrumbs.value.push({
        clickable: false,
        text: news.value.title,
      })
    } else {
      breadcrumbs.value.push({
        text: tmpBreadcrumbs[index],
        to: `/${tmpBreadcrumbs.slice(0, index + 1).join('/')}`
      })
    }
  }
})
</script>