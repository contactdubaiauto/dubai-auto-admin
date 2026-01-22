import { request } from '@/shared/lib/api'

const URL = '/api/v1/admin/reports'

export default {
  getReports
}

async function getReports() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET REPORTS')
  }
}
