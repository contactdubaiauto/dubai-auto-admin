<template>
  <Dialog
    :visible="true"
    modal
    :header="t('carSettings.generation.title')"
    :style="{ width: '28rem' }"
    @update:visible="cancel"
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
          <label>{{ t('base.name') }} (en)</label>
          <InputText v-model="form.name" :disabled="loading" />
        </div>
        <div class="flex flex-col gap-1 col-span-2">
          <label>{{ t('base.name') }} (ру)</label>
          <InputText v-model="form.name_ru" :disabled="loading" />
        </div>
        <div class="flex flex-col gap-1 col-span-1">
          <label>{{ t('carSettings.generation.startYear') }}</label>
          <InputNumber v-model="form.start_year" inputId="startyear" fluid :disabled="loading" />
        </div>
        <div class="flex flex-col gap-1 col-span-1">
          <label>{{ t('carSettings.generation.endYear') }}</label>
          <InputNumber v-model="form.end_year" inputId="endyear" fluid :disabled="loading" />
        </div>
        <div class="flex items-center gap-1 mt-4">
          <Checkbox v-model="form.wheel" inputId="wheel" name="wheel" binary :disabled="loading" />
          <label>{{ t('carSettings.generation.wheel') }}</label>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel"></Button>
      <Button type="button" :label="t('base.save')" :loading="loading" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { Button, InputText, Dialog, FileUpload, Checkbox, InputNumber } from 'primevue'
  import { useI18n } from 'vue-i18n'

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

  const form = reactive<IGenerationForm>({
    image: '',
    model_id: 0,
    name: '',
    name_ru: '',
    end_year: 0,
    start_year: 0,
    wheel: true
  })

  const previewImage = ref('')

  if (props.item) {
    form.name = props.item.name
    form.name_ru = props.item.name_ru
    form.model_id = props.item.model_id
    form.end_year = props.item.end_year
    form.start_year = props.item.start_year
    form.wheel = props.item.wheel
    form.image = props.item.image
    if (form.image) {
      previewImage.value = `${form.image}_l.jpg`
    }
  }

  function onFileSelect(event: any) {
    const file = event.files[0]
    form.image = file
    previewImage.value = URL.createObjectURL(file)
  }

  function cancel() {
    emit('cancel')
  }
  function save() {
    emit('save', form)
  }
</script>

<style scoped></style>
