import { request } from '@/shared/lib/api'

const URL = '/api/v1/admin/applications'

// 	type = 1,2,3,4
// 	2 dealer, 3 logistic, 4 broker, 5 car service
// status = 1,2,3
// 1 new, 2 accepted, 3 declined

export default {
  getApplications,
  getApplication,
  acceptApplication,
  rejectApplication
}

async function getApplications({ params }: any) {
  try {
    return await request({ url: URL, params, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET APPLICATIONS')
  }
}

async function getApplication({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET APPLICATION')
  }
}

async function acceptApplication({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}/accept`, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON ACCEPT APPLICATION')
  }
}

async function rejectApplication({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}/reject`, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON REJECT APPLICATION')
  }
}
