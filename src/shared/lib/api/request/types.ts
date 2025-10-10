export interface IRequest {
  baseUrl?: string | null
  url: string
  method?: 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'get' | 'post' | 'put' | 'delete' | undefined
  headers?: { [key: string]: string }
  params?: object
  data?: object
  onUploadProgress?: object
  isFormData?: boolean
  options?: any
  responseType?: 'json' | 'blob'
}
