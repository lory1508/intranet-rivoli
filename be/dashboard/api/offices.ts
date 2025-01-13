import { BE_PATH } from '@/utils/constants'

const COLLECTION = 'offices'

const getOffices = async () => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}`)
  return data
}

const getOffice = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`)
  return data
}

const updateOffice = async (office: object) => {
  const id = office._id
  const body = { ...office }
  delete body.department_info
  if(body?.service_info)
    delete body.service_info
  delete body._id
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'PATCH',
    body
  })
  return data
}

const createOffice = async (body: object) => {
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

const deleteOffice = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'DELETE'
  })
  return data
}

export {
  getOffices,
  getOffice,
  updateOffice,
  createOffice,
  deleteOffice
}