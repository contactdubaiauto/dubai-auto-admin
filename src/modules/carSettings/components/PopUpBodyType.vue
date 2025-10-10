<template>
  <Dialog :visible="true" modal header="Body type" @update:visible="cancel" :style="{ width: '25rem' }">
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
      <div class="flex-1">
        <div class="flex flex-col gap-1">
          <label for="body-type">Body type name</label>
          <InputText v-model="form.name" id="body-type" />
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

  const form = reactive<IBodyTypeForm>({
    image: '',
    name: ''
  })

  if (props.item) {
    form.name = props.item.name
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
