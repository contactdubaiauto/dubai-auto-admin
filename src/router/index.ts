import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import { loadLayoutMiddleware } from '@/router/middleware/loadLayout.middleware'
import { permissionsMiddleware } from '@/router/middleware/permissions.middleware'
import { useAuth } from '@/modules/auth/stores'

const routes: Array<RouteRecordRaw> = []

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  to
  from

  const { cookies } = useCookies()
  const auth = useAuth()

  if (!auth.isAuth && cookies.get('access_token')) {
    await auth.getProfile()
  }

  if (!auth.isAuth && !to.meta.noAuth) {
    next('/login')
    return
  }
  next()
})

router.beforeEach(loadLayoutMiddleware)
router.beforeEach(permissionsMiddleware)

export default router
