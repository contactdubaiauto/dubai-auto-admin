export interface ICarOwner {
  avatar: string | null
  username: string | null
  id: number | null
  role_id: number | null
  contacts: string | null
}

export interface ICar {
  id: number
  created_at: string
  updated_at: string
  images: string[]
  videos: string[] | null
  phone_numbers: string[]
  moderation_status: number
  user_role_id: number
  owner: ICarOwner
  brand: string
  region: string | null
  city: string | null
  transmission: string
  engine: string
  drivetrain: string
  fuel_type: string
  vin_code: string
  color: string
  description: string
  status: number
  trade_in: number
  owners: number
  mileage: number
  model: string
  body_type: string
  year: number
  price: number
  view_count: number
  credit: boolean
  new: boolean
  crash: boolean | null
  my_car: boolean
  liked: boolean
}

export interface IMotorcycle {
  id: number
  created_at: string
  updated_at: string
  images: string[] | null
  videos: string[] | null
  phone_numbers: string[]
  moderation_status: number
  user_role_id: number
  owner: ICarOwner
  moto_category: string
  moto_brand: string
  moto_model: string
  engine_type: string
  engine: number
  power: number
  number_of_cycles: string
  city: string | null
  vin_code: string
  color: string
  description: string
  status: string
  trade_in: number
  owners: number
  odometer: number
  year: number
  price: number
  crash: boolean | null
  wheel: boolean
  my_moto: boolean
}

export interface ITruck {
  id: number
  created_at: string
  updated_at: string
  images: string[] | null
  videos: string[] | null
  phone_numbers: string[]
  moderation_status: number
  user_role_id: number
  owner: ICarOwner
  comtran_category: string
  comtran_brand: string
  comtran_model: string
  engine_type: string
  engine: number
  power: number
  city: string | null
  vin_code: string
  color: string
  description: string
  status: string
  trade_in: number
  owners: number
  odometer: number
  year: number
  price: number
  crash: boolean | null
  wheel: boolean | null
  my_comtrans: boolean
}
