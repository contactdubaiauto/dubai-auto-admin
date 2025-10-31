import cityApi from './city.api'
import colorApi from './color.api'
import companyTypeApi from './companyType.api'
import activityFieldApi from './activityField.api'
import regionApi from './region.api'

export const api = {
  ...cityApi,
  ...regionApi,
  ...colorApi,
	...activityFieldApi,
	...companyTypeApi
}
