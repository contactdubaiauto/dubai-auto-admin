import { request } from '@/shared/lib/api'
import type { ILoginForm } from '../types'

const URL = '/api/v1/auth/admin-login'

export default {
  login
}

async function login({ form }: { form: ILoginForm }) {
  try {
    return await request({ url: `${URL}`, data: form, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON LOGIN')
  }
}
