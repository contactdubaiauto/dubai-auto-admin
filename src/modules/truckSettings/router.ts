const Module = () => import('./Module.vue')

const Categories = () => import('./pages/Categories.vue')
const Brands = () => import('./pages/Brands.vue')
const Models = () => import('./pages/MOdels.vue')
const BodyTypes = () => import('./pages/BodyTypes.vue')

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
      path: 'brands',
      component: Brands
    },
    {
      path: 'models',
      component: Models
    },
    {
      path: 'body-types',
      component: BodyTypes
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
