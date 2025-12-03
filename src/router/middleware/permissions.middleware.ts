import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuth } from '@/modules/auth/stores'

export function permissionsMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const auth = useAuth()
  const requiredPermission = to.meta.permission as string | undefined

  if (from.path === '/404') {
    next()
    return
  }

  if (!requiredPermission) {
    next()
    return
  }

  if (auth.hasPermission(requiredPermission)) {
    next()
  } else {
    next('/404')
  }
}
