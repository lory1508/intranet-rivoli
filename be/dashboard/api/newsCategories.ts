import { BE_PATH } from '@/utils/constants'

const COLLECTION = 'newsCategories'

const getNewsCategories = async () => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}`)
  return data
}

const getNewsCategory = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`)
  return data
}

const updateNewsCategory = async (newsCategory: object) => {
  const id = newsCategory._id
  const body = { ...newsCategory }
  delete body._id
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'PATCH',
    body
  })
  return data
}

const createNewsCategory = async (body: object) => {
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

const deleteNewsCategory = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'DELETE'
  })
  return data
}

export {
  getNewsCategories,
  getNewsCategory,
  updateNewsCategory,
  createNewsCategory,
  deleteNewsCategory
}