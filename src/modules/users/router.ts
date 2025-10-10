const Module = () => import('./Module.vue')

const Clients = () => import('./pages/Clients.vue')
const Dealers = () => import('./pages/Dealers.vue')
const Workshops = () => import('./pages/Workshops.vue')
const Logisticians = () => import('./pages/Logisticians.vue')

const moduleRoute = {
  path: '/users',
  component: Module,
  redirect: '',
  children: [
    {
      path: 'client',
      component: Clients
    },
    {
      path: 'dealer',
      component: Dealers
    },
    {
      path: 'workshop',
      component: Workshops
    },
    {
      path: 'logistician',
      component: Logisticians
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
