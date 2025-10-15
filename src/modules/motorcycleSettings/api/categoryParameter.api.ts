import { request } from '@/shared/lib/api'
import type { ICategoryParameterForm } from '../types'

const URL = '/api/v1/admin/moto-categories'

export default {
  getCategoryParameters,
  createCategoryParameter,
  updateCategoryParameter,
  deleteCategoryParameter
}

async function getCategoryParameters({ categoryId }: { categoryId: number | string }) {
  try {
    return await request({ url: `${URL}/${categoryId}/parameters`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET CATEGORY PARAMETERS')
  }
}

async function createCategoryParameter({
  categoryId,
  data
}: {
  categoryId: string | number
  data: ICategoryParameterForm
}) {
  try {
    return await request({ url: `${URL}/${categoryId}/parameters`, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE CATEGORY PARAMETER')
  }
}

async function updateCategoryParameter({
  categoryId,
  id,
  data
}: {
  categoryId: string | number
  id: string | number
  data: ICategoryParameterForm
}) {
  try {
    return await request({ url: `${URL}/${categoryId}/parameters/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE CATEGORY PARAMETER')
  }
}

async function deleteCategoryParameter({ categoryId, id }: { categoryId: string | number; id: string | number }) {
  try {
    return await request({ url: `${URL}/${categoryId}/parameters/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE CATEGORY PARAMETER')
  }
}
