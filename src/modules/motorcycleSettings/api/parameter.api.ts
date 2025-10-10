import { request } from '@/shared/lib/api'
import type { IParameterForm } from '../types'

const URL = '/api/v1/admin/moto-parameters'

export default {
  getParameters,
  createParameter,
  updateParameter,
  deleteParameter
}

async function getParameters() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET PARAMETERS')
  }
}

async function createParameter({ data }: { data: IParameterForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE PARAMETER')
  }
}

async function updateParameter({ id, data }: { id: string | number; data: IParameterForm }) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE PARAMETER')
  }
}

async function deleteParameter({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE PARAMETER')
  }
}
