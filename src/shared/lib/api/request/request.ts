import axios from 'axios'
import { useCookies } from 'vue3-cookies'
import type { IRequest } from './types'
import router from '@/router'

const rawBase = (import.meta.env as any).VITE_APP_BASE_URL as string | undefined
let baseURL =
  !rawBase || rawBase === 'undefined' || rawBase === 'null' || rawBase === '/'
    ? ''
    : String(rawBase).replace(/\/+$/, '')

export async function request({
  baseUrl = baseURL,
  url,
  method = 'POST',
  headers = {},
  params = {},
  data = {},
  onUploadProgress = {},
  isFormData = false,
  responseType = 'json',
  options = {}
}: IRequest) {
  const { cookies } = useCookies()

  if (isFormData) {
    const formData = new FormData()
    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'multipart/form-data'

    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value)
    }
    data = formData
  }

  if (cookies.get('Authorization')) {
    headers['Authorization'] = `Bearer ${cookies.get('access_token')}`
  }

  try {
    const response = await axios({
      url: `${baseUrl}${url}`,
      method,
      headers,
      ...onUploadProgress,
      params,
      data,
      responseType,
      ...options
    })
    return response.data
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      cookies.remove('access_token')
      cookies.remove('refresh_token')
      router.push('/login')
    } else {
      throw error
    }
  }
}
