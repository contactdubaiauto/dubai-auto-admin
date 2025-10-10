import bodyTypeApi from './bodyType.api'
import brandApi from './brand.api'
import drivetrainApi from './drivetrain.api'
import engineApi from './engine.api'
import fuelTypeApi from './fuelType.api'
import generationApi from './generation.api'
import generationModificationApi from './generationModification.api'
import modelApi from './model.api'
import transmissionApi from './transmission.api'

export const api = {
  ...bodyTypeApi,
  ...brandApi,
  ...modelApi,
  ...generationApi,
  ...generationModificationApi,
  ...drivetrainApi,
  ...engineApi,
  ...fuelTypeApi,
  ...transmissionApi
}
