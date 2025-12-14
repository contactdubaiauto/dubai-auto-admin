<template>
  <Dialog
    :visible="true"
    modal
    :header="t('applications.rejectMessage')"
    @update:visible="cancel"
    :style="{ width: '25rem' }"
  >
    <Form
      v-slot="$form"
      :initialValues="form"
      :resolver="resolver"
      :validateOnBlur="true"
      @submit="onFormSubmit"
    >
      <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-1">
          <label>{{ t('applications.message') }} <span class="text-red-500">*</span></label>
          <Textarea name="message" :disabled="loading" />
          <Message v-if="$form.message?.invalid" severity="error" size="small" variant="simple">{{
            $form.message.error.message
          }}</Message>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel" :disabled="loading"></Button>
        <Button type="submit" :label="t('applications.send')" :loading="loading"></Button>
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Textarea, Dialog, Message } from 'primevue'
  import { Form } from '@primevue/forms'
  import { useI18n } from 'vue-i18n'

  const emit = defineEmits(['cancel', 'save'])

  withDefaults(
    defineProps<{
      loading?: boolean
    }>(),
    {
      loading: false
    }
  )

  const { t } = useI18n()

  const form = ref({
    message: ''
  })

  function resolver({ values }: any) {
    const errors = {} as any

    if (!values.message || !values.message.trim()) {
      errors.message = [{ message: t('validation.required') }]
    }

    return { errors }
  }

  function cancel() {
    emit('cancel')
  }

  function onFormSubmit({ states, valid }: any) {
    if (valid) {
      emit('save', states.message.value)
    }
  }
</script>

<style scoped></style>
