<template>
  <Dialog
    :visible="true"
    modal
    :header="t('carSettings.drivetrain.title')"
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
          <label>{{ t('base.name') }} (en) <span class="text-red-500">*</span></label>
          <InputText name="name" :disabled="loading" />
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
            $form.name.error.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <label>{{ t('base.name') }} (ру) <span class="text-red-500">*</span></label>
          <InputText name="name_ru" :disabled="loading" />
          <Message v-if="$form.name_ru?.invalid" severity="error" size="small" variant="simple">{{
            $form.name_ru.error.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <label>{{ t('base.name') }} (ae) <span class="text-red-500">*</span></label>
          <InputText name="name_ae" :disabled="loading" style="direction: rtl; text-align: right;" />
          <Message v-if="$form.name_ae?.invalid" severity="error" size="small" variant="simple">{{
            $form.name_ae.error.message
          }}</Message>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel" :disabled="loading"></Button>
        <Button type="submit" :label="t('base.save')" :loading="loading"></Button>
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, InputText, Dialog, Message } from 'primevue'
  import { Form } from '@primevue/forms'
  import { useI18n } from 'vue-i18n'
  import { useFormValidation } from '@/shared/lib/use/useFormValidation'

  import type { IDrivetrainForm, IDrivetrainItem } from '../types'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: IDrivetrainItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )

  const { t } = useI18n()
  const { createNameFieldsResolver } = useFormValidation()

  const form = ref<IDrivetrainForm>({
    name: props.item?.name || '',
    name_ru: props.item?.name_ru || '',
    name_ae: props.item?.name_ae || ''
  })

  const resolver = createNameFieldsResolver()

  function cancel() {
    emit('cancel')
  }

  function onFormSubmit({ states, valid }: any) {
    if (valid) {
      const formData: IDrivetrainForm = {
        name: states.name.value,
        name_ru: states.name_ru.value,
        name_ae: states.name_ae.value
      }
      emit('save', formData)
    }
  }
</script>

<style scoped></style>
