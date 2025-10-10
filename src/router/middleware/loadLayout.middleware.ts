import type { RouteLocationNormalized } from 'vue-router'
import { LayoutsEnum, LayoutToFileMap } from '@/layouts/layouts.types'

export async function loadLayoutMiddleware(route: RouteLocationNormalized): Promise<void> {
  const { layout }: { layout?: LayoutsEnum } = route.meta
  const normalizedLayoutName = layout || LayoutsEnum.default

  const fileName = LayoutToFileMap[normalizedLayoutName]
  const fileNameWithoutExtension = fileName.split('.vue')[0]

  const component = await import(`../../layouts/${fileNameWithoutExtension}.vue`)
  route.meta.layoutComponent = component.default
}
