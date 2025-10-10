import { request } from '@/shared/lib/api'
import type { IRegionForm } from '../types'

const URL = '/api/v1/admin/cities'

export default {
  getRegions,
  createRegion,
  updateRegion,
  deleteRegion
}

async function getRegions({ cityId }: { cityId: number | string }) {
  try {
    return await request({ url: `${URL}/${cityId}/regions`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET REGIONS')
  }
}

async function createRegion({ cityId, data }: { cityId: number | string; data: IRegionForm }) {
  try {
    return await request({ url: `${URL}/${cityId}/regions`, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE REGION')
  }
}

async function updateRegion({ cityId, id, data }: { cityId: number | string; id: number | string; data: IRegionForm }) {
  try {
    return await request({ url: `${URL}/${cityId}/regions/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE REGION')
  }
}

async function deleteRegion({ cityId, id }: { cityId: number | string; id: number | string }) {
  try {
    return await request({ url: `${URL}/${cityId}/regions/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE REGION')
  }
}
