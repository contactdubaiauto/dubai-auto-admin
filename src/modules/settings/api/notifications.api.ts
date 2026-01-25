import { request } from '@/shared/lib/api'
import type { INotificationForm } from '../types'

const URL = '/api/v1/admin/users/notifications'

export default {
  getNotifications,
  sendNotification
}

async function getNotifications() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET NOTIFICATIONS')
  }
}

async function sendNotification({ data }: { data: INotificationForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON SEND NOTIFICATION')
  }
}
