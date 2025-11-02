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
  children: [
    {
      path: 'brands',
      component: Brands
    },
    {
      path: 'brand/:brand/models',
      component: Models
    },
    {
      path: 'brand/:brand/model/:model/generations/',
      component: ModelGenerations
    },
    {
      path: 'brand/:brand/model/:model/generation/:generation/modifications',
      component: GenerationModifications
    },
    {
      path: 'body-types',
      component: BodyTypes
    },
    {
      path: 'drivetrains',
      component: Drivetrains
    },
    {
      path: 'engines',
      component: Engines
    },
    {
      path: 'fuel-types',
      component: FuelTypes
    },
    {
      path: 'transmissions',
      component: Transmissions
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
