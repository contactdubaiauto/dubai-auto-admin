import { request } from '@/shared/lib/api'
import type { IParameterValueForm } from '../types'

const URL = '/api/v1/admin/comtrans-parameters'

export default {
  getParameterValues,
  createParameterValue,
  updateParameterValue,
  deleteParameterValue
}

async function getParameterValues({ parameterId }: { parameterId: number | string }) {
  try {
    return await request({ url: `${URL}/${parameterId}/values`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET PARAMETER VALUES')
  }
}

async function createParameterValue({
  parameterId,
  data
}: {
  parameterId: string | number
  data: IParameterValueForm
}) {
  try {
    return await request({ url: `${URL}/${parameterId}/values`, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE PARAMETER VALUE')
  }
}

async function updateParameterValue({
  parameterId,
  id,
  data
}: {
  parameterId: string | number
  id: string | number
  data: IParameterValueForm
}) {
  try {
    return await request({ url: `${URL}/${parameterId}/values/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE PARAMETER VALUE')
  }
}

async function deleteParameterValue({ parameterId, id }: { parameterId: string | number; id: string | number }) {
  try {
    return await request({ url: `${URL}/${parameterId}/values/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE PARAMETER VALUE')
  }
}
