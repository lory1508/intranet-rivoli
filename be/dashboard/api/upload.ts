import { BE_PATH } from '@/utils/constants'

const COLLECTION = 'upload'

const uploadImage = async (body: object) => {
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

export {
  uploadImage
}