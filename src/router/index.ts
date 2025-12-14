import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import { loadLayoutMiddleware } from '@/router/middleware/loadLayout.middleware'
import { permissionsMiddleware } from '@/router/middleware/permissions.middleware'
import { useAuth } from '@/modules/auth/stores'
import { useChatStore } from '@/modules/chat/stores'

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
  const chatStore = useChatStore()

  if (!auth.isAuth && cookies.get('access_token')) {
    console.log('init')

    await auth.getProfile()
    chatStore.initWebSocket()
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
