import { request } from '@/shared/lib/api'

const URL = '/api/v1/admin/company-types'

export default {
  getCompanyTypes,
  createCompanyType,
  updateCompanyType,
  deleteCompanyType
}

async function getCompanyTypes() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET COMPANY TYPES')
  }
}

async function createCompanyType({ data }: any) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE COMPANY TYPE')
  }
}

async function updateCompanyType({ id, data }: any) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE COMPANY TYPE')
  }
}

async function deleteCompanyType({ id }: any) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE COMPANY TYPE')
  }
}
