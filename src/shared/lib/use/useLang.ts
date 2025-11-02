import { useI18n } from 'vue-i18n'

export function useLang() {
  const { locale } = useI18n()

  function getDataByLang({ key = 'name', data = {} }: { key?: string; data: any }) {
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

  return {
    getDataByLang
  }
}
