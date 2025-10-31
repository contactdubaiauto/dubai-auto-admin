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
  children: [
    {
      path: 'categories',
      component: Categories
    },
    {
      path: 'category/:category/brands',
      component: Brands
    },
    {
      path: 'category/:category/parameters',
      component: CategoryParameters
    },
    {
      path: 'category/:category/brand/:brand/models',
      component: Models
    },
    {
      path: 'parameters',
      component: Parameters
    },
    {
      path: 'parameter/:parameter/values',
      component: ParameterValues
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
