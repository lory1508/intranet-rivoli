import { BE_PATH } from '@/utils/constants'

const COLLECTION = 'newsTags'

const getNewsTags = async () => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}`)
  return data
}

const getNewsTag = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`)
  return data
}

const updateNewsTag = async (newsTag: object) => {
  const id = newsTag._id
  const body = { ...newsTag }
  delete body._id
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'PATCH',
    body
  })
  return data
}

const createNewsTag = async (body: object) => {
  try{
    const data = await $fetch(`${BE_PATH}/${COLLECTION}`, {
      method: 'POST',
      body
    })
    return data
  } catch(err) {
    console.error(err)
  }
}

const deleteNewsTag = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'DELETE'
  })
  return data
}

export {
  getNewsTags,
  getNewsTag,
  updateNewsTag,
  createNewsTag,
  deleteNewsTag
}