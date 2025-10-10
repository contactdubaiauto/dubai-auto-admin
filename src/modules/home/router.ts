const Module = () => import('./Module.vue')

const Home = () => import('./pages/Home.vue')

const moduleRoute = {
  path: '/',
  component: Module,
  children: [
    {
      path: '',
      component: Home
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
