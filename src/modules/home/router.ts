const Module = () => import('./Module.vue')

const Home = () => import('./pages/Home.vue')
const NotFound = () => import('./pages/NotFound.vue')
const moduleRoute = {
  path: '/',
  component: Module,
  children: [
    {
      path: '',
      component: Home
    },
    {
      path: '404',
      component: NotFound
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
