import { request } from '@/shared/lib/api'
import type { IModelForm } from '../types'

const URL = '/api/v1/admin/comtrans-models'

export default {
  getModels,
  createModel,
  updateModel,
  deleteModel
}

async function getModels() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET MODES')
  }
}

async function createModel({ data }: { data: IModelForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE MODEL')
  }
}

async function updateModel({ id, data }: { id: string | number; data: IModelForm }) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE MODEL')
  }
}

async function deleteModel({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE MODEL')
  }
}
