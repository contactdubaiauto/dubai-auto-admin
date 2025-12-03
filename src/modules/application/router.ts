const Module = () => import('./Module.vue')

const Dealers = () => import('./pages/Dealers.vue')
const CarServices = () => import('./pages/CarServices.vue')
const Logistics = () => import('./pages/Logistics.vue')
const Application = () => import('./pages/Application.vue')
const Brokers = () => import('./pages/Brokers.vue')

const moduleRoute = {
  path: '/application',
  component: Module,
  redirect: '',
  meta: { permission: 'application' },
  children: [
    {
      path: 'dealers',
      component: Dealers,
      meta: { permission: 'application' }
    },
    {
      path: 'car-services',
      component: CarServices,
      meta: { permission: 'application' }
    },
    {
      path: 'logistics',
      component: Logistics,
      meta: { permission: 'application' }
    },
    {
      path: 'brokers',
      component: Brokers,
      meta: { permission: 'application' }
    },
    {
      path: 'view/:id',
      component: Application,
      meta: { permission: 'application' }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
