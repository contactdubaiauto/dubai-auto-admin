
const Module = () => import('./Module.vue')

const Cities = () => import('./pages/Cities.vue')
const Regions = () => import('./pages/Regions.vue')
const Colors = () => import('./pages/Colors.vue')
const ActivityFields = () => import('./pages/ActivityFields.vue')
const CompanyTypes = () => import('./pages/CompanyTypes.vue')

const moduleRoute = {
  path: '/general',
  component: Module,
  redirect: '',
  children: [
    {
      path: 'cities',
      component: Cities
    },
    {
      path: 'city/:city/regions',
      component: Regions
    },
    {
      path: 'colors',
      component: Colors
    },
		{
			path: 'activity-fields',
			component: ActivityFields
		},
    {
      path: 'company-types',
      component: CompanyTypes
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
