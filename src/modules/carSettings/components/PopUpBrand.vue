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
        <div class="flex flex-col gap-1">
          <label for="brand">Brand</label>
          <InputText v-model="form.name" id="brand" :disabled="loading" />
        </div>
        <div class="flex items-center gap-1 mt-4">
          <Checkbox v-model="form.popular" inputId="popular" name="popular" binary :disabled="loading" />
          <label for="popular">Popular</label>
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
  import { Button, InputText, Dialog, FileUpload, Checkbox } from 'primevue'

  import type { IBrandItem, IBrandForm } from '../types'
  import { baseURL } from '@/shared/lib/utils/urls'

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
    logo: '',
    name: '',
    popular: false
  })

  const previewImage = ref('')

  if (props.item) {
    form.name = props.item.name
    form.popular = props.item.popular
    form.logo = props.item.logo
    if (form.logo) {
      previewImage.value = `${baseURL}${form.logo}`
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
