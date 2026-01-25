import adminUserApi from './adminUsers.api'
import notificationsApi from './notifications.api'

export const api = {
  ...adminUserApi,
  ...notificationsApi
}
