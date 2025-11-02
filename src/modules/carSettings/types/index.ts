export interface IBodyTypeForm {
  image: string
  name: string
  name_ru: string
}

export interface IBodyType extends IBodyTypeForm {
  id: number
  created_at: string
}

export interface IBodyTypeItem extends IBodyType {
  index: number
}

export interface IBodyTypeImage {
  image: File
}

export interface IBrand {
  id: number
  name: string
  name_ru: string
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
  name_ru: string
  popular: boolean
}

export interface IModelForm {
  name: string
  name_ru: string
  popular: boolean
  brand_id?: number | string
}

export interface IModel {
  id: number
  name: string
  name_ru: string
  popular: boolean
}

export interface IModelItem extends IModel {
  index: number
}

export interface IGeneration {
  id: number
  model_id: number
  name: string
  name_ru: string
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
  name_ru: string
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

export interface IDrivetrainForm {
  name: string
  name_ru: string
}

export interface IDrivetrain extends IDrivetrainForm {
  id: number
  created_at: string
}

export interface IDrivetrainItem extends IDrivetrain {
  index: number
}

export interface IEngine {
  id: number
  name: string
  name_ru: string
  created_at: string
}

export interface IEngineItem extends IEngine {
  index: number
}

export interface IEngineForm {
  name: string
  name_ru: string
}

export interface IFuelTypeForm {
  name: string
  name_ru: string
}
export interface IFuelType extends IFuelTypeForm {
  id: number
  created_at: string
}

export interface IFuelTypeItem extends IFuelType {
  index: number
}

export interface ITransmissionForm {
  name: string
  name_ru: string
}

export interface ITransmission extends ITransmissionForm {
  id: number
  created_at: string
}

export interface ITransmissionItem extends ITransmission {
  index: number
}
