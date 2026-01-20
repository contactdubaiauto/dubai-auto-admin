export interface ICategoryForm {
  name: string
  name_ru: string
  name_ae: string
}

export interface ICategory extends ICategoryForm {
  id: number
  created_at: string
}

export interface ICategoryItem extends ICategory {
  index: number
}

export interface IBrand {
  id: number
  name: string
  name_ru: string
  name_ae: string
  image: string
  created_at: string
}

export interface IBrandItem extends IBrand {
  index: number
}
export interface IBrandForm {
  image: string
  name: string
  name_ru: string
  name_ae: string
}

export interface IModel {
  id: number
  name: string
  name_ru: string
  name_ae: string
  moto_brand_id: number
  moto_brand_name: string
  created_at: string
}

export interface IModelItem extends IModel {
  index: number
}
export interface IModelForm {
  moto_brand_id: number
  name: string
  name_ru: string
  name_ae: string
}


export interface IEngine {
  id: number
  name: string
  name_ru: string
  name_ae: string
  created_at: string
}

export interface IEngineItem extends IEngine {
  index: number
}

export interface IEngineForm {
  name: string
  name_ru: string
  name_ae: string
}

export interface IStroke {
  id: number
  name: string
  name_ru: string
  name_ae: string
  created_at: string
}

export interface IStrokeItem extends IStroke {
  index: number
}

export interface IStrokeForm {
  name: string
  name_ru: string
  name_ae: string
}
