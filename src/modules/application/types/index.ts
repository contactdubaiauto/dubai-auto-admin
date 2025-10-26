export interface IApplication {
  id: number
  index?: number
  company_name: string
  created_at: string
  email: string
  full_name: string
  licence_expiry_date: string
  licence_issue_date: string
  phone: string
  status: string
}

export interface IApplicationItem {
  id: number
  company_name: string
  created_at: string
  email: string
  full_name: string
  licence_expiry_date: string
  licence_issue_date: string
  phone: string
  status: string
  licence_url: string
  memorandum_url: string
  copy_of_id_url: string
  company_type: string
  activity_field: string
  vat_number: string
	address: string
}
