export interface IAdminUserForm {
  email: string
  password: string
  permissions: string[]
  username: string
}

export interface IAdminUser extends IAdminUserForm {
  id: number
  created_at: string
}
