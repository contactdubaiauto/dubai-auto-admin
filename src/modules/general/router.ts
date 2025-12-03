
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
  meta: { permission: 'general' },
  children: [
    {
      path: 'cities',
      component: Cities,
      meta: { permission: 'general' }
    },
    {
      path: 'city/:city/regions',
      component: Regions,
      meta: { permission: 'general' }
    },
    {
      path: 'colors',
      component: Colors,
      meta: { permission: 'general' }
    },
		{
			path: 'activity-fields',
			component: ActivityFields,
			meta: { permission: 'general' }
		},
    {
      path: 'company-types',
      component: CompanyTypes,
      meta: { permission: 'general' }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
