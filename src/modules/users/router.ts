const Module = () => import('./Module.vue')

const Dealers = () => import('./pages/Dealers.vue')
const CarServices = () => import('./pages/CarServices.vue')
const Logistics = () => import('./pages/Logistics.vue')
const Application = () => import('./pages/Application.vue')
const Brokers = () => import('./pages/Brokers.vue')
const Clients = () => import('./pages/Clients.vue')

const moduleRoute = {
  path: '/user',
  component: Module,
  redirect: '',
  meta: { permission: 'user' },
  children: [
    {
      path: 'dealers',
      component: Dealers,
      meta: { permission: 'user' }
    },
    {
      path: 'car-services',
      component: CarServices,
      meta: { permission: 'user' }
    },
    {
      path: 'logistics',
      component: Logistics,
      meta: { permission: 'user' }
    },
    {
      path: 'brokers',
      component: Brokers,
      meta: { permission: 'user' }
    },
    {
      path: 'clients',
      component: Clients,
      meta: { permission: 'user' }
    },
    {
      path: 'view/:id',
      component: Application,
      meta: { permission: 'user' }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
