const Module = () => import('./Module.vue')

const Cities = () => import('./pages/Cities.vue')
const AdminUsers = () => import('./pages/AdminUsers.vue')
const Regions = () => import('./pages/Regions.vue')
const Colors = () => import('./pages/Colors.vue')

const moduleRoute = {
  path: '/settings',
  component: Module,
  redirect: '',
  children: [
    {
      path: 'cities',
      component: Cities
    },
    {
      path: 'city/:city/regions',
      component: Regions
    },
    {
      path: 'colors',
      component: Colors
    },
    {
      path: 'admin-users',
      component: AdminUsers
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
