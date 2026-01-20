const Module = () => import('./Module.vue')

const Categories = () => import('./pages/Categories.vue')
const Brands = () => import('./pages/Brands.vue')
const Models = () => import('./pages/Models.vue')
const Engines = () => import('./pages/Engines.vue')
const Strokes = () => import('./pages/Strokes.vue')

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
      path: 'brands',
      component: Brands,
      meta: { permission: 'motorcycles' }
    },
    {
      path: 'brand/:brand/models',
      component: Models,
      meta: { permission: 'motorcycles' }
    },
    {
      path: 'engines',
      component: Engines,
      meta: { permission: 'motorcycles' }
    },
    {
      path: 'strokes',
      component: Strokes,
      meta: { permission: 'motorcycles' }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
