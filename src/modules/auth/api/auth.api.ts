import { request } from '@/shared/lib/api'
import type { ILoginForm } from '../types'

const URL = '/api/v1/auth/admin-login'
const URL_PROFILE = '/api/v1/admin/profile'

export default {
  login,
  getProfile
}

async function login({ form }: { form: ILoginForm }) {
  try {
    return await request({ url: `${URL}`, data: form, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON LOGIN')
  }
}

async function getProfile() {
  try {
    return await request({ url: URL_PROFILE, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET PROFILE')
  }
}
