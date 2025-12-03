import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuth } from '@/modules/auth/stores'

export function permissionsMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const auth = useAuth()
  const requiredPermission = to.meta.permission as string | undefined

  // Если маршрут не требует разрешения, разрешаем доступ
  if (!requiredPermission) {
    next()
    return
  }

  // Проверяем, есть ли у пользователя необходимое разрешение
  if (auth.hasPermission(requiredPermission)) {
    next()
  } else {
    // Перенаправляем на страницу 404
    next('/404')
  }
}

