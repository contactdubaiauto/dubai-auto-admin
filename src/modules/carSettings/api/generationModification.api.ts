import { request } from '@/shared/lib/api'
import type { IGenerationModificationForm } from '../types'

const URL = '/api/v1/admin/generations'

export default {
  getGenerationModifications,
  createGenerationModification,
  updateGenerationModification,
  deleteGenerationModification
}

async function getGenerationModifications({ generationId }: { generationId: number | string }) {
  try {
    return await request({ url: `${URL}/${generationId}/`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET GENERATION MODIFICATIONS')
  }
}

async function createGenerationModification({
  generationId,
  data
}: {
  generationId: number | string
  data: IGenerationModificationForm
}) {
  try {
    return await request({ url: `${URL}/${generationId}/`, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE GENERATION MODIFICATION')
  }
}

async function updateGenerationModification({
  generationId,
  id,
  data
}: {
  generationId: number | string
  id: number | string
  data: IGenerationModificationForm
}) {
  try {
    return await request({ url: `${URL}/${generationId}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE GENERATION MODIFICATION')
  }
}

async function deleteGenerationModification({
  generationId,
  id
}: {
  generationId: number | string
  id: number | string
}) {
  try {
    return await request({ url: `${URL}/${generationId}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE GENERATION MODIFICATION')
  }
}
