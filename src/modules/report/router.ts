const Module = () => import('./Module.vue')

const Report = () => import('./pages/Report.vue')

const moduleRoute = {
  path: '/reports',
  component: Module,
  children: [
    {
      path: '',
      component: Report
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
