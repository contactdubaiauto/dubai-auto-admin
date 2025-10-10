import { request } from '@/shared/lib/api'

const URL = '/api/v1/admin/body-types'

export default {
  getBodyTypes,
  createBodyType,
  updateBodyType,
  createBodyTypeImage,
  deleteBodyType,
  deleteBodyTypeImage
}

async function getBodyTypes() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET BODY TYPES')
  }
}

async function createBodyType({ data }: any) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE BODY TYPE')
  }
}

async function updateBodyType({ id, data }: any) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE BODY TYPE')
  }
}

async function createBodyTypeImage({ id, data }: any) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'POST', isFormData: true })
  } catch (e) {
    throw new Error('ERROR ON CREATE BODY TYPE IMAGE')
  }
}

async function deleteBodyType({ id }: { id: number | string }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE BODY TYPE')
  }
}

async function deleteBodyTypeImage({ id }: { id: number | string }) {
  try {
    return await request({ url: `${URL}/${id}/images`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE BODY TYPE IMAGE')
  }
}
