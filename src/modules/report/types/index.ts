export interface IReportContacts {
  [key: string]: string
}

export interface IReportedUser {
  id: number
  username: string
  avatar: string | null
  role_id: number
  contacts: IReportContacts | null
  email?: string | null
  phone?: string | null
}

export interface IReporter {
  id: number
  username: string
  avatar: string | null
  role_id: number
  contacts: IReportContacts | null
  email?: string | null
  phone?: string | null
}

export interface IReportItem {
  id: number
  brand: string
  model: string
  price: number
  images: string[] | null
}

export interface IReport {
  id: number
  created_at: string
  report_description: string
  report_status: number
  report_type: string
  reported_user_id: number
  reported_user: IReportedUser
  reporter: IReporter
  item_type: string | null
  item_id: number | null
  item: IReportItem | null
}
