import { request } from '@/shared/lib/api'
import type { ICategoryForm } from '../types'

const URL = '/api/v1/admin/moto-categories'

export default {
  getCategories,
  getCategoryBrands,
  createCategory,
  updateCategory,
  deleteCategory
}

async function getCategories() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET CATEGORIES')
  }
}

async function getCategoryBrands({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}/brands`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET CATEGORY BRANDS')
  }
}

async function createCategory({ data }: { data: ICategoryForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE CATEGORY')
  }
}

async function updateCategory({ id, data }: { id: string | number; data: ICategoryForm }) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE CATEGORY')
  }
}

async function deleteCategory({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE CATEGORY')
  }
}
