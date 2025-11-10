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

export interface ICategoryParameter {
  id: number
  moto_category_id: number
  moto_parameter_id: number
  created_at: string
  moto_parameter_name: string
}

export interface ICategoryParameterItem extends ICategoryParameter {
  index: number
}

export interface ICategoryParameterForm {
  moto_parameter_id: number
}

export interface IBrand {
  id: number
  name: string
  name_ru: string
  name_ae: string
  image: string
  moto_category_id: number
  moto_category_name: string
  created_at: string
}

export interface IBrandItem extends IBrand {
  index: number
}
export interface IBrandForm {
  image: string
  moto_category_id: number
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

export interface IParameter {
  id: number
  name: string
  name_ru: string
  name_ae: string
  moto_category_id: number
  moto_category_name: string
  created_at: string
}

export interface IParameterItem extends IParameter {
  index: number
}
export interface IParameterForm {
  moto_category_id: number
  name: string
  name_ru: string
  name_ae: string
}

export interface IParameterValue {
  id: number
  name: string
  name_ru: string
  name_ae: string
  moto_parameter_id: number
  created_at: string
}

export interface IParameterValueItem extends IParameterValue {
  index: number
}
export interface IParameterValueForm {
  name: string
  name_ru: string
  name_ae: string
}
