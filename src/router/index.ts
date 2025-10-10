import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { loadLayoutMiddleware } from '@/router/middleware/loadLayout.middleware'

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

  next()
})

router.beforeEach(loadLayoutMiddleware)

export default router
