const Module = () => import('./Module.vue')

const AdminUsers = () => import('./pages/AdminUsers.vue')
const Notifications = () => import('./pages/Notifications.vue')

const moduleRoute = {
  path: '/settings',
  component: Module,
  redirect: '/settings/admin-users',
  meta: { permission: 'settings' },
  children: [
    {
      path: 'admin-users',
      component: AdminUsers,
      meta: { permission: 'settings' }
    },
    {
      path: 'notifications',
      component: Notifications,
      meta: { permission: 'settings' }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
