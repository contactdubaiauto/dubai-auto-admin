import brandApi from './brand.api'
import categoryApi from './category.api'
import modelApi from './model.api'
import engineApi from './engine.api'

export const api = {
  ...categoryApi,
  ...brandApi,
  ...modelApi,
  ...engineApi
}
