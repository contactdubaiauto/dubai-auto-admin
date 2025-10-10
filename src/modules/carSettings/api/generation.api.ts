import { request } from '@/shared/lib/api'
import type { IGenerationForm } from '../types'

const URL = '/api/v1/admin/generations'

export default {
  getGenerations,
  getModelGenerations,
  createGeneration,
  updateGeneration,
  deleteGeneration,
  createGenerationImage
}

async function getGenerations() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET GENERATIONS')
  }
}
async function getModelGenerations({ brandId, modelId }: { brandId: string | number; modelId: string | number }) {
  try {
    return await request({ url: `/api/v1/admin/brands/${brandId}/models/${modelId}/generations`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET GENERATIONS')
  }
}

async function createGeneration({ data }: { data: IGenerationForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE GENERATION')
  }
}

async function updateGeneration({ id, data }: { id: string | number; data: IGenerationForm }) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE GENERATION')
  }
}

async function deleteGeneration({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE GENERATION')
  }
}

async function createGenerationImage({ id, data }: any) {
  try {
    return await request({ url: `${URL}/${id}/images`, data: data, method: 'POST', isFormData: true })
  } catch (e) {
    throw new Error('ERROR ON CREATE GENERATION IMAGE')
  }
}
