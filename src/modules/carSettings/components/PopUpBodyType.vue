<template>
  <Dialog
    :visible="true"
    modal
    :header="t('carSettings.bodyType.title')"
    @update:visible="cancel"
    :style="{ width: '25rem' }"
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
          class="w-32 h-32 rounded-md bg-gray-100 object-contain object-center"
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
          <div class="flex flex-col gap-1">
            <label>{{ t('base.name') }} (ae)</label>
            <InputText v-model="form.name_ae" :disabled="loading" style="direction: rtl; text-align: right;" />
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
  import { Button, InputText, Dialog, FileUpload } from 'primevue'
  import { useI18n } from 'vue-i18n'

  import type { IBodyTypeForm, IBodyTypeItem } from '../types'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: IBodyTypeItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )

  const { t } = useI18n()

  const form = reactive<IBodyTypeForm>({
    image: '',
    name: '',
    name_ru: '',
    name_ae: ''
  })
  const previewImage = ref('')

  if (props.item) {
    form.name = props.item.name
    form.name_ru = props.item.name_ru
    form.name_ae = props.item.name_ae
    form.image = props.item.image
    if (form.image) {
      previewImage.value = form.image
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
