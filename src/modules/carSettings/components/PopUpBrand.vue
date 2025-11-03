<template>
  <Dialog
    :visible="true"
    modal
    :header="t('carSettings.brand.title')"
    :style="{ width: '25rem' }"
    @update:visible="cancel"
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
            <label>{{ t('base.name') }} (en)</label>
            <InputText v-model="form.name" :disabled="loading" />
          </div>
          <div class="flex flex-col gap-1">
            <label>{{ t('base.name') }} (ру)</label>
            <InputText v-model="form.name_ru" :disabled="loading" />
          </div>
          <div class="flex items-center gap-1">
            <Checkbox v-model="form.popular" inputId="popular" name="popular" binary :disabled="loading" />
            <label for="popular">{{ t('base.popular') }}</label>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel" :disabled="loading"></Button>
      <Button type="button" :label="t('base.save')" :loading="loading" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Button, InputText, Dialog, FileUpload, Checkbox } from 'primevue'

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

  const form = reactive<IBrandForm>({
    logo: '',
    name: '',
    name_ru: '',
    popular: false
  })

  const previewImage = ref('')

  if (props.item) {
    form.name = props.item.name
    form.name_ru = props.item.name_ru
    form.popular = props.item.popular
    form.logo = props.item.logo
    if (form.logo) {
      previewImage.value = `${form.logo}`
    }
  }

  function onFileSelect(event: any) {
    const file = event.files[0]
    form.logo = file
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
