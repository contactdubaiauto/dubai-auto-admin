import brandApi from './brand.api'
import categoryApi from './category.api'
import modelApi from './model.api'
import parameterApi from './parameter.api'
import parameterValueApi from './parameterValue.api'

export const api = {
  ...categoryApi,
  ...brandApi,
  ...modelApi,
  ...parameterApi,
  ...parameterValueApi
}
