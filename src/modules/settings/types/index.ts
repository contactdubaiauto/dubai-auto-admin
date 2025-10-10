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
}
export interface IColor {
  id: number
  name: string
  image: string
  created_at: string
}

export interface IColorItem extends IColor {
  index: number
}
