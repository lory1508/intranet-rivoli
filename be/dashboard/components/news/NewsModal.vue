<template>
  <NModal v-model:show="show">
    <NCard
      :title="title"
      :bordered="false"
      class="w-1/2 rounded-xl"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <NForm :model="newNews" :rules="rules" class="grid grid-cols-2 gap-2">
        <div class="flex flex-row gap-32 col-span-full">
          <NFormItem path="enabled" >
            <span class="transition-all duration-100 cursor-pointer" :class="!newNews.enabled ? 'text-red-800 border-b-2 border-b-red-600 font-semibold' : ''" @click="newNews.enabled=false">{{ labels.form.disabled }}</span>
            <NSwitch v-model:value="newNews.enabled" class="mx-2" />
            <span class="transition-all duration-100 cursor-pointer" :class="newNews.enabled ? 'text-green-800 border-b-2 border-b-green-600 font-semibold' : ''" @click="newNews.enabled=true">{{labels.form.enabled}}</span>
          </NFormItem>
          <NFormItem path="highlighted">
            <span class="transition-all duration-100 cursor-pointer" :class="!newNews.highlighted ? 'text-red-800 border-b-2 border-b-red-600 font-semibold' : ''" @click="newNews.admin=false">{{ labels.form.nothighlighted }}</span>
            <NSwitch v-model:value="newNews.highlighted" class="mx-2"/>
            <span class="transition-all duration-100 cursor-pointer" :class="newNews.highlighted ? 'text-green-800 border-b-2 border-b-green-600 font-semibold' : ''" @click="newNews.admin=true">{{labels.form.highlighted}}</span>
          </NFormItem>
        </div>
        <NFormItem path="title" :label="labels.form.title" class="col-span-full">
          <NInput :placeholder="labels.form.title" v-model:value="newNews.title" :showCount="true" :maxlength="MAX_LENGTH_180" :minlength="MIN_LENGTH_5"/>
        </NFormItem>
        <div class="flex flex-row gap-2 col-span-full">
          <NFormItem path="date_from" :label="labels.form.dateFrom" class="w-full">
            <NDatePicker v-model:value="newNews.date_from" type="date" class="w-full"  format="dd/MM/yyyy" />
          </NFormItem>
          <NFormItem path="date_to" :label="labels.form.dateTo" class="w-full">
            <NDatePicker v-model:value="newNews.date_to" type="date" class="w-full" format="dd/MM/yyyy" />
          </NFormItem>
        </div>
        <NFormItem path="content" :label="labels.form.content" class="col-span-full">
          <NInput :placeholder="labels.form.content" type="textarea" v-model:value="newNews.content" :showCount="true"/>
        </NFormItem>
        <div class="flex flex-row gap-2 col-span-full">
          <NFormItem path="department" :label="labels.form.tags" class="w-full">
            <NSelect
              v-model:value="newNews.tag_ids"
              filterable
              round
              multiple
              tag
              :placeholder="labels.form.tags"
              :options="tagsOptions"
            />
          </NFormItem>
          <NFormItem path="service" :label="labels.form.category" class="w-full">
            <NSelect
              v-model:value="newNews.category_id"
              filterable
              round
              tag
              :placeholder="labels.form.category"
              :options="categoriesOptions"
            />
          </NFormItem>
        </div>
        <!-- Not implemented yet -->
        <NFormItem path="images" :label="labels.form.images">
          <NUpload
            directory-dnd
            :action="`${BE_PATH}/upload`"
            :custom-request="uploadImages"
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
        <NFormItem path="attachments" :label="labels.form.attachments">
          <NUpload
            directory-dnd
            :action="`${BE_PATH}/upload`"
            :custom-request="uploadAttachments"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
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
                {{labels.form.uploader.doc}}
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
          <NButton round secondary type="success" :disabled="showError" @click="createOrUpdateNews">
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
import { useMessage, NDatePicker, NUpload, NUploadDragger, NText, NP, NModal, NCard, NButton, NIcon, NInput, NForm, NFormItem, NSelect, NSwitch, NInputNumber, NInputGroup, NInputGroupLabel } from 'naive-ui';
import { ref, computed, watch } from 'vue'
import { Call, Location, Mail, MapSharp, Save, Archive } from '@vicons/ionicons5'
import { createNews, updateNews, uploadImage, getNewsTags, getNewsCategories, createNewsTag, createNewsCategory } from '~/api';
import { MIN_LENGTH_5, MAX_LENGTH_180, MIN_LENGTH_NAME, MAX_LENGTH_NAME, MIN_LENGTH_USERNAME, MAX_LENGTH_USERNAME, MIN_INTERNO, MAX_INTERNO, EMAIL_DOMAIN } from '@/utils/constants';
import labels from '@/utils/labels/it.json'
import mongoose from "mongoose"
import { slugify } from '@/utils/utils'

const message = useMessage()

const props = defineProps({
  news: {
    title: "",
    date_from: null,
    date_to: null,
    category_id: "",
    tag_ids: [],
    visible: true,
    highlighted: false,
    images: [],
    attachments: [],
  }
})
const emit = defineEmits(['close'])

const show = ref(false)
const showError = ref(true)
const loading = ref(false)

const images = ref([])
const attachments = ref([])

const categories = ref([])
const categoriesOptions = ref([])
const categoryCreated = ref("")

const tags = ref([])
const tagsOptions = ref([])
const tagsCreated = ref([])

const defaultNews = {
  title: "",
  date_from: null,
  date_to: null,
  category_id: "",
  tag_ids: [],
  visible: true,
  highlighted: false,
  images: [],
  attachments: [],
}

const isCreate = ref(false)
const newNews = ref({...defaultNews})

const rules = ref({
  title: [
    {
      required: true,
      message: labels.validations.required,
      trigger: ['input', 'blur']
    },
    {
      min: MIN_LENGTH_5,
      message: labels.validations.min5,
      trigger: ["input", "blur"]
    },
    {
      max: MAX_LENGTH_180,
      message: labels.validations.max180,
      trigger: ["input", "blur"]
    },
  ],
  date_from: [],
  date_to: [],
  category_id: [
    {
      required: true,
      message: labels.validations.required,
      trigger: ['input', 'blur']
    },
  ],
  phone: [],
  content: [],
  tag_ids: [],
})

const createNewsTagMethod = async (tag) => {
  try{
    const res = await createNewsTag(tag)
    tagsCreated.value.push(res?.insertedId)
  } catch (err) {
    console.error("ERROR: ", err)
  }
}

const createNewsCategoryMethod = async (category) => {
  try{
    const res = await createNewsCategory(category)
    categoryCreated.value = res?.insertedId
  } catch (err) {
    console.error("ERROR: ", err)
  }
}

const createOrUpdateNews = async () => {
  try{
    loading.value = true

    if(newNews.value.tag_ids.length){
      const newTags = newNews.value.tag_ids.filter(tagId => !tags.value.some(tag => tag._id === tagId));
      for (const tag of newTags) {
        await createNewsTagMethod({ name: tag });
      }
      newNews.value.tag_ids = newNews.value.tag_ids.filter(t => tags.value.map(tag => tag._id).includes(t))
      newNews.value.tag_ids = [...newNews.value.tag_ids, ...tagsCreated.value]
    }

    if(!categories.value.some(category => category._id === newNews.value.category_id)){
      await createNewsCategoryMethod({ name: newNews.value.category_id });
      newNews.value.category_id = categoryCreated.value	
    }

    if(isCreate.value) {
      await createNews(newNews.value)
      message.success(labels.alerts.newsCreated)
      // TODO: Delete files if news creation fails
    } else {
      await updateNews(newNews.value)
      message.success(labels.alerts.newsUpdated)
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
    return labels.news.update.title
  else
    return labels.news.create.title
})

const uploadAttachments = async ({
  file,
  data,
  headers,
  action,
  onFinish,
  onError,
  onProgress
}) => {
  try{
    const formData = new FormData();
    formData.append("attachments", file.file);
    const res = await uploadAttachment(formData, slugify(newNews.value.title))
    newNews.value.photo = res.avatarUrl
    message.success(labels.alerts.attachmentUploaded)
  } catch (err) {
    console.error("ERROR: ", err)
    message.error(labels.errors.generic)
  }
};

const uploadImages = async ({
  file,
  data,
  headers,
  action,
  onFinish,
  onError,
  onProgress
}) => {
  try{
    const formData = new FormData();
    formData.append("images", file.file);
    const res = await uploadImage(formData, slugify(newNews.value.title))
    newNews.value.photo = res.avatarUrl
    message.success(labels.alerts.imageUploaded)
  } catch (err) {
    console.error("ERROR: ", err)
    message.error(labels.errors.generic)
  }
};

const getNewsTagsData = async () => {
  try{
    const res = await getNewsTags()
    tags.value = res
    tagsOptions.value = res.map((tag) => {
      return {
        label: tag.name,
        value: tag._id
      }
    })
  } catch (err) {
    console.error("ERROR: ", err)
  }
}

const getNewsCategoriesData = async () => {
  try{
    const res = await getNewsCategories()
    categories.value = res
    categoriesOptions.value = res.map((category) => {
      return {
        label: category.name,
        value: category._id
      }
    })
  } catch (err) {
    console.error("ERROR: ", err)
  }
}

watch(show, async (newShowValue) => {
  console.log("SHOW: ", newShowValue)
  await getNewsTagsData()
  await getNewsCategoriesData()
  if(!newShowValue){
    newNews.value={...defaultNews}
    emit('close')
  } else {
    if(props.news){
      newNews.value = { ...props.news }
    } else {
      newNews.value = {...defaultNews}
    }
    isCreate.value = !Boolean(props.news?.email)
  }
})

watch(newNews, 
  (newValue) => {
    showError.value = (newValue.title?.length < MIN_LENGTH_5 || newValue.title?.length > MAX_LENGTH_180)
  },
  { deep: true }
)

defineExpose({
  show
})
</script>