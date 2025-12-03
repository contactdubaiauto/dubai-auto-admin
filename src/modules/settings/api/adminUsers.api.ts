import { request } from '@/shared/lib/api'
import type { IAdminUserForm } from '../types'

const URL = '/api/v1/admin/users'

export default {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
}

async function getAdminUsers({ params }: any) {
  try {
    return await request({ url: URL, params, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET ADMIN USERS')
  }
}

async function createAdminUser({ data }: { data: IAdminUserForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE ADMIN USER')
  }
}

async function updateAdminUser({ id, data }: { id: string | number; data: IAdminUserForm }) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE ADMIN USER')
  }
}

async function deleteAdminUser({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE ADMIN USER')
  }
}
