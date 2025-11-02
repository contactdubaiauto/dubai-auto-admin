import { createI18n } from 'vue-i18n'

import ru from '@/shared/lib/locales/ru'
import en from '@/shared/lib/locales/en'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  globalInjection: true,
  messages: {
    ru: ru,
    en: en
  }
})

export { i18n }
