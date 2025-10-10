import { request } from '@/shared/lib/api'
import type { ITransmissionForm } from '../types'

const URL = '/api/v1/admin/transmissions'

export default {
  getTransmissions,
  createTransmission,
  updateTransmission,
  deleteTransmission
}

async function getTransmissions() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET TRANSMISSIONS')
  }
}

async function createTransmission({ data }: { data: ITransmissionForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE TRANSMISSION')
  }
}

async function updateTransmission({ id, data }: { id: string | number; data: ITransmissionForm }) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE TRANSMISSION')
  }
}

async function deleteTransmission({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE TRANSMISSION')
  }
}
