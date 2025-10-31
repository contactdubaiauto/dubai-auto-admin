import { registerModules } from './register-modules'

import home from '@/modules/home'
import carSettings from '@/modules/carSettings'
import motorcycleSettings from '@/modules/motorcycleSettings'
import truckSettings from '@/modules/truckSettings'
import general from '@/modules/general'
import user from '@/modules/users'
import auth from '@/modules/auth'
import application from '@/modules/application'

registerModules({
  home,
  carSettings,
  motorcycleSettings,
  truckSettings,
  general,
  user,
  auth,
  application
})
