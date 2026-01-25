import { request } from '@/shared/lib/api'

const URL_CARS = '/api/v1/admin/cars'
const URL_MOTORCYCLES = '/api/v1/admin/motorcycles'
const URL_TRUCKS = '/api/v1/admin/comtrans'

export default {
  getCars,
  getCar,
  deleteCar,
  moderateCar,
  getMotorcycles,
  getMotorcycle,
  deleteMotorcycle,
  moderateMotorcycle,
  getTrucks,
  getTruck,
  deleteTruck,
  moderateTruck
}

async function getCars({ params }: { params: any }) {
  try {
    return await request({ url: URL_CARS, method: 'GET', params })
  } catch (e) {
    throw new Error('ERROR ON GET CARS')
  }
}

async function getCar({ id }: { id: string }) {
  try {
    return await request({ url: `${URL_CARS}/${id}`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET CAR')
  }
}

async function deleteCar({ id }: { id: string }) {
  try {
    return await request({ url: `${URL_CARS}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE CAR')
  }
}

async function moderateCar({ data }: { data: { id: number; status: number; title?: string; description?: string } }) {
  try {
    return await request({ url: `${URL_CARS}/moderate`, method: 'POST', data })
  } catch (e) {
    throw new Error('ERROR ON MODERATE CAR')
  }
}

async function getMotorcycles({ params }: { params: any }) {
  try {
    return await request({ url: URL_MOTORCYCLES, method: 'GET', params })
  } catch (e) {
    throw new Error('ERROR ON GET MOTORCYCLES')
  }
}

async function getMotorcycle({ id }: { id: string }) {
  try {
    return await request({ url: `${URL_MOTORCYCLES}/${id}`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET MOTORCYCLE')
  }
}

async function deleteMotorcycle({ id }: { id: string }) {
  try {
    return await request({ url: `${URL_MOTORCYCLES}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE MOTORCYCLE')
  }
}

async function getTrucks({ params }: { params: any }) {
  try {
    return await request({ url: URL_TRUCKS, method: 'GET', params })
  } catch (e) {
    throw new Error('ERROR ON GET TRUCKS')
  }
}

async function getTruck({ id }: { id: string }) {
  try {
    return await request({ url: `${URL_TRUCKS}/${id}`, method: 'GET' })
  } catch (e) {
    throw new Error('ERROR ON GET TRUCK')
  }
}

async function deleteTruck({ id }: { id: string }) {
  try {
    return await request({ url: `${URL_TRUCKS}/${id}`, method: 'DELETE' })
  } catch (e) {
    throw new Error('ERROR ON DELETE TRUCK')
  }
}

async function moderateMotorcycle({ data }: { data: { id: number; status: number; title?: string; description?: string } }) {
  try {
    return await request({ url: `${URL_MOTORCYCLES}/moderate`, method: 'POST', data })
  } catch (e) {
    throw new Error('ERROR ON MODERATE MOTORCYCLE')
  }
}

async function moderateTruck({ data }: { data: { id: number; status: number; title?: string; description?: string } }) {
  try {
    return await request({ url: `${URL_TRUCKS}/moderate`, method: 'POST', data })
  } catch (e) {
    throw new Error('ERROR ON MODERATE TRUCK')
  }
}
