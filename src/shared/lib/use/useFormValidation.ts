import { useI18n } from 'vue-i18n'

export function useFormValidation() {
  const { t } = useI18n()

  /**
   * Создает resolver для валидации полей name, name_ru, name_ae
   * Все три поля обязательны
   */
  function createNameFieldsResolver() {
    return ({ values }: any) => {
      const errors = {} as any

      if (!values.name || !values.name.trim()) {
        errors.name = [{ message: t('validation.required') }]
      }

      if (!values.name_ru || !values.name_ru.trim()) {
        errors.name_ru = [{ message: t('validation.required') }]
      }

      if (!values.name_ae || !values.name_ae.trim()) {
        errors.name_ae = [{ message: t('validation.required') }]
      }

      return { errors }
    }
  }

  /**
   * Создает resolver для валидации указанных обязательных полей
   * @param fields - массив названий полей для проверки
   */
  function createRequiredFieldsResolver(fields: string[]) {
    return ({ values }: any) => {
      const errors = {} as any

      fields.forEach((field) => {
        if (!values[field] || (typeof values[field] === 'string' && !values[field].trim())) {
          errors[field] = [{ message: t('validation.required') }]
        }
      })

      return { errors }
    }
  }

  /**
   * Создает resolver для полей с кастомными правилами валидации
   * @param rules - объект с правилами валидации для каждого поля
   */
  function createCustomResolver(rules: Record<string, (value: any) => string | null>) {
    return ({ values }: any) => {
      const errors = {} as any

      Object.keys(rules).forEach((field) => {
        const errorMessage = rules[field](values[field])
        if (errorMessage) {
          errors[field] = [{ message: errorMessage }]
        }
      })

      return { errors }
    }
  }

  return {
    createNameFieldsResolver,
    createRequiredFieldsResolver,
    createCustomResolver
  }
}

