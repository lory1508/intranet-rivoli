import { BE_PATH } from '@/utils/constants'

const COLLECTION = 'departments'

const getDepartments = async () => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}`)
  return data
}

const getDepartment = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`)
  return data
}

const updateDepartment = async (department: object) => {
  const id = department._id
  const body = { ...department }
  delete body._id
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'PATCH',
    body
  })
  return data
}

const createDepartment = async (body: object) => {
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

const deleteDepartment = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'DELETE'
  })
  return data
}

export {
  getDepartments,
  getDepartment,
  updateDepartment,
  createDepartment,
  deleteDepartment
}