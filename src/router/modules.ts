import { registerModules } from './register-modules'

import home from '@/modules/home'
import carSettings from '@/modules/carSettings'
import motorcycleSettings from '@/modules/motorcycleSettings'
import truckSettings from '@/modules/truckSettings'
import settings from '@/modules/settings'
import user from '@/modules/users'

registerModules({
  home: home,
  carSettings,
  motorcycleSettings,
  truckSettings,
  settings,
  user
})
