const Module = () => import('./Module.vue')

const Categories = () => import('./pages/Categories.vue')
const Parameters = () => import('./pages/Parameters.vue')
const Brands = () => import('./pages/Brands.vue')
const Models = () => import('./pages/Models.vue')
const CategoryParameters = () => import('./pages/CategoryParameters.vue')
const ParameterValues = () => import('./pages/ParameterValues.vue')

const moduleRoute = {
  path: '/truck-settings',
  component: Module,
  redirect: '',
  meta: { permission: 'trucks' },
  children: [
    {
      path: 'categories',
      component: Categories,
      meta: { permission: 'trucks' }
    },
    {
      path: 'category/:category/brands',
      component: Brands,
      meta: { permission: 'trucks' }
    },
    {
      path: 'category/:category/parameters',
      component: CategoryParameters,
      meta: { permission: 'trucks' }
    },
    {
      path: 'category/:category/brand/:brand/models',
      component: Models,
      meta: { permission: 'trucks' }
    },
    {
      path: 'parameters',
      component: Parameters,
      meta: { permission: 'trucks' }
    },
    {
      path: 'parameter/:parameter/values',
      component: ParameterValues,
      meta: { permission: 'trucks' }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
