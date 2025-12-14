<template>
  <Dialog
    :visible="true"
    modal
    :header="t('carSettings.brand.title')"
    :style="{ width: '25rem' }"
    @update:visible="cancel"
  >
    <Form
      v-slot="$form"
      :initialValues="form"
      :resolver="resolver"
      :validateOnBlur="true"
      @submit="onFormSubmit"
    >
      <div class="flex gap-4">
        <div class="flex flex-col items-center gap-2">
          <FileUpload
            mode="basic"
            @select="onFileSelect"
            customUpload
            auto
            :chooseLabel="t('base.choose')"
            accept="image/*"
            class="p-button-outlined"
            :disabled="loading"
          />
          <img
            v-if="previewImage"
            :src="previewImage"
            class="w-32 h-32 rounded-md bg-gray-100 object-cover object-center"
          />
          <div v-else class="w-32 h-32 bg-gray-100 rounded-md"></div>
        </div>
        <div class="flex-1">
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
            <div class="flex items-center gap-1">
              <Checkbox name="popular" inputId="popular" binary :disabled="loading" />
              <label for="popular">{{ t('base.popular') }}</label>
            </div>
          </div>
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
  import { useI18n } from 'vue-i18n'
  import { Button, InputText, Dialog, FileUpload, Checkbox, Message } from 'primevue'
  import { Form } from '@primevue/forms'
  import { useFormValidation } from '@/shared/lib/use/useFormValidation'

  import type { IBrandItem, IBrandForm } from '../types'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: IBrandItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )

  const { t } = useI18n()
  const { createNameFieldsResolver } = useFormValidation()

  const form = ref<IBrandForm>({
    logo: props.item?.logo || '',
    name: props.item?.name || '',
    name_ru: props.item?.name_ru || '',
    name_ae: props.item?.name_ae || '',
    popular: props.item?.popular || false
  })

  const previewImage = ref('')

  if (props.item && props.item.logo) {
    previewImage.value = `${props.item.logo}`
  }

  const resolver = createNameFieldsResolver()

  function onFileSelect(event: any) {
    const file = event.files[0]
    form.value.logo = file
    previewImage.value = URL.createObjectURL(file)
  }

  function cancel() {
    emit('cancel')
  }

  function onFormSubmit({ states, valid }: any) {
    if (valid) {
      const formData: IBrandForm = {
        logo: form.value.logo,
        name: states.name.value,
        name_ru: states.name_ru.value,
        name_ae: states.name_ae.value,
        popular: states.popular.value
      }
      emit('save', formData)
    }
  }
</script>

<style scoped></style>
