import { BE_PATH } from '@/utils/constants'

const COLLECTION = 'services'

const getServices = async (filter = {}) => {
  let queryString = ''
  if(Object.keys(filter).length > 0){
    queryString = `?${Object.keys(filter).map(key => `${key}=${filter[key]}`).join('&')}`
  }
  const data = await $fetch(`${BE_PATH}/${COLLECTION}${queryString}`)
  return data
}

const getService = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`)
  return data
}

const updateService = async (service: object) => {
  const id = service._id
  const body = { ...service }
  delete body.department_info
  delete body._id
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'PATCH',
    body
  })
  return data
}

const createService = async (body: object) => {
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

const deleteService = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'DELETE'
  })
  return data
}

export {
  getServices,
  getService,
  updateService,
  createService,
  deleteService
}