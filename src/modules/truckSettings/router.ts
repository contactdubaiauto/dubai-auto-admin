const Module = () => import('./Module.vue')

const Categories = () => import('./pages/Categories.vue')
const Brands = () => import('./pages/Brands.vue')
const Models = () => import('./pages/Models.vue')
const Engines = () => import('./pages/Engines.vue')

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
      path: 'brands',
      component: Brands,
      meta: { permission: 'trucks' }
    },
    {
      path: 'brand/:brand/models',
      component: Models,
      meta: { permission: 'trucks' }
    },
    {
      path: 'engines',
      component: Engines,
      meta: { permission: 'trucks' }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
