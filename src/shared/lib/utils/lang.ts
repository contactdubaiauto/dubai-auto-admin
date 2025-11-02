import { useI18n } from 'vue-i18n'

export function getDataByLang({ key = 'name', data = {} }: { key?: string; data: any }) {
  const { locale } = useI18n()
  try {
    if (locale.value === 'en') {
      return data[key]
    }
    if (locale.value === 'ru') {
      return data[`${key}_${locale.value}`]
    }
  } catch (e) {
    console.log(e)
  }
  return ''
}
