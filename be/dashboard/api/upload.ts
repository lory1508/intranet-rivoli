import { BE_PATH } from '@/utils/constants'

const uploadImage = async (body: object, subpath: string) => {
  try{
    const data = await $fetch(`${BE_PATH}/upload?subpath=${subpath}`, {
      method: 'POST',
      body
    })
    return data
  } catch(err) {
    console.error(err)
  }
}

const getImage = async (filePath: string) => {
  try{
    const data = await $fetch(`${BE_PATH}${filePath}`)
    return data
  } catch(err) {
    console.error(err)
  }
}

export {
  uploadImage,
  getImage
}