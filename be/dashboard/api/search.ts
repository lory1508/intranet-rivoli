import { BE_PATH } from '@/utils/constants'

const COLLECTION = 'search'

const getSearch = async (q: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}?q=${q}`)
  return data
}

export {
  getSearch
}