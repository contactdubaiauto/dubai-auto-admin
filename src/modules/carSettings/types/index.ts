export interface IBodyType {
  id: number
  name: string
  image: string
  created_at: string
}

export interface IBodyTypeItem extends IBodyType {
  index: number
}

export interface IBodyTypeForm {
  image: string
  name: string
}

export interface IBodyTypeImage {
  image: File
}

export interface IBrand {
  id: number
  name: string
  model_count: number
  logo: string
  popular: boolean
  updated_at: string
}

export interface IBrandItem extends IBrand {
  index: number
}

export interface IBrandForm {
  logo: string
  name: string
  popular: boolean
}

export interface IModel {
  id: number
  name: string
  popular: boolean
}

export interface IModelItem extends IModel {
  index: number
}

export interface IModelForm {
  name: string
  popular: boolean
  brand_id?: number | string
}

export interface IGeneration {
  id: number
  model_id: number
  name: string
  model_name: string
  image: string
  start_year: number
  end_year: number
  wheel: boolean
  created_at: string
}

export interface IGenerationItem extends IGeneration {
  index: number
}

export interface IGenerationForm {
  model_id: number
  name: string
  image: string
  end_year: number
  start_year: number
  wheel: boolean
}

export interface IGenerationModification {
  body_type_name: string
  engine_value: string
  fuel_type_name: string
  drivetrain_name: string
  transmission_name: string
  id: number
  generation_id: number
  body_type_id: number
  engine_id: number
  fuel_type_id: number
  drivetrain_id: number
  transmission_id: number
}

export interface IGenerationModificationItem extends IGenerationModification {
  index: number
}

export interface IGenerationModificationForm {
  body_type_id: number
  drivetrain_id: number
  engine_id: number
  fuel_type_id: number
  transmission_id: number
}

export interface IDrivetrain {
  id: number
  name: string
  created_at: string
}

export interface IDrivetrainItem extends IDrivetrain {
  index: number
}

export interface IDrivetrainForm {
  name: string
}

export interface IEngine {
  id: number
  value: string
  created_at: string
}

export interface IEngineItem extends IEngine {
  index: number
}

export interface IEngineForm {
  value: string
}

export interface IFuelType {
  id: number
  name: string
  created_at: string
}

export interface IFuelTypeItem extends IFuelType {
  index: number
}

export interface IFuelTypeForm {
  name: string
}

export interface ITransmission {
  id: number
  name: string
  created_at: string
}

export interface ITransmissionItem extends ITransmission {
  index: number
}

export interface ITransmissionForm {
  name: string
}
