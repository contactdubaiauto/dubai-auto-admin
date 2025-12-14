<template>
  <Dialog
    :visible="true"
    modal
    :header="t('carSettings.generation.title')"
    :style="{ width: '28rem' }"
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
            accept="image/*"
            class="p-button-outlined"
            :disabled="loading"
            :chooseLabel="t('base.choose')"
          />
          <img
            v-if="previewImage"
            :src="previewImage"
            class="w-32 h-32 rounded-md bg-gray-100 object-cover object-center"
          />
          <div v-else class="w-32 h-32 bg-gray-100 rounded-md"></div>
        </div>
        <div class="flex-1 grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1 col-span-2">
            <label>{{ t('base.name') }} (en) <span class="text-red-500">*</span></label>
            <InputText name="name" :disabled="loading" />
            <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
              $form.name.error.message
            }}</Message>
          </div>
          <div class="flex flex-col gap-1 col-span-2">
            <label>{{ t('base.name') }} (ру) <span class="text-red-500">*</span></label>
            <InputText name="name_ru" :disabled="loading" />
            <Message v-if="$form.name_ru?.invalid" severity="error" size="small" variant="simple">{{
              $form.name_ru.error.message
            }}</Message>
          </div>
          <div class="flex flex-col gap-1 col-span-2">
            <label>{{ t('base.name') }} (ae) <span class="text-red-500">*</span></label>
            <InputText name="name_ae" :disabled="loading" style="direction: rtl; text-align: right;" />
            <Message v-if="$form.name_ae?.invalid" severity="error" size="small" variant="simple">{{
              $form.name_ae.error.message
            }}</Message>
          </div>
          <div class="flex flex-col gap-1 col-span-1">
            <label>{{ t('carSettings.generation.startYear') }}</label>
            <InputNumber name="start_year" inputId="startyear" fluid :disabled="loading" />
          </div>
          <div class="flex flex-col gap-1 col-span-1">
            <label>{{ t('carSettings.generation.endYear') }}</label>
            <InputNumber name="end_year" inputId="endyear" fluid :disabled="loading" />
          </div>
          <div class="flex items-center gap-1 mt-4">
            <Checkbox name="wheel" inputId="wheel" binary :disabled="loading" />
            <label>{{ t('carSettings.generation.wheel') }}</label>
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
  import { Button, InputText, Dialog, FileUpload, Checkbox, InputNumber, Message } from 'primevue'
  import { Form } from '@primevue/forms'
  import { useI18n } from 'vue-i18n'
  import { useFormValidation } from '@/shared/lib/use/useFormValidation'

  import type { IGenerationItem, IGenerationForm } from '../types'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: IGenerationItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )
  const { t } = useI18n()
  const { createNameFieldsResolver } = useFormValidation()

  const form = ref<IGenerationForm>({
    image: props.item?.image || '',
    model_id: props.item?.model_id || 0,
    name: props.item?.name || '',
    name_ru: props.item?.name_ru || '',
    name_ae: props.item?.name_ae || '',
    end_year: props.item?.end_year || 0,
    start_year: props.item?.start_year || 0,
    wheel: props.item?.wheel ?? true
  })

  const previewImage = ref('')

  if (props.item && props.item.image) {
    previewImage.value = `${props.item.image}_l.jpg`
  }

  const resolver = createNameFieldsResolver()

  function onFileSelect(event: any) {
    const file = event.files[0]
    form.value.image = file
    previewImage.value = URL.createObjectURL(file)
  }

  function cancel() {
    emit('cancel')
  }

  function onFormSubmit({ states, valid }: any) {
    if (valid) {
      const formData: IGenerationForm = {
        image: form.value.image,
        model_id: form.value.model_id,
        name: states.name.value,
        name_ru: states.name_ru.value,
        name_ae: states.name_ae.value,
        start_year: states.start_year.value,
        end_year: states.end_year.value,
        wheel: states.wheel.value
      }
      emit('save', formData)
    }
  }
</script>

<style scoped></style>
