<template>
  <Loader v-if="loading" />
  <div v-else class="flex flex-col">
    <div class="flex flex-row gap-2 h-fit">
      <NH1>{{labels.news.title}}</NH1>

      <NPopover trigger="hover">
        <template #trigger>
          <ButtonAdd @click="createNews" />
        </template>
        <span>{{ labels.news.create.label }}</span>
      </NPopover>
    </div>

    <NewsTable
      :news="news"
      :pagination="pagination"
      @refresh="getNewsData"
    />
  </div>
  <NewsModal ref="NewsModalRef" :news="newsToBeUpdated" @close="getNewsData" />
</template>

<script setup>
import { NH1, NPopover } from 'naive-ui'
import { ref } from 'vue'
import { getAllNews, deleteNews } from '~/api'
import labels from '@/utils/labels/it.json'

// components
import NewsModal from '~/components/news/NewsModal.vue'
import NewsTable from '~/components/news/NewsTable.vue'
import Loader from '~/components/Loader.vue'

const news = ref([])
const pagination = ref(false)
const loading = ref(true)
const newsToBeUpdated = ref()

const NewsModalRef = ref()

const goToDetails = async (newsId) => {
  await navigateTo({
    path: `/news/${newsId}`
  })
}

const createNews = async () => {
  NewsModalRef.value.show = !NewsModalRef.value.show
}

const openNewsModal = (operation = 'create', news) => {
  if(operation=='update')
    newsToBeUpdated.value = news
  NewsModalRef.value.show = !NewsModalRef.value.show
}

const getNewsData = async () => {
  try{
    loading.value = true
    news.value = await getAllNews()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const deleteNewsData = async (id) => {
  try{
    loading.value = true
    await deleteNews(id)
    await getNewsData()
  } catch ( err ) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getNewsData()
})
</script>