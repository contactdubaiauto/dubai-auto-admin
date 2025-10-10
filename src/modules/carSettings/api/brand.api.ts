import { request } from '@/shared/lib/api'
import type { IBrandForm } from '../types'

const URL = '/api/v1/admin/brands'

export default {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  createBrandImage
}

async function getBrands() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET BRANDS')
  }
}

async function createBrand({ data }: { data: IBrandForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE BRAND')
  }
}

async function updateBrand({ id, data }: { id: string | number; data: IBrandForm }) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE BRAND')
  }
}

async function deleteBrand({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE BRAND')
  }
}

async function createBrandImage({ id, data }: any) {
  try {
    return await request({ url: `${URL}/${id}/images`, data: data, method: 'POST', isFormData: true })
  } catch (e) {
    throw new Error('ERROR ON CREATE BRAND IMAGE')
  }
}
