const Module = () => import('./Module.vue')

const Categories = () => import('./pages/Categories.vue')
const Parameters = () => import('./pages/Parameters.vue')
const Brands = () => import('./pages/Brands.vue')
const Models = () => import('./pages/Models.vue')
const CategoryParameters = () => import('./pages/CategoryParameters.vue')
const ParameterValues = () => import('./pages/ParameterValues.vue')

const moduleRoute = {
  path: '/motorcycle-settings',
  component: Module,
  redirect: '',
  meta: { permission: 'motorcycles' },
  children: [
    {
      path: 'categories',
      component: Categories,
      meta: { permission: 'motorcycles' }
    },
    {
      path: 'category/:category/brands',
      component: Brands,
      meta: { permission: 'motorcycles' }
    },
    {
      path: 'category/:category/parameters',
      component: CategoryParameters,
      meta: { permission: 'motorcycles' }
    },
    {
      path: 'category/:category/brand/:brand/models',
      component: Models,
      meta: { permission: 'motorcycles' }
    },
    {
      path: 'parameters',
      component: Parameters,
      meta: { permission: 'motorcycles' }
    },
    {
      path: 'parameter/:parameter/values',
      component: ParameterValues,
      meta: { permission: 'motorcycles' }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
