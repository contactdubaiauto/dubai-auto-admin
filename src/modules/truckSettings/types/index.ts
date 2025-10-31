export interface ICategory {
  id: number
  name: string
  name_ru: string
  created_at: string
}

export interface ICategoryItem extends ICategory {
  index: number
}

export interface ICategoryForm {
  name: string
  name_ru: string
}

export interface ICategoryParameter {
  id: number
  comtrans_category_id: number
  comtrans_parameter_id: number
  created_at: string
  comtrans_parameter_name: string
}

export interface ICategoryParameterItem extends ICategoryParameter {
  index: number
}

export interface ICategoryParameterForm {
  comtrans_parameter_id: number
}

export interface IBrand {
  id: number
  name: string
  name_ru: string
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
  comtrans_category_id: number
  name: string
  name_ru: string
}

export interface IModel {
  id: number
  name: string
  name_ru: string
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
}

export interface IParameter {
  id: number
  name: string
  name_ru: string
  comtrans_category_id: number
  comtrans_category_name: string
  created_at: string
}

export interface IParameterItem extends IParameter {
  index: number
}
export interface IParameterForm {
  comtrans_category_id: number
  name: string
  name_ru: string
}

export interface IParameterValue {
  id: number
  name: string
  name_ru: string
  comtrans_parameter_id: number
  created_at: string
}

export interface IParameterValueItem extends IParameterValue {
  index: number
}
export interface IParameterValueForm {
  name: string
}
