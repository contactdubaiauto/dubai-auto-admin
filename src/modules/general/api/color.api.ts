import { request } from '@/shared/lib/api'

const URL = '/api/v1/admin/colors'

export default {
  getColors,
  createColor,
  updateColor,
  deleteColor,
  createColorImage
}

async function getColors() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET COLORS')
  }
}

async function createColor({ data }: any) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE COLOR')
  }
}

async function updateColor({ id, data }: any) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE COLOR')
  }
}

async function deleteColor({ id }: any) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE COLOR')
  }
}

async function createColorImage({ id, data }: any) {
  try {
    return await request({ url: `${URL}/${id}/images`, data: data, method: 'POST', isFormData: true })
  } catch (e) {
    throw new Error('ERROR ON CREATE COLOR IMAGE')
  }
}
