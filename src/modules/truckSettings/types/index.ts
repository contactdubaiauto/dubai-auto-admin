export interface ICategory {
  id: number
  name: string
  name_ru: string
  name_ae: string
  created_at: string
}

export interface ICategoryItem extends ICategory {
  index: number
}

export interface ICategoryForm {
  name: string
  name_ru: string
  name_ae: string
}

export interface IBrand {
  id: number
  name: string
  name_ru: string
  name_ae: string
  image: string
  comtrans_category_id: number
  comtrans_category_name: string
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
  comtrans_brand_id: number
  comtrans_brand_name: string
  comtrans_brand_name_ru: string
  created_at: string
}

export interface IModelItem extends IModel {
  index: number
}
export interface IModelForm {
  comtrans_brand_id: number | string
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
