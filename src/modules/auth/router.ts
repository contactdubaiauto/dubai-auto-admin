const Module = () => import('./Module.vue')

const Login = () => import('./pages/Login.vue')

const moduleRoute = {
  path: '/login',
  component: Module,
  meta: {
    layout: 'empty'
  },
  children: [
    {
      path: '',
      component: Login
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
