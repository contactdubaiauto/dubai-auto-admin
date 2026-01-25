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

export interface INotificationForm {
  title: string
  role_id: number
  description: string
}

export interface INotification extends INotificationForm {
  id: number
  user_role_id: number
  created_at: string
}
