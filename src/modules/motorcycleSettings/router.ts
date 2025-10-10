const Module = () => import('./Module.vue')

const Categories = () => import('./pages/Categories.vue')
const Brands = () => import('./pages/Brands.vue')
const Models = () => import('./pages/Models.vue')
const Parameters = () => import('./pages/Parameters.vue')
const ParameterValues = () => import('./pages/ParameterValues.vue')

const moduleRoute = {
  path: '/motorcycle-settings',
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
      path: 'category/:category/brand/:model/models',
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
