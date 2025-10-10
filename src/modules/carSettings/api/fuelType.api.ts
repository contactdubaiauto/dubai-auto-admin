import { request } from '@/shared/lib/api'
import type { IFuelTypeForm } from '../types'

const URL = '/api/v1/admin/fuel-types'

export default {
  getFuelTypes,
  createFuelType,
  updateFuelType,
  deleteFuelType
}

async function getFuelTypes() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET FUEL TYPES')
  }
}

async function createFuelType({ data }: { data: IFuelTypeForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE FUEL TYPE')
  }
}

async function updateFuelType({ id, data }: { id: string | number; data: IFuelTypeForm }) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE FUEL TYPE')
  }
}

async function deleteFuelType({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE FUEL TYPE')
  }
}
