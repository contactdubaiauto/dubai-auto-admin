import { createI18n } from 'vue-i18n'

import tm from '@/shared/lib/locales/tm'
import ru from '@/shared/lib/locales/ru'
import en from '@/shared/lib/locales/en'

const i18n = createI18n({
	legacy: false,
	locale: 'tm',
	globalInjection: true,
	messages: {
		tm: tm,
		ru: ru,
		en: en
	}
})

export { i18n }
