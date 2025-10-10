import cityApi from './city.api'
import colorApi from './color.api'
import regionApi from './region.api'

export const api = {
  ...cityApi,
  ...regionApi,
  ...colorApi
}
