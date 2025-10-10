export const LayoutsEnum = {
  default: 'default',
  empty: 'empty'
} as const

export type LayoutsEnum = (typeof LayoutsEnum)[keyof typeof LayoutsEnum]

export const LayoutToFileMap: Record<LayoutsEnum, string> = {
  default: 'Default.vue',
  empty: 'Empty.vue'
}
