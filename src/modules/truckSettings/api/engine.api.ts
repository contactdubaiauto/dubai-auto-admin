import { request } from '@/shared/lib/api'
import type { IEngineForm } from '../types'

const URL = '/api/v1/admin/comtrans-engines'

export default {
  getEngines,
  createEngine,
  updateEngine,
  deleteEngine
}

async function getEngines() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET ENGINES')
  }
}

async function createEngine({ data }: { data: IEngineForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE ENGINE')
  }
}

async function updateEngine({ id, data }: { id: string | number; data: IEngineForm }) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE ENGINE')
  }
}

async function deleteEngine({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE ENGINE')
  }
}
