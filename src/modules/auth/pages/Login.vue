<template>
  <div class="flex justify-center items-center h-screen">
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      :validateOnValueUpdate="false"
      :validateOnBlur="true"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full sm:w-80"
    >
      <div class="w-full text-2xl font-bold text-center mb-4 text-blue-800">Masynbazar</div>
      <div class="flex flex-col gap-1">
        <label class="mb-1">Email <span class="text-red-500">*</span></label>
        <InputText name="email" type="text" fluid :disabled="loading" />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <label class="mb-1">Password <span class="text-red-500">*</span></label>
        <Password name="password" :feedback="false" toggleMask fluid :disabled="loading" />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error.message
        }}</Message>
      </div>
      <Button type="submit" label="Submit" :loading="loading" fluid />
    </Form>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'

  import { Form } from '@primevue/forms'
  import { InputText, Message, Button, Password } from 'primevue'
  import { useCookies } from 'vue3-cookies'

  import { api } from '../api'

  const router = useRouter()
  const { cookies } = useCookies()
  const { t } = useI18n()
  const toast = useToast()

  const initialValues = ref({
    email: '',
    password: ''
  })

  function resolver({ values }: any) {
    const errors = {} as any

    if (!values.email || !values.email.trim()) {
      errors.email = [{ message: t('validation.emailRequired') }]
    }

    if (!values.password || !values.password.trim()) {
      errors.password = [{ message: t('validation.passwordRequired') }]
    }
    return {
      errors
    }
  }

  const loading = ref(false)
  async function onFormSubmit({ states, valid }: any) {
    if (valid) {
      try {
        loading.value = true
        const { access_token } = await api.login({
          form: {
            email: states.email.value,
            password: states.password.value
          }
        })
        cookies.set('access_token', access_token, 60 * 60 * 1000)
        cookies.set('refresh_token', access_token, 60 * 60 * 1000)

        toast.add({
          severity: 'success',
          summary: t('toast.loginSuccess'),
          life: 3000
        })

        router.push('/')
      } catch (error) {
        console.error(error)
        toast.add({
          severity: 'error',
          summary: t('base.error'),
          detail: t('toast.loginError'),
          life: 3000
        })
        loading.value = false
      }
    }
  }
</script>
