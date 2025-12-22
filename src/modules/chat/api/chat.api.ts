import { request } from '@/shared/lib/api'
import type { FileUploadResponse } from '../types'

const URL_UPLOAD_FILE = '/api/v1/users/messages/files'
const URL_GET_CONVERSATIONS = '/ws/conversations'

export default {
  uploadFile,
  getConversations,
  getConversationMessages
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

async function getConversations() {
  try {
    return await request({ url: URL_GET_CONVERSATIONS, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET CONVERSATIONS')
  }
}

async function getConversationMessages(id: number, params: any) {
  try {
    return await request({ url: `${URL_GET_CONVERSATIONS}/${id}/messages`, params, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET CONVERSATION MESSAGES')
  }
}
