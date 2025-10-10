<template>
  <Dialog :visible="true" modal header="Generation" :style="{ width: '28rem' }" @update:visible="cancel">
    <div class="flex gap-4">
      <div class="flex flex-col items-center gap-2">
        <FileUpload mode="basic" @select="onFileSelect" customUpload auto accept="image/*" class="p-button-outlined" />
        <img
          v-if="previewImage"
          :src="previewImage"
          class="w-32 h-32 rounded-md bg-gray-100 object-cover object-center"
        />
        <div v-else class="w-32 h-32 bg-gray-100 rounded-md"></div>
      </div>
      <div class="flex-1 grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1 col-span-2">
          <label>Generation name</label>
          <InputText v-model="form.name" />
        </div>
        <div class="flex flex-col gap-1 col-span-1">
          <label>Start year</label>
          <InputNumber v-model="form.start_year" inputId="integeronly" fluid />
        </div>
        <div class="flex flex-col gap-1 col-span-1">
          <label>End year</label>
          <InputNumber v-model="form.end_year" inputId="integeronly" fluid />
        </div>
        <div class="flex items-center gap-1 mt-4">
          <Checkbox v-model="form.wheel" inputId="wheel" name="wheel" binary />
          <label for="wheel">Wheel</label>
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
  import { Button, InputText, Dialog, FileUpload, Checkbox, InputNumber } from 'primevue'

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

  const form = reactive<IGenerationForm>({
    image: '',
    model_id: 0,
    name: '',
    end_year: 0,
    start_year: 0,
    wheel: true
  })

  if (props.item) {
    form.name = props.item.name
    form.model_id = props.item.model_id
    form.end_year = props.item.end_year
    form.start_year = props.item.start_year
    form.wheel = props.item.wheel
  }

  const previewImage = ref('')
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
