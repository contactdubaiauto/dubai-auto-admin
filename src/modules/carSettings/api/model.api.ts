import { request } from '@/shared/lib/api'
import type { IModelForm } from '../types'

const URL = '/api/v1/admin/brands'

export default {
  getModels,
  createModel,
  updateModel,
  deleteModel
}

async function getModels({ brandId }: { brandId: number | string }) {
  try {
    return await request({ url: `${URL}/${brandId}/models`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET MODELS')
  }
}

async function createModel({ brandId, data }: { brandId: number | string; data: IModelForm }) {
  try {
    return await request({ url: `${URL}/${brandId}/models`, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE MODEL')
  }
}

async function updateModel({ brandId, id, data }: { brandId: number | string; id: number | string; data: IModelForm }) {
  try {
    return await request({ url: `${URL}/${brandId}/models/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE MODEL')
  }
}

async function deleteModel({ brandId, id }: { brandId: number | string; id: number | string }) {
  try {
    return await request({ url: `${URL}/${brandId}/models/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE MODEL')
  }
}
