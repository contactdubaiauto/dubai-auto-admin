import { request } from '@/shared/lib/api'
import type { IDrivetrainForm } from '../types'

const URL = '/api/v1/admin/drivetrains'

export default {
  getDrivetrains,
  createDrivetrain,
  updateDrivetrain,
  deleteDrivetrain
}

async function getDrivetrains() {
  try {
    return await request({ url: URL, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET DRIVETRAINS')
  }
}

async function createDrivetrain({ data }: { data: IDrivetrainForm }) {
  try {
    return await request({ url: URL, data: data, method: 'POST' })
  } catch (e) {
    throw new Error('ERROR ON CREATE DRIVETRAIN')
  }
}

async function updateDrivetrain({ id, data }: { id: string | number; data: IDrivetrainForm }) {
  try {
    return await request({ url: `${URL}/${id}`, data: data, method: 'PUT' })
  } catch (e) {
    throw new Error('ERROR ON UPDATE DRIVETRAIN')
  }
}

async function deleteDrivetrain({ id }: { id: string | number }) {
  try {
    return await request({ url: `${URL}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE DRIVETRAIN')
  }
}
