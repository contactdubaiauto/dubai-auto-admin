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
  children: [
    {
      path: 'dealers',
      component: Dealers
    },
    {
      path: 'car-services',
      component: CarServices
    },
    {
      path: 'logistics',
      component: Logistics
    },
    {
      path: 'brokers',
      component: Brokers
    },
    {
      path: 'view/:id',
      component: Application
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
