import brandApi from './brand.api'
import categoryApi from './category.api'
import categoryParameterApi from './categoryParameter.api'
import modelApi from './model.api'
import parameterApi from './parameter.api'
import parameterValueApi from './parameterValue.api'

export const api = {
  ...categoryApi,
  ...categoryParameterApi,
  ...brandApi,
  ...modelApi,
  ...parameterApi,
  ...parameterValueApi
}
