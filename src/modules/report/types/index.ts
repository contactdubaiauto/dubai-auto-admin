export interface IReportContacts {
  [key: string]: string
}

export interface IReportedUser {
  id: number
  username: string
  avatar: string
  role_id: number
  contacts: IReportContacts
}

export interface IReporter {
  id: number
  username: string
  avatar: string
  role_id: number
  contacts: IReportContacts
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
}
