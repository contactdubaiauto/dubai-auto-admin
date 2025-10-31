export interface ICityForm {
  name: string
}
export interface ICity {
  id: number
  name: string
  created_at: string
}

export interface ICityItem extends ICity {
  index: number
}

export interface IRegionForm {
  name: string
}
export interface IRegion {
  id: number
  name: string
  created_at: string
}

export interface IRegionItem extends IRegion {
  index: number
}

export interface IColorForm {
  image: string
  name: string
  name_ru: string
}
export interface IColor {
  id: number
  name: string
  name_ru: string
  image: string
  created_at: string
}

export interface IColorItem extends IColor {
  index: number
}

export interface IActivityFieldForm {
  name: string
  name_ru: string
}
export interface IActivityField extends IActivityFieldForm {
  id: number
  created_at: string
}

export interface IActivityFieldItem extends IActivityField {
  index: number
}

export interface ICompanyTypeForm {
  name: string
  name_ru: string
}
export interface ICompanyType extends ICompanyTypeForm {
  id: number
  created_at: string
}

export interface ICompanyTypeItem extends ICompanyType {
  index: number
}
