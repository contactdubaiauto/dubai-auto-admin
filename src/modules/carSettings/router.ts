const Module = () => import('./Module.vue')

const Brands = () => import('./pages/Brands.vue')
const Models = () => import('./pages/Models.vue')
const BodyTypes = () => import('./pages/BodyTypes.vue')
const ModelGenerations = () => import('./pages/ModelGenerations.vue')
const Drivetrains = () => import('./pages/Drivetrains.vue')
const Engines = () => import('./pages/Engines.vue')
const FuelTypes = () => import('./pages/FuelTypes.vue')
const Transmissions = () => import('./pages/Transmissions.vue')
const GenerationModifications = () => import('./pages/GenerationModifications.vue')

const moduleRoute = {
  path: '/car-settings',
  component: Module,
  redirect: '/car-settings/brands',
  meta: { permission: 'car' },
  children: [
    {
      path: 'brands',
      component: Brands,
      meta: { permission: 'car' }
    },
    {
      path: 'brand/:brand/models',
      component: Models,
      meta: { permission: 'car' }
    },
    {
      path: 'brand/:brand/model/:model/generations/',
      component: ModelGenerations,
      meta: { permission: 'car' }
    },
    {
      path: 'brand/:brand/model/:model/generation/:generation/modifications',
      component: GenerationModifications,
      meta: { permission: 'car' }
    },
    {
      path: 'body-types',
      component: BodyTypes,
      meta: { permission: 'car' }
    },
    {
      path: 'drivetrains',
      component: Drivetrains,
      meta: { permission: 'car' }
    },
    {
      path: 'engines',
      component: Engines,
      meta: { permission: 'car' }
    },
    {
      path: 'fuel-types',
      component: FuelTypes,
      meta: { permission: 'car' }
    },
    {
      path: 'transmissions',
      component: Transmissions,
      meta: { permission: 'car' }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
