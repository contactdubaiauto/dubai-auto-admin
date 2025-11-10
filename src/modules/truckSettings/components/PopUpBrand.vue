<template>
  <Dialog :visible="true" modal header="Brand" :style="{ width: '25rem' }" @update:visible="cancel">
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
            <label>Name (en)</label>
            <InputText v-model="form.name" :disabled="loading" />
          </div>
          <div class="flex flex-col gap-1">
            <label>Name (ru)</label>
            <InputText v-model="form.name_ru" :disabled="loading" />
          </div>
          <div class="flex flex-col gap-1">
            <label>Name (ae)</label>
            <InputText v-model="form.name_ae" :disabled="loading" style="direction: rtl; text-align: right;" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
      <Button type="button" label="Save" :loading="loading" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { Button, InputText, Dialog, FileUpload } from 'primevue'

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

  const form = reactive<IBrandForm>({
    image: '',
    name: '',
    name_ru: '',
    name_ae: '',
    comtrans_category_id: 0
  })

  const previewImage = ref('')

  if (props.item) {
    form.name = props.item.name
    form.name_ru = props.item.name_ru
    form.name_ae = props.item.name_ae
    form.image = props.item.image

    if (form.image) {
      previewImage.value = `${form.image}`
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
