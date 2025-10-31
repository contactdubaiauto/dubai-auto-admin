import { request } from '@/shared/lib/api'

const URL = '/api/v1/admin/activity-fields'

export default {
  getActivityFields,
  createActivityField,
  updateActivityField,
  deleteActivityField
}

async function getActivityFields() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET ACTIVITY FIELDS')
  }
}

async function createActivityField({ data }: any) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE ACTIVITY FIELD')
  }
}

async function updateActivityField({ id, data }: any) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE ACTIVITY FIELD')
  }
}

async function deleteActivityField({ id }: any) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE ACTIVITY FIELD')
  }
}
