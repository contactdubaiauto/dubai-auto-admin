import { request } from '@/shared/lib/api'
import type { FileUploadResponse } from '../types'

const URL_UPLOAD_FILE = '/api/v1/users/messages/files'

export default {
  uploadFile
}

async function uploadFile(file: File): Promise<FileUploadResponse> {
  try {
    return await request({
      url: URL_UPLOAD_FILE,
      method: 'POST',
      data: { file },
      isFormData: true
    })
  } catch (e) {
    console.error('ERROR ON FILE UPLOAD:', e)
    throw new Error('ERROR ON FILE UPLOAD')
  }
}
