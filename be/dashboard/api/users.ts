import { BE_PATH } from '@/utils/constants'

const COLLECTION = 'users'

const getUsers = async () => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}`)
  return data
}

const getUser = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`)
  return data
}

const updateUser = async (user: object) => {
  const id = user._id
  const body = { ...user }

  if(body?.department_info)
    delete body.department_info
  if(body?.service_info)
    delete body.service_info
  if(body?.office_info)
    delete body.office_info
  delete body._id

  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'PATCH',
    body
  })
  return data
}

const createUser = async (body: object) => {
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

const deleteUser = async (id: string) => {
  const data = await $fetch(`${BE_PATH}/${COLLECTION}/${id}`, {
    method: 'DELETE'
  })
  return data
}

export {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser
}