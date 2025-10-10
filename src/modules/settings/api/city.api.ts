import { request } from '@/shared/lib/api'

const URL = '/api/v1/admin/cities'

export default {
  getCities,
  createCity,
  updateCity,
  deleteCity
}

async function getCities() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET CITIES')
  }
}

async function createCity({ data }: any) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE CITY')
  }
}

async function updateCity({ id, data }: any) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE CITY')
  }
}

async function deleteCity({ id }: any) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE CITY')
  }
}
